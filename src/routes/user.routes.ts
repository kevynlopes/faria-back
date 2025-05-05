import { Router } from "express";
import { UserController } from "../controllers/UserController";
import {
  authenticateToken,
  authorizeRole,
} from "../middlewares/authMiddleware";

const router = Router();

const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

router.get(
  "/users",
  authenticateToken,
  authorizeRole("admin"),
  asyncHandler(UserController.index)
);
router.get("/users/email/:email", asyncHandler(UserController.show));
router.post("/users", asyncHandler(UserController.store));
router.delete(
  "/users/email/:email",
  authenticateToken,
  authorizeRole("admin"),
  asyncHandler(UserController.delete)
);
router.put("/users/email/:email", asyncHandler(UserController.update));

export default router;
