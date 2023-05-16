const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

//secret key
const secretKey = "Anti25";

const users = [
  { id: 1, name: "John", password: "123" },
  { id: 2, name: "Jane", password: "456" },
];

//login
app.post("/login", (req, res) => {
  const { name, password } = req.body;

  const user = users.find(
    (user) => user.name === name && user.password === password
  );

  if (!user) {
    res.status(401).json({ message: "Incalid credentials" });
  }

  //generate JWT token
  const token = jwt.sign({ id: user.id }, secretKey);

  //send the token as a response
  res.json({ token });
});

//middleware to authenticate token

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorisation"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access denied" });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      res.status(403).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  });
}
//protected route

app.get("/data", authenticateToken, (req, res) => {
  const userId = req.user.id;

  const data = "Data for user with Id: ${userId}";

  res.json({ data });
});

//listen
app.listen(4000, () => {
  console.log("Server running on port 4000");
});
