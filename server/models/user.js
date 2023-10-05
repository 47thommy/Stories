import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timeStamps: true }
);

userSchema.statics.signup = async function (email, password, name) {
  if (!email || !password || !name) {
    throw Error("enter a valid email address");
  }
  if (!validator.isEmail(email)) {
    throw Error("please enter a valid email");
  }

  const exist = await this.findOne({ email });
  if (exist) {
    throw Error("user with the specified email exists");
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, name, password: hash });
  return user;
};
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("please enter all the required fields");
  }
  if (!validator.isEmail(email)) {
    throw Error("please enter a valid email");
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Error("incorrect password or email");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("incorrect password or email");
  }
  return user;
};
const userModel = mongoose.model("user", userSchema);
export default userModel;
