import express from "express";
import { prisma } from "./prisma/prisma_client.mjs";
import bcrypt from "bcrypt";

const PORT = 5000;
const app = express();

app.use(express.json());

// ================= SIGNUP =================
app.post("/signup", async (req, res) => {
  try {
    console.log(req.body);

    const { name, email, password } = req.body;

    // validation
    if (!name || !email || !password) {
      return res.json({ message: "All fields are required" });
    }

    // check user exist
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    //  correct hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    res.json({ message: "Signup successful", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    //  correct compare
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        error: "Password not matched",
      });
    }

    res.json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= SERVER =================
app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
