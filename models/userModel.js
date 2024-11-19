import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["user", "contributor", "admin"],
    default: "user",
  },
  verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  verified: Date,
  passwordToken: {
    type: String,
  },
  passwordTokenExpirationDate: {
    type: Date,
  },
  avatar: String,
  avatarPublicId: String,
  phone: String,
  location: String,
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  answers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answers",
    },
  ],
});

export default mongoose.model("user", userSchema);
