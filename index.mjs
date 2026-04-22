import "dotenv/config";
import jwt from "jsonwebtoken";
import express from "express";
import { prisma } from "./prisma/prisma_client.mjs";
import bcrypt from "bcrypt";
const PORT = 5000;
const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = await prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.name,
      password: hashedPassword,
      address: req.body.address,
    },
  });
  res.json(user);
});

app.post("/login", async (req, res) => {
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

  // TODO: generate token
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.TOKEN_SECRET,
  );
  res.json({ message: `login successful, welcome ${user.name}`, token });
});

app.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});
