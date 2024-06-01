import { object, type TypeOf, string } from "zod";

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    email: string({
      required_error: "Email is required",
    }).email("Invalid email"),
    password: string({
      required_error: "Password is required",
    })
      .min(6, "Password must be at least 6 characters")
      .max(30, "Password must be at most 30 characters"),
  }),
});

export const authenticateUserSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Invalid email"),
    password: string({
      required_error: "Password is required",
    })
      .min(6, "Password must be at least 6 characters")
      .max(30, "Password must be at most 30 characters"),
  }),
});

export type AuthenticateUserInput = TypeOf<
  typeof authenticateUserSchema
>["body"];

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];
