const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

module.exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).send("Your account already exist!");
    }

    let salt = await bcrypt.genSalt();
    let hash = await bcrypt.hash(password, salt);

    user = await userModel.create({
      name,
      email,
      password: hash,
    });

    let token = generateToken({ email });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).send(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(500).send("Email or password incorrect!");
    }

    let result = await bcrypt.compare(password, user.password);

    if (result) {
      let token = generateToken({ email });

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.status(201).send("Logged in successfull!");
    } else {
      return res.status(500).send("Email or password incorrect!");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports.logoutUser = function (req, res) {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(201).send("Logged out successfull!");
};

module.exports.getUserProfile = function (req, res) {
  console.log(req.user)
  res.send('Logged in!');
};
