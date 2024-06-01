import express from "express";
import "express-async-errors";
import { NotFoundError, errorHandler, currentUser } from "@npticketify/common";
import authRouter from "./routes/auth.routes";
import cookieSession from "cookie-session";
import cors from "cors";

import { config } from "dotenv";
config({ path: `.env.${process.env.NODE_ENV}` });

// create express app
const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(cors());
// express middleware to handle cookies
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

// express middleware to handle current user
app.use(currentUser);

// express middleware to handle routes
app.use("/api/users", authRouter);
app.all("*", async () => {
  throw new NotFoundError();
});

// express middleware to handle errors
app.use(errorHandler);

export { app };
