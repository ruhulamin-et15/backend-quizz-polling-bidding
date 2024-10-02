import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwt: {
    jwt_secret: process.env.JWT_SECRET as string,
    expires_in: process.env.EXPIRES_IN as string,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET as string,
    refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
    reset_pass_secret: process.env.RESET_PASS_SECRET as string,
    reset_pass_token_expires_in: process.env
      .RESET_PASS_TOKEN_EXPIRES_IN as string,
  },
  reset_pass_link: process.env.RESET_PASS_LINK,
  emailSender: {
    email: process.env.NODE_MAILER_EMAIL,
    app_pass: process.env.NODE_MAILER_APP_PASS,
  },
  //   ssl: {
  //     storeId: process.env.STORE_ID,
  //     storePass: process.env.STORE_PASS,
  //     successUrl: process.env.SUCCESS_URL,
  //     cancelUrl: process.env.CANCEL_URL,
  //     failUrl: process.env.FAIL_URL,
  //     sslPaymentApi: process.env.SSL_PAYMENT_API,
  //     sslValidationApi: process.env.SSL_VALIDATIOIN_API,
  //   },

  otp: {
    account_ssid: process.env.ACCOUNT_SSID,
    auth_token: process.env.AUTH_TOKEN,
    twilioNumber: process.env.TWILIO_NUMBER,
  },
};
