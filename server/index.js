const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const { User } = require("./models/User");
const { auth } = require("./middleware/auth");

// application/x-www-from-urlencoded
app.use(express.urlencoded({ extended: true }));

// application/json
app.use(express.json());

app.use(cookieParser());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/hello", async (req, res) => {
  res.send("Hello World ~");
});

app.post("/api/users/register", async (req, res) => {
  const user = new User(req.body);

  try {
    const savedUser = await user.save();
    res.status(200).json({
      success: true,
      data: savedUser,
    });
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
});

app.post("/api/users/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      return res.json({
        loginSuccess: false,
        message: "비밀번호가 틀렸습니다.",
      });
    }

    try {
      const updatedUser = await user.generateToken();
      res
        .cookie("x_auth", updatedUser.token)
        .status(200)
        .json({ loginSuccess: true, userId: updatedUser._id });
    } catch (err) {
      res.status(400).send(err);
    }
  } catch (err) {
    res.status(500).json({ success: false, err });
  }
});

app.get("/api/users/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" })
    .then((user) => {
      res.status(200).send({ success: true });
    })
    .catch((err) => {
      res.json({ success: false, err });
    });
});

const port = 5001;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
