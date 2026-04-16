import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.json({ greet: "Hello World" });
});

// LOGIN route (FIXED)
app.post("/login", (req, res) => {
  res.json({ login: "login success" });
});

// SIGNUP route (FIXED)
app.post("/signup", (req, res) => {
  console.log(req.body);
  res.json({ signup: "signup success" });
});

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
