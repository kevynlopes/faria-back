import { Router } from "express";
import { UserController } from "../controllers/UserController";

const router = Router();

const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

router.get("/users", asyncHandler(UserController.index));
router.post("/users", asyncHandler(UserController.store));

export default router;
