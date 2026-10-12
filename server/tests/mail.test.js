import test from 'node:test';import assert from 'node:assert/strict';import net from 'node:net';
process.env.NODE_ENV='test';
const {sendMail}=await import('../src/utils/mail.js');
test('SMTP delivery submits a real message before reporting delivery; errors do not report delivery',async()=>{
 const messages=[];const server=net.createServer(socket=>{socket.write('220 local-test ESMTP\r\n');let buffer='',data=false,body='';socket.on('data',chunk=>{buffer+=chunk.toString();let i;while((i=buffer.indexOf('\r\n'))>=0){const line=buffer.slice(0,i);buffer=buffer.slice(i+2);if(data){if(line==='.'){messages.push(body);body='';data=false;socket.write('250 Message accepted\r\n');}else body+=line+'\n';}else if(/^EHLO|HELO/.test(line))socket.write('250 local-test\r\n');else if(/^MAIL FROM|RCPT TO/.test(line))socket.write('250 OK\r\n');else if(line==='DATA'){data=true;socket.write('354 End with dot\r\n');}else if(line==='QUIT'){socket.end('221 Bye\r\n');}else socket.write('250 OK\r\n');}});});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));process.env.SMTP_HOST='127.0.0.1';process.env.SMTP_PORT=String(server.address().port);process.env.MAIL_FROM='test@example.test';
 try{assert.equal((await sendMail('recipient@example.test','Verification code','Code: 123456')).delivered,true);assert.equal(messages.length,1);assert(messages[0].includes('123456'));}finally{await new Promise(resolve=>server.close(resolve));}
 await assert.rejects(sendMail('recipient@example.test','No delivery','This must fail'));
 delete process.env.SMTP_HOST;assert.equal((await sendMail('recipient@example.test','Simulated','Code: 654321')).delivered,false);
});
