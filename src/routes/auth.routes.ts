import express from "express";
import { login, register } from "../controllers/authController";

const router = express.Router();

const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));

export default router;
