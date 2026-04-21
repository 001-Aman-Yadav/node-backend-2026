import express from "express";
import { prisma } from "./prisma/prisma_client.mjs";
const PORT = 5000;
const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  console.log(req.body);
  const user = await prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
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
  if (user.password !== req.body.password) {
    res.status(401).json({
      error: "password not matched",
    });
    return;
  }
  res.json({ message: "login successful" });
});

app.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});
