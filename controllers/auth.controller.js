const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const { validateSchema } = require("../validations");
const { registerSchema, loginSchema } = require("../validations/schemas");

const { User } = require("../models");
const { sendMail } = require("../services/sendMail");
const { EmailTypes, ROLES } = require("../constants");
const randomString = require("../utils/randomString");

exports.postRegister = async (req, res) => {
  try {
    // const { isValid, errors } = validateSchema(req.body, registerSchema);
    // if (!isValid) return res.status(400).json(errors);

    const { password } = req.body;
    const hashPassword = await argon2.hash(password);
    const user = new User({
      ...req.body,
      password: hashPassword,
    });
    await user.save();
    // sendMail(email, EmailTypes.REGISTER);

    res.json({ success: true });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ [field]: "already exists" });
    }
    res.status(500).json(error);
  }
};

exports.postLogin = async (req, res) => {
  try {
    const { isValid, errors } = validateSchema(req.body, loginSchema);
    if (!isValid) return res.status(400).json(errors);

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ email: "user does not exists" });
    }

    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {
      return res.status(400).json({ password: "password is wrong" });
    }

    const payload = {
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
      phone: user.phone,
      postcode: user.postcode,
      country: user.country,
      city_provine: user.city_provine,
      address: user.address,
      university: user.university,
      major: user.major,
      research: user.research,
    };
    const token = await jwt.sign(payload, process.env.SECRET_KEY_JWT, {
      expiresIn: "1d",
    });

    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $nin: [req.user._id] } })
      .populate("major", ["name"])
      .populate("research", ["name"])
      .lean();

    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.updateUser = async (req, res) => {
  try {
    // const users = await User.find({ _id: { $nin: [req.user._id] } });

    // res.json(users);
    const { id: userId } = req.params;

    const userExists = await User.findById(userId);

    if (!userExists) {
      return res.status(400).json({ user: "NOT_FOUND" });
    }

    if (
      req.body.role &&
      req.body.role !== userExists.role &&
      req.user.role % ROLES.ADMIN !== 0
    ) {
      return res.status(401).json({ user: "Unauthorized" });
    }

    const updateUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    res.send(updateUser);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(400).json({ user: "NOT_FOUND" });
    }

    const updateUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    const payload = {
      _id: updateUser._id,
      firstname: updateUser.firstname,
      lastname: updateUser.lastname,
      email: updateUser.email,
      role: updateUser.role,
      phone: updateUser.phone,
      postcode: updateUser.postcode,
      country: updateUser.country,
      city_provine: updateUser.city_provine,
      address: updateUser.address,
      university: updateUser.university,
      major: updateUser.major,
      research: updateUser.research,
    };
    const token = await jwt.sign(payload, process.env.SECRET_KEY_JWT, {
      expiresIn: "1d",
    });

    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const email = req.body?.email;
    if (!email) {
      return res.status(400).send("Email is required");
    }

    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(400).send("Email is not exists");
    }

    const newPassword = randomString(8);

    const hashPassword = await argon2.hash(newPassword);

    await User.findByIdAndUpdate(userExists._id, {
      password: hashPassword,
    });
    sendMail(email, EmailTypes.FORGOT_PASSWORD, { password: newPassword });

    res.send("success");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    const isMatch = await argon2.verify(user.password, currentPassword);
    if (!isMatch) {
      return res.status(400).send("password is wrong");
    }

    const newHashPassword = await argon2.hash(newPassword);
    await User.findByIdAndUpdate(req.user._id, { password: newHashPassword });
    res.send("success");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
