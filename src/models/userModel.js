import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      validate: [
        function (password) {
          return password.length >= 8;
        },
        "Password must be at least 8 characters long",
      ],
      match: [
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\S+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

export const User = new mongoose.model("User", userSchema);
