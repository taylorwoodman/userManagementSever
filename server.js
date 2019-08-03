const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const massive = require("massive");
const bcrypt = require("bcrypt");
const controller = require("./controller");
const session = require("express-session");
const socket = require("socket.io");

const app = express(),
  io = socket(
    app.listen(8080, () => console.log("Listening"))
  )

massive(
  "postgres://payatibqsjencc:a47ff2ea01bffb9ba68faf0c55749fc5d9c411a0d6a35d21def38e573e89afca@ec2-54-243-193-59.compute-1.amazonaws.com:5432/d95k0sh95mea3c?ssl=true"
).then(db => {
  app.set("db", db);
});

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));


app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
//allows cookies to pass through
// app.use(controller.loggedIn)

io.on("connection", controller.socketOn);

app.get("/users", controller.getUsers);

app.post("/signup", controller.handleSignup);

app.post("/login", controller.handleLogin);

app.put("/edit-user", controller.handleEdit);

app.get("/logout", controller.handleLogout);

app.delete("/delete", controller.handleDelete);


