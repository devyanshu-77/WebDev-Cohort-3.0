import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    min: [3, "Name length must be atleast 3 characters"],
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    min: [8, "Password length must be atleast 8 characters"],
  },
});
const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    min: [5, "Todo must contain altleast 3 characters"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  done: {
    type: Boolean,
    default: false,
  },
});

export const User = mongoose.model("User", userSchema);
export const Todo = mongoose.model("Todo", todoSchema);
