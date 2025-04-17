import { nodemailerTransporter } from '../config/nodemailer/nodemailer.config';

export const sendVaultPasswordResetTokenToEmail = (
  email: string, // The recipient's email address
  token: string | number // The password reset token
) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Token expiry check can be handled in the backend where the token is verified
      const resetPasswordEmail = {
        to: email,
        from: 'apurboroy7077@gmail.com', // Replace with your email address
        subject: 'Reset Your Vault Password',
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
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 14px;
              color: #aaa;
            }
            @media (max-width: 600px) {
              .container {
                padding: 15px;
              }
              h1 {
                font-size: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Vault Password Reset Request</h1>
            <p>Hello,</p>
            <p>We received a request to reset your Vault password. Please use the following token to reset your password:</p>
            <p><strong>${token}</strong></p>
            <p>If you did not request a password reset, please ignore this email or contact support if you have any concerns.</p>
            <div class="footer">
              <p>Thank you for using our service!</p>
              <p>Best Regards, <br> Your Team</p>
            </div>
          </div>
        </body>
      </html>
        `,
      };

      nodemailerTransporter.sendMail(resetPasswordEmail, (error, info) => {
        if (error) {
          console.error('Error:', error);
          reject(new Error('Failed to send email. Please try again later.'));
        } else {
          console.log('Email sent:', info.response);
          resolve('Email Sent');
        }
      });
    } catch (error) {
      console.error('Error:', error);
      reject(new Error('An unexpected error occurred.'));
    }
  });
};
