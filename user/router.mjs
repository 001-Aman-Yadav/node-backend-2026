import express from "express";
const userRouter = express.Router();
import { signup, login, forgetPassword, resetPassword } from "./controller.mjs";

userRouter
  .post("/signup", signup)
  .post("/login", login)
  .patch("/forget_password", forgetPassword)
  .patch("/reset_password", resetPassword);

export { userRouter };
