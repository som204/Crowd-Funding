import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

userSchema.methods.generateJWT = async function () {
  return jwt.sign(
    {
      email: this.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );
};

userSchema.methods.isValidPassword= async function(password) {
    return await bcrypt.compare(password,this.password)
}

const User = model("users", userSchema);

export default User;
