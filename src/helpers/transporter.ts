import nodemailer from "nodemailer";
import config from "../config";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.emailSender.email,
    pass: config.emailSender.app_pass,
  },
});
