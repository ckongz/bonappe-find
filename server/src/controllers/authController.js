
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {
  User,
  LoginHistory,
  Review,
  Favorite,
  Collection,
  Notification,
  SearchHistory,
  Claim
} from '../models/index.js';

import { env } from '../config/env.js';
import { ok, check, clean, safeUser } from '../utils/http.js';
import { sendMail } from '../utils/mail.js';
import ApiError from '../utils/ApiError.js';
import { audit, notifyStaff } from '../utils/audit.js';

const hash = (value) =>
  crypto.createHash('sha256').update(value).digest('hex');

const passValid = (password) =>
  typeof password === 'string' &&
  password.length >= 8 &&
  password.length <= 128 &&
  /[A-Za-z]/.test(password) &&
  /\d/.test(password);

const token = (user) =>
  jwt.sign(
    {
      sub: String(user._id),
      ver: user.tokenVersion
    },
    env.secret,
    { expiresIn: env.expires }
  );

const inAppCodesEnabled = () =>
  process.env.IN_APP_CODES === 'true' ||
  process.env.DEMO_MODE === 'true';

const canShowCode = () =>
  env.nodeEnv !== 'production' || inAppCodesEnabled();

function logVerificationError(error) {
  console.error('Verification code generation failed:', {
    name: error?.name,
    code: error?.code,
    message: error?.message,
    stack: error?.stack
  });
}

// ======================================================
// REGISTER CUSTOMER OR RESTAURANT OWNER
// ======================================================

export async function register(req, res) {
  const errors = [];

  if (!req.body.name?.trim()) {
    errors.push({
      field: 'name',
      message: 'Please enter your name.'
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email || '')) {
    errors.push({
      field: 'email',
      message: 'Please enter a valid email address.'
    });
  }

  if (!passValid(req.body.password)) {
    errors.push({
      field: 'password',
      message: 'Password must be at least 8 characters with a letter and a number.'
    });
  }

  if (req.body.confirmPassword !== req.body.password) {
    errors.push({
      field: 'confirmPassword',
      message: 'Passwords do not match.'
    });
  }

  check(errors);

  const email = req.body.email.trim().toLowerCase();

  if (await User.exists({ email })) {
    throw new ApiError(409, 'This email is already registered.');
  }

  const owner = req.path.includes('owners');

  if (
    owner &&
    (
      !req.body.businessName?.trim() ||
      !req.body.phone?.trim() ||
      !req.body.position?.trim()
    )
  ) {
    throw new ApiError(
      422,
      'Please enter your business name, phone and position.'
    );
  }

  const user = await User.create({
    name: clean(req.body.name).slice(0, 120),
    email,
    passwordHash: await bcrypt.hash(req.body.password, 12),
    role: owner ? 'owner' : 'customer',
    ownerProfile: owner
      ? {
          businessName: clean(req.body.businessName),
          phone: clean(req.body.phone),
          position: clean(req.body.position),
          verificationStatus: 'pending'
        }
      : undefined
  });

  let delivery;

  try {
    delivery = await issueCode(user);
  } catch (error) {
    logVerificationError(error);

    delivery = {
      delivered: false,
      deliveryFailed: true,
      cooldown: 0,
      message:
        'Your account was created, but the verification code could not be generated. Please request another code from Verify Email.'
    };
  }

  await Notification.create({
    user: user._id,
    title: 'Verify your email',
    message: 'Verify your email. Tap here to verify your email address.',
    link: '/verify-email'
  });

  if (owner) {
    await notifyStaff(
      'New owner account',
      user.name,
      '/admin/owners'
    );
  }

  ok(
    res,
    {
      user: safeUser(user),
      token: token(user),
      message: delivery.message,
      delivery
    },
    {},
    201
  );
}

// ======================================================
// LOGIN
// ======================================================

export async function login(req, res) {
  const email = String(req.body.email || '')
    .trim()
    .toLowerCase();

  const user = await User.findOne({ email })
    .select('+passwordHash');

  const history = {
    email,
    user: user?._id,
    ip: req.ip,
    userAgent: req.get('user-agent')?.slice(0, 300)
  };

  if (user?.lockUntil > Date.now()) {
    throw new ApiError(
      429,
      'Account locked. Please try again in 15 minutes.'
    );
  }

  if (
    !user ||
    !(await bcrypt.compare(
      String(req.body.password || ''),
      user.passwordHash
    ))
  ) {
    if (user) {
      user.failedLoginCount++;

      if (user.failedLoginCount >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60000);
        user.failedLoginCount = 0;
      }

      await user.save();
    }

    await LoginHistory.create({
      ...history,
      success: false
    });

    throw new ApiError(
      401,
      'Email or password is incorrect.'
    );
  }

  if (user.status !== 'active') {
    throw new ApiError(
      403,
      'This account is suspended.'
    );
  }

  user.failedLoginCount = 0;
  user.lockUntil = undefined;
  user.lastLoginAt = new Date();

  await user.save();

  await LoginHistory.create({
    ...history,
    success: true
  });

  ok(res, {
    user: safeUser(user),
    token: token(user)
  });
}

