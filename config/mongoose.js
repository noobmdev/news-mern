const mongoose = require("mongoose");
const argon2 = require("argon2");
const { ROLES, ConstantTypes } = require("../constants");
const { User, Constant } = require("../models");

exports.connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });

    console.log("MongoDB connected");
    const admin = await User.findOne({ role: { $mod: [ROLES.ADMIN, 0] } });
    if (!admin) {
      // create a ADMIN
      const hashPassword = await argon2.hash(process.env.ADMIN_PASSWORD);
      await new User({
        email: process.env.ADMIN_EMAIL,
        password: hashPassword,
        firstname: "ADMIN",
        lastname: "ADMIN",
        role: ROLES.ADMIN,
      }).save();
    }
  } catch (error) {
    console.log(error);
  }
};
