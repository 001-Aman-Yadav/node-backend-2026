import "dotenv/config";
import express from "express";
import { userRouter } from "./user/router.mjs";
const PORT = 5000;
const app = express();

app.use(express.json());

app.use("/users", userRouter);

app.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});