// ======================================================
// LOGOUT / CURRENT USER
// ======================================================

export async function logout(req, res) {
  await User.updateOne(
    { _id: req.user._id },
    { $inc: { tokenVersion: 1 } }
  );

  ok(res, {
    message: 'You have been logged out.'
  });
}

export async function me(req, res) {
  ok(res, safeUser(req.user));
}

// ======================================================
// GENERATE VERIFICATION CODE
// ======================================================

export async function issueCode(user) {
  const code = String(
    crypto.randomInt(100000, 1000000)
  );

  // The existing mail utility must support IN_APP_CODES.
  const result = await sendMail(
    user.email,
    'Your BonAppé Find verification code',
    `Your verification code is ${code}. It expires in 10 minutes. Do not share it.`
  );

  const sentAt = new Date();

  await User.updateOne(
    { _id: user._id },
    {
      verifyHash: hash(String(user._id) + ':' + code),
      verifyUntil: new Date(Date.now() + 600000),
      verifySentAt: sentAt,
      verifyAttempts: 0
    }
  );

  user.verifySentAt = sentAt;

  return {
    delivered: result.delivered,

    ...(
      !result.delivered && canShowCode()
        ? { developmentCode: code }
        : {}
    ),

    cooldown: 60,

    message: result.delivered
      ? 'Verification code sent to your email.'
      : 'In-app verification: your code is displayed in the application popup (no email sent).'
  };
}

// ======================================================
// VERIFY CODE
// ======================================================

export async function verify(req, res) {
  if (req.user.emailVerified) {
    throw new ApiError(
      409,
      'This email is already verified.'
    );
  }

  const user = await User.findById(req.user._id)
    .select('+verifyHash +verifyUntil +verifyAttempts');

  if (
    !user.verifyHash ||
    !user.verifyUntil ||
    user.verifyUntil <= new Date()
  ) {
    throw new ApiError(
      400,
      'This code has expired or was already used. Please resend a code.'
    );
  }

  if (user.verifyAttempts >= 5) {
    throw new ApiError(
      429,
      'Too many incorrect attempts. Please resend a code.'
    );
  }

  const code = String(req.body.code || '');

  if (
    !/^\d{6}$/.test(code) ||
    hash(String(user._id) + ':' + code) !== user.verifyHash
  ) {
    await User.updateOne(
      {
        _id: user._id,
        verifyHash: user.verifyHash,
        verifyAttempts: { $lt: 5 }
      },
      { $inc: { verifyAttempts: 1 } }
    );

    throw new ApiError(
      400,
      'Incorrect verification code. Check the six digits shown in the app.'
    );
  }

  const verified = await User.findOneAndUpdate(
    {
      _id: user._id,
      email: user.email,
      emailVerified: false,
      verifyHash: user.verifyHash,
      verifyUntil: { $gt: new Date() },
      verifyAttempts: { $lt: 5 }
    },
    {
      $set: { emailVerified: true },
      $unset: {
        verifyHash: 1,
        verifyUntil: 1,
        verifyAttempts: 1
      }
    },
    { new: true }
  );

  if (!verified) {
    throw new ApiError(
      400,
      'This code is expired, already used, or has too many attempts.'
    );
  }

  ok(res, {
    user: safeUser(verified),
    message:
      verified.role === 'owner'
        ? 'Email verified. Your owner account is awaiting administrator approval. You can manage restaurant listings once approved.'
        : 'Email verified. You can now post reviews and suggest restaurants.'
  });
}

