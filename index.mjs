import "dotenv/config";
import express from "express";
import { prisma } from "./prisma/prisma_client.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOTP } from "./resend.mjs";

const PORT = 5000;
const app = express();
app.use(express.json());

/* ================= SIGNUP ================= */
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    // check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "name, email, password required",
      });
    }

    // check user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        error: "email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address: address || null,
      },
    });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "something went wrong" });
  }
});

/* ================= LOGIN ================= */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      return res.status(401).json({ error: "password not matched" });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.TOKEN_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      message: `login successful, welcome ${user.name}`,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "something went wrong" });
  }
});

/* ================= FORGOT PASSWORD ================= */
app.patch("/forget_password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    // Reset_password=============

    app.post("/reset_password", async (req, res) => {
      try {
        const { email, otp, newPassword } = req.body;

        const user = await prisma.user.findUnique({
          where: { email },
        });
        if (!user) {
          return res.status(404).json({ error: "user not found" });
        }

        if (!user.otp || user.otp !== otp) {
          return res.status(400).json({ error: "invalid otp" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
          where: { id: user.id },
          data: {
            password: hashedPassword,
            otp: null,
          },
        });

        res.json({ message: "password reset successful" });
      } catch (error) {
        res.status(500).json({ error: "something went wrong" });
      }
    });

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // save OTP
    await prisma.user.update({
      where: { id: user.id },
      data: { otp },
    });

    // send email
    await sendOTP(user.email, otp);

    res.json({ message: "check your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});
