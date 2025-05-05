import { Router } from "express";
import userRoutes from "./user.routes";
import propertyRoutes from "./property.routes";
import authRoutes from "./auth.routes";
import { errorMiddleware } from "../middlewares/errorMiddleware";

const router = Router();

router.use(userRoutes);
router.use(propertyRoutes);
router.use(authRoutes);

router.use(errorMiddleware);

export default router;