// ======================================================
// RESEND VERIFICATION CODE
// ======================================================

export async function resend(req, res) {
  if (req.user.emailVerified) {
    throw new ApiError(
      409,
      'This email is already verified.'
    );
  }

  const reserved = await User.findOneAndUpdate(
    {
      _id: req.user._id,
      $or: [
        {
          verifySentAt: {
            $lte: new Date(Date.now() - 60000)
          }
        },
        { verifySentAt: null }
      ]
    },
    {
      $set: {
        verifySentAt: new Date()
      }
    },
    { new: true }
  );

  if (!reserved) {
    throw new ApiError(
      429,
      'Please wait 60 seconds before requesting another code.'
    );
  }

  try {
    ok(res, await issueCode(reserved));
  } catch (error) {
    logVerificationError(error);

    await User.updateOne(
      { _id: reserved._id },
      { $unset: { verifySentAt: 1 } }
    );

    throw error;
  }
}

// ======================================================
// CORRECT EMAIL
// ======================================================

export async function correctEmail(req, res) {
  if (req.user.emailVerified) {
    throw new ApiError(
      409,
      'Your email is already verified.'
    );
  }

  const email = String(req.body.email || '')
    .trim()
    .toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError(
      422,
      'Enter a valid email address.'
    );
  }

  const user = await User.findById(req.user._id)
    .select('+passwordHash');

  if (
    !(await bcrypt.compare(
      String(req.body.password || ''),
      user.passwordHash
    ))
  ) {
    throw new ApiError(
      403,
      'Enter your current password to correct your email.'
    );
  }

  if (
    await User.exists({
      email,
      _id: { $ne: user._id }
    })
  ) {
    throw new ApiError(
      409,
      'This email is already registered.'
    );
  }

  if (
    user.verifySentAt &&
    Date.now() - user.verifySentAt.getTime() < 60000
  ) {
    throw new ApiError(
      429,
      'Please wait 60 seconds before changing the email and requesting a code.'
    );
  }

  user.email = email;
  user.verifyHash = undefined;
  user.verifyUntil = undefined;

  await user.save();

  const delivery = await issueCode(user);

  ok(res, {
    user: safeUser(user),
    ...delivery
  });
}

// ======================================================
// FORGOT PASSWORD
// ======================================================

export async function forgot(req, res) {
  const email = String(req.body.email || '')
    .trim()
    .toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError(
      422,
      'Enter a valid email address.'
    );
  }

  const response = {
    message:
      'If an account exists, a six-digit reset code has been sent. Codes expire in 10 minutes.',
    cooldown: 60
  };

  const user = await User.findOneAndUpdate(
    {
      email,
      $or: [
        {
          resetSentAt: {
            $lte: new Date(Date.now() - 60000)
          }
        },
        { resetSentAt: null }
      ]
    },
    {
      $set: {
        resetSentAt: new Date()
      }
    },
    { new: true }
  );

  if (user) {
    const code = String(
      crypto.randomInt(100000, 1000000)
    );

    try {
      const delivery = await sendMail(
        email,
        'Your BonAppé Find password reset code',
        `Your password reset code is ${code}. It expires in 10 minutes. Do not share it.`
      );

      await User.updateOne(
        { _id: user._id },
        {
          resetHash: hash(
            String(user._id) + ':reset:' + code
          ),
          resetUntil: new Date(Date.now() + 600000),
          resetAttempts: 0
        }
      );

      if (
        !delivery.delivered &&
        canShowCode()
      ) {
        response.developmentCode = code;
        response.message =
          'Email delivery is simulated. Your reset code is shown in the popup and server terminal.';
      }
    } catch (error) {
      logVerificationError(error);

      await User.updateOne(
        { _id: user._id },
        { $unset: { resetSentAt: 1 } }
      );

      throw error;
    }
  }

  ok(res, response);
}

