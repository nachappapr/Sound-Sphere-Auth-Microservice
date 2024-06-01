import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose.connect("mongodb://mongo-srv:27017/auth");
};
