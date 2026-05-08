import { prisma } from "../prisma/prisma_client.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOTP } from "../resend.mjs";

const signup = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = await prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.name,
      password: hashedPassword,
      address: req.body.address,
    },
  });
  // TODO: send otp on email
  // confirm account
  res.json(user);
};

const login = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  if (!user) {
    res.status(404).json({
      error: "user not found",
    });
    return;
  }
  const isMatched = await bcrypt.compare(req.body.password, user.password);
  if (!isMatched) {
    res.status(401).json({
      error: "password not matched",
    });
    return;
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "1m",
    },
  );
  res.json({
    message: `login successful, welcome ${user.name}`,
    token: token,
  });
};

const forgetPassword = async (req, res) => {
  // 1. find user in DB via email
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  if (!user) {
    res.status(404).json({
      error: "user not found",
    });
    return;
  }

  // 2. generate OTP 100-000 , 999-999
  const opt = Math.floor(Math.random() * 899999 + 100000);
  const strOTP = `${opt}`;

  // // 3.0 Create OTP Column in DB (One time)
  // // 3.1 save OTP in DB
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      otp: strOTP,
      otpGeneratedAt: new Date(Date.now()),
    },
  });

  // 4. send email
  await sendOTP(user.email, strOTP);

  // // 5. send success in response
  res.json({ message: "check your email" });
};

const resetPassword = async (req, res) => {
  // 1. find user from email
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  if (!user) {
    res.status(404).json({ error: "user not found" });
    return;
  }
  // 2. match otp
  if (req.body.otp !== user.otp) {
    res.status(401).json({ error: "invalid otp" });
    return;
  }
  // 3. check for otp expiry
  const otpValidityMin = 50; // minute
  if (Date.now() - user.otpGeneratedAt.getTime() > otpValidityMin * 60 * 1000) {
    res.status(401).json({ error: "otp expired" });
    return;
  }

  // 4. hash new password

  const hashedPass = await bcrypt.hash(req.body.new_password, 10);
  // 5. update hashed password in DB
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      // TODO: if account not verified then verify it
      otp: null,
      password: hashedPass,
    },
  });

  // send response to user
  res.json({ message: "password reset successful" });
};

export { signup, login, forgetPassword, resetPassword };
