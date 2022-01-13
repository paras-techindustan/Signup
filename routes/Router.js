const config = require("config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const Router = express.Router();
const { User } = require("../models/user");
const auth = require("../middleware/auth");



Router.get("/home",(req,res)=>{
  res.send("Home")
})



Router.get("/adduser/me", auth, async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("user not found");
  }

  return res.status(200).send({
    message: "Fetched Data Successfully",
    value: user,
  });

  // res.send(user);
});

Router.post("/adduser", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send("user already exist");
  }

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  res.send(user);
});

Router.post("/login", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("invalid email");
  }

  let validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send("invalid password");
  }

  const token = jwt.sign(
    { email: user.email, password: user.password },
    config.get("jwtPrivateKey")
  );
  res.send(token);
});

Router.post("/course", auth, async (req, res) => {
  let user = await User.findOne({ name: req.body.name });
  if (!user) {
    return res.status(400).send("invalid name");
  }

  const token = jwt.sign({ name: user.name }, config.get("jwtPrivateKey"));
  res.header("x-auth-token", token);

  res.send(user);
});

Router.put("/update", auth, async (req, res) => {
  let user = await User.findOneAndUpdate(
    { email: req.body.email },
    { ...req.body },
    { multi: true, new: true }
  );
  if (!user) return res.status(400).send({ message: "User doesnot exist with this email" })

  return res.status(200).send({
    message: "User Updated Successfully",
    value: user,
  });
});

Router.delete("/remove", auth, async (req, res) => {
  let user = await User.deleteOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("invalid email");
  }
   
  return res.status(200).send({
    message:' User deleted successfully',
    value:user,
  })
  //res.send(user);
});

exports.Router = Router;
