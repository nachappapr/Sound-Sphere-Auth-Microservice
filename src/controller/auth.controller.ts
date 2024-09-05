import { Request, Response } from "express";
import { BadRequestError } from "@soundspheree/common";
import { AuthenticateUserInput, CreateUserInput } from "../schema/auth.schema";
import { buildUser, findUser } from "../service/user.service";
import jwt from "jsonwebtoken";
import { Password } from "../service/password";

export const currentUserHandler = (req: Request, res: Response) => {
  res.send({
    message: "Current user",
    data: req.currentUser || null,
  });
};

export const signinHandler = async (
  req: Request<unknown, unknown, AuthenticateUserInput, unknown>,
  res: Response
) => {
  const { email, password } = req.body;

  // check email exists
  const existingUser = await findUser({ email });
  if (!existingUser) {
    throw new BadRequestError("Invalid credentials");
  }
  // check password
  const passwordsMatch = await Password.compare(
    existingUser.password,
    password
  );
  if (!passwordsMatch) {
    throw new BadRequestError("Invalid credentials");
  }

  // generate jwt
  const userJwt = jwt.sign(
    {
      id: existingUser.id,
      email: existingUser.email,
    },
    process.env.JWT_KEY!,
    { expiresIn: process.env.JWT_EXPIRATION_IN }
  );
  // generate refresh token
  const userRefreshToken = jwt.sign(
    { id: existingUser.id, email: existingUser.email },
    process.env.REFRESH_KEY!,
    {
      expiresIn: process.env.REFRESH_EXPIRATION_IN,
    }
  );

  // store it on session object
  req.session = { jwt: userJwt, refreshToken: userRefreshToken };

  res.send({
    message: "Login successful",
    data: {
      id: existingUser.id,
      email: existingUser.email,
    },
  });
};

export const signoutHandler = (req: Request, res: Response) => {
  req.session = null;
  res.send({ message: "Logout successful", data: null });
};

export const signupHandler = async (
  req: Request<unknown, unknown, CreateUserInput, unknown>,
  res: Response
) => {
  const { name, email, password } = req.body;

  const existingUser = await findUser({ email });
  if (existingUser) {
    throw new BadRequestError("Email in use");
  }
  const user = await buildUser({ name, email, password });

  // generate jwt
  const userJwt = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_KEY!,
    { expiresIn: process.env.JWT_EXPIRATION_IN }
  );

  // generate refresh token
  const userRefreshToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.REFRESH_KEY!,
    {
      expiresIn: process.env.REFRESH_EXPIRATION_IN,
    }
  );

  // store it on session object
  req.session = { jwt: userJwt, refreshToken: userRefreshToken };

  res.status(201).send({
    message: "User created",
    data: {
      id: user.id,
      email: user.email,
    },
  });
};
