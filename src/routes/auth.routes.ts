import { Router } from "express";
import {
  currentUserHandler,
  signinHandler,
  signoutHandler,
  signupHandler,
} from "../controller/auth.controller";
import { requireAuth, validateResource } from "@npticketify/common";
import {
  authenticateUserSchema,
  createUserSchema,
} from "../schema/auth.schema";
const router = Router();

router.get("/currentuser", currentUserHandler);
router.post("/signin", validateResource(authenticateUserSchema), signinHandler);
router.post("/signout", signoutHandler);
router.post("/signup", validateResource(createUserSchema), signupHandler);

export default router;
