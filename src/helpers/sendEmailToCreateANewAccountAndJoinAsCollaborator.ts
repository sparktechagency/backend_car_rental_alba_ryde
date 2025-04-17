import { nodemailerTransporter } from '../config/nodemailer/nodemailer.config';

export const sendEmailToSignUpAndJoinAsCollaborator = (
  email: string, // The recipient's email address
  assetName: string // The name of the asset the user is being invited to collaborate on
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const invitationEmail = {
        to: email,
        from: 'apurboroy7077@gmail.com', // Replace with your email address
        subject: `You're Invited to Collaborate on ${assetName}`,
        html: `
        <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #f4f7fc;
              color: #333;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #2d3748;
              text-align: center;
              font-size: 24px;
            }
            p {
              line-height: 1.6;
              font-size: 16px;
            }
            .button {
              display: inline-block;
              padding: 10px 20px;
              margin-top: 20px;
              color: #fff;
              background-color: #4CAF50;
              text-decoration: none;
              border-radius: 5px;
              text-align: center;
              font-size: 16px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 14px;
              color: #aaa;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>You're Invited to Collaborate!</h1>
            <p>Hello,</p>
            <p>You have been invited to collaborate on the asset <strong>${assetName}</strong>. To proceed, you need to create a new account and accept the invitation to begin collaborating.</p>
            <p>Please click the link below to sign up and join as a collaborator:</p>
            <p><a href="https://your-website.com/signup" class="button">Create an Account</a></p>
            <p>If you did not expect this invitation, please ignore this email or contact support if you have any concerns.</p>
            <div class="footer">
              <p>Thank you for your involvement!</p>
              <p>Best Regards, <br> Your Team</p>
            </div>
          </div>
        </body>
      </html>
        `,
      };

      nodemailerTransporter.sendMail(invitationEmail, (error, info) => {
        if (error) {
          console.error('Error:', error);
          reject(error);
        } else {
          console.log('Email sent:', info.response);
          resolve('Email Sent');
        }
      });
    } catch (error) {
      console.error('Error:', error);
      reject(error);
    }
  });
};
