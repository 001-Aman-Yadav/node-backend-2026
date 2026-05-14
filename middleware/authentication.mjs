import jwt from "jsonwebtoken";

const authentication = (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).json({ error: "no token supplied. login again!" });
    return;
  }
  const token = req.headers.authorization.replace("Bearer ", "");
  console.log(token);
  const output = jwt.verify(token, process.env.TOKEN_SECRET);
  console.log(output);
  req.user = output;
  next();
};

export { authentication };
