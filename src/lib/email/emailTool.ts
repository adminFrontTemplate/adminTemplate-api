import * as nodemail from 'nodemailer';
import { EMAIL } from './config';

export class Email {
  private transporter = null;

  constructor() {
    // 通过nodemail的createTransport方法创建这个服务，将config中的参数依次传入
    this.transporter = nodemail.createTransport({
      host: EMAIL.host,
      port: EMAIL.port,
      secure: EMAIL.secure,
      auth: {
        user: EMAIL.user,
        pass: EMAIL.pass,
      },
    });
  }

  // forgetPasswordSend({ email, subject = 'fagao', html = '' }) {
  //   return new Promise<string | void>((resolve, reject) => {
  //     const options = {
  //       from: `${EMAIL.alias}<${EMAIL.user}>`,
  //       to: email,
  //       subject,
  //       html,
  //     };
  //     this.transporter.sendMail(options, (error) => {
  //       if (error) {
  //         reject(error);
  //       } else {
  //         resolve();
  //       }
  //     });
  //   });
  // }

  send({ email, subject = 'adminTemplate', html = '' }) {
    return new Promise<string>((resolve, reject) => {
      const code = Math.random().toString().slice(-6);
      const options = {
        from: `${EMAIL.alias}<${EMAIL.user}>`,
        to: email,
        subject,
        text:
          '您的验证码是：' +
          code +
          '，请不要告诉别人您的验证码' +
          ',验证码在5分钟后失效',
        html,
      };
      this.transporter.sendMail(options, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(code);
        }
      });
    });
  }
}
