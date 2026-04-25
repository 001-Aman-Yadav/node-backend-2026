import "dotenv/config";

import { Resend } from "resend";
const resend = new Resend(process.env.EMAIL_KEY);

const sendOTP = async (email, otp) => {
  const res = await resend.emails.send({
    to: email,
    from: "test@resend.dev",
    subject: "Forget Password Email",
    text: `your otp is ${otp}`,
  });

  console.log(res);
};

export { sendOTP };
