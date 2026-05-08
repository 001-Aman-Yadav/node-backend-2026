import { Router } from "express";
import jwt from "jsonwebtoken";
const menuRouter = Router();
import { createMenu, getMenus, updateMenu, deleteMenu } from "./controller.mjs";

const authentication = (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).json({ error: "no token supplied. login again!" });
    return;
  }
  const token = req.headers.authorization.replace("Bearer ", "");
  console.log(token);
  const output = jwt.verify(token, process.env.TOKEN_SECRET);
  console.log(output);
  next();
};

// menuRouter.post("/", authentication, createMenu)
//   .get("/", getMenus)
//   .patch("/", authentication, updateMenu)
//   .delete("/", authentication, deleteMenu)

menuRouter.get("/", getMenus);

menuRouter.use(authentication);
menuRouter.post("/", createMenu).patch("/", updateMenu).delete("/", deleteMenu);

export { menuRouter };
