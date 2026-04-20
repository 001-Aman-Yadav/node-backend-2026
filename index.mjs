import express from "express";
import dotenv from "dotenv";
import { prisma } from "./prisma/prisma_client.mjs";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

/* ---------- SIGNUP ---------- */
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // create user
    const user = await prisma.user.create({
      data: { name, email, password },
    });

    res.json({
      message: "Signup successful ",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Signup error" });
  }
});

/* ---------- LOGIN ---------- */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.json({
      message: "Login successful ",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Login error" });
  }
});

/* ---------- SERVER ---------- */
app.listen(port, () => {
  console.log(` server started on 3000 ${port}`);
});
