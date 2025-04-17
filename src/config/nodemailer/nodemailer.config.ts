import nodemailer from 'nodemailer';
import {
  NODEMAILER_PASSWORD,
  NODEMAILER_SERVICE,
  NODEMAILER_USER,
} from '../../data/environmentVariables';

// Create a transporter
export const nodemailerTransporter = nodemailer.createTransport({
  service: NODEMAILER_SERVICE, // or any other service
  auth: {
    user: NODEMAILER_USER,
    pass: NODEMAILER_PASSWORD,
  },
});

// Sending an email
// const mailOptions = {
//   from: "port.denison.customer.care@gmail.com",
//   to: "apurboroy7077@gmail.com",
//   subject: "Test Email",
//   text: "This is a test email sent using nodemailer!",
// };

// nodemailerTransporter.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     console.error("Error:", error);
//   } else {
//     console.log("Email sent:", info.response);
//   }
// });