// ======================================================
// RESET PASSWORD
// ======================================================

export async function reset(req, res) {
  if (!passValid(req.body.password)) {
    throw new ApiError(
      422,
      'Password must be at least 8 characters with a letter and a number.'
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    throw new ApiError(
      422,
      'Passwords do not match.'
    );
  }

  const email = String(req.body.email || '')
    .trim()
    .toLowerCase();

  const code = String(req.body.code || '');

  const user = await User.findOne({ email })
    .select('+resetHash +resetUntil +resetAttempts');

  const invalid =
    'Invalid or expired reset code. Request a new code and try again.';

  if (
    !user ||
    !user.resetHash ||
    !user.resetUntil ||
    user.resetUntil <= new Date()
  ) {
    throw new ApiError(400, invalid);
  }

  if (user.resetAttempts >= 5) {
    throw new ApiError(
      429,
      'Too many incorrect attempts. Request a new reset code.'
    );
  }

  if (
    !/^\d{6}$/.test(code) ||
    hash(String(user._id) + ':reset:' + code) !==
      user.resetHash
  ) {
    await User.updateOne(
      {
        _id: user._id,
        resetHash: user.resetHash,
        resetAttempts: { $lt: 5 }
      },
      { $inc: { resetAttempts: 1 } }
    );

    throw new ApiError(400, invalid);
  }

  const updated = await User.findOneAndUpdate(
    {
      _id: user._id,
      email,
      resetHash: user.resetHash,
      resetUntil: { $gt: new Date() },
      resetAttempts: { $lt: 5 }
    },
    {
      $set: {
        passwordHash: await bcrypt.hash(
          req.body.password,
          12
        ),
        failedLoginCount: 0
      },
      $inc: {
        tokenVersion: 1
      },
      $unset: {
        resetHash: 1,
        resetUntil: 1,
        resetAttempts: 1,
        lockUntil: 1
      }
    },
    { new: true }
  );

  if (!updated) {
    throw new ApiError(400, invalid);
  }

  ok(res, {
    message:
      'Password updated. Please log in with your new password.'
  });
}

// ======================================================
// UPDATE PROFILE
// ======================================================

export async function profile(req, res) {
  for (const key of ['name', 'avatar']) {
    if (typeof req.body[key] === 'string') {
      req.user[key] = clean(req.body[key]).slice(0, 300);
    }
  }

  if (req.body.preferences) {
    for (const key of ['emailAlerts', 'language', 'theme']) {
      if (req.body.preferences[key] != null) {
        req.user.set(
          'preferences.' + key,
          req.body.preferences[key]
        );
      }
    }
  }

  await req.user.save();

  ok(res, safeUser(req.user));
}

// ======================================================
// DOWNLOAD ACCOUNT DATA
// ======================================================

export async function download(req, res) {
  const user = req.user._id;

  const [
    reviews,
    favorites,
    collections,
    searchHistory
  ] = await Promise.all([
    Review.find({ user }),
    Favorite.find({ user }),
    Collection.find({ user }),
    SearchHistory.find({ user })
  ]);

  ok(res, {
    user: safeUser(req.user),
    reviews,
    favorites,
    collections,
    searchHistory
  });
}

// ======================================================
// DELETE ACCOUNT
// ======================================================

export async function deleteAccount(req, res) {
  if (req.user.role === 'admin') {
    throw new ApiError(
      403,
      'Ask another administrator to remove an admin account.'
    );
  }

  const user = req.user._id;

  await Promise.all([
    Favorite.deleteMany({ user }),
    Collection.deleteMany({ user }),
    Notification.deleteMany({ user }),
    SearchHistory.deleteMany({ user }),
    Claim.deleteMany({
      user,
      status: 'pending'
    })
  ]);

  await Review.updateMany(
    { user },
    {
      author: 'Deleted user',
      comment: '[Removed by author]',
      status: 'hidden'
    }
  );

  await User.deleteOne({ _id: user });

  await audit(
    req,
    'delete-account',
    'user',
    user,
    null,
    null
  );

  ok(res, {
    message: 'Account deleted.'
  });
}
