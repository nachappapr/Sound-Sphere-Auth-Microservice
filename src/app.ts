import { NotFoundError, currentUser, errorHandler } from "@soundspheree/common";
import cookieSession from "cookie-session";
import cors from "cors";
import express from "express";
import "express-async-errors";
import authRouter from "./routes/auth.routes";
import { config } from "dotenv";
config({ path: `.env.${process.env.NODE_ENV}` });

// Create express app
const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(cors());

// Express middleware to handle cookies
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
    httpOnly: true,
  })
);

// health check
app.get("/api/users/health", (req, res) => {
  res.send("OK");
});

// Express middleware to handle current user
app.use(currentUser);

// Express middleware to handle routes
app.use("/api/users", authRouter);
app.all("*", async () => {
  throw new NotFoundError();
});

// Express middleware to handle errors
app.use(errorHandler);

export { app };
