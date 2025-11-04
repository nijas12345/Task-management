import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", 
  port: 587,
  secure: false, 
  auth: {
    user: process.env.ServerEmail,
    pass: process.env.ServerPassword,
  },
});

export const sendMail = async (options: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    await transporter.sendMail({
      from: `"ProjecX" <${process.env.ServerEmail}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  } catch (err) {
    console.error("❌ Email send failed:", err);
  }
};
