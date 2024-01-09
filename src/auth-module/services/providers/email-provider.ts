import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { EmailPayload } from 'src/auth-module/dtos/dtos';
import * as nodemail from 'nodemailer';
@Injectable()
export class EmailLogging {
  private readonly nodemailer = nodemail.createTransport({
    host: 'smtp.comcast.net',
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });
  constructor() {}
  async draftEmail(payload: EmailPayload): Promise<void> {
    try {
      if (
        !process.env.GMAIL ||
        !process.env.GMAIL_PASSWORD ||
        !process.env.IP_CONFIG_KEY
      ) {
        throw new HttpException(
          'Email Not Configured or IP API KEY ILLEGAL',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        const { email, requestPath, req } = payload;
        if (/login/.test(requestPath)) {
          const ipAddress: string | string[] =
            req.headers['x-forwarded-for'] || req.socket.remoteAddress;
          const location = await axios.get(
            `https://ipinfo.io/${ipAddress[0]}?token=b3dc7b1eccddf4`,
          );
          const mailOptions: Record<string, string> = {
            from: process.env.GMAIL,
            to: email,
            subject: `Someone Signed In With Your Credentials ${new Date().toISOString()}`,
            text: `Content: Someone Signed In With Your Credentials. This email is automated to trigger whenever someone uses your credentials to change the testing files on the honeycomb-admin-dev-db repo, here are the details: 
Timestamp: ${new Date().toISOString()}, City: ${
              location.data.bogon
                ? 'Loopback Address (or localhost)'
                : location.data.city
            } Region: ${
              !location.data.region
                ? 'Loopback Address (or localhost)'
                : location.data.region
            }
Notes: Ip information could be incorrect if user is utilizing Proxy, VPN, or manipulated headers. The latter is unlikely because this is an automated script. If this sign in was not from you, contact Admin.`,
          };
          this.nodemailer.sendMail(mailOptions, (error: unknown) => {
            if (error) {
              throw new HttpException(
                `Error Sending Email:${error}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
              );
            }
          });
        } else if (/register/.test(requestPath)) {
          const mailOptions: Record<string, string> = {
            from: process.env.GMAIL,
            to: email,
            subject: `Register Notice ${new Date().toISOString()}`,
            text: `Content: This email is a notice that your account was registered with [Auth_Microservice] API, these credentials are only necessary to change protected files prefixed with .testscripts in the [honeycomb-admin-dev-db] repo. If you have any questions, contact ADMIN.`,
          };
          this.nodemailer.sendMail(mailOptions, (error: unknown) => {
            if (error) {
              throw new HttpException(
                `Error Sending Email:${error}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
              );
            }
          });
        } else {
          throw new HttpException(
            `Incorrect Configuration For Email Draft`,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    } catch (err) {
      throw new HttpException(
        `Error Sending or Drafting Email: ${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
