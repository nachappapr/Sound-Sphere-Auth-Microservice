import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose.connect("mongodb://sound-sphere-auth-mongodb:27017/auth");
};
