import "dotenv/config";
import express from "express";
import { userRouter } from "./user/router.mjs";
import { menuRouter } from "./menu/router.mjs";
const PORT = 5000;
const app = express();

app.use(express.json()); // body parser
app.use((req, res, next) => {
  console.log("global middlware, runs on every route");
  next();
});

app.use("/users", userRouter);
app.use(
  "/menus",
  (req, res, next) => {
    console.log("menu route middleware");
    next();
  },
  menuRouter,
);

app.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});
