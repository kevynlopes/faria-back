import { Router } from "express";
import userRoutes from "./user.routes";
import propertyRoutes from "./property.routes";
import { errorMiddleware } from "../middlewares/errorMiddleware";

const router = Router();

router.use(userRoutes);
router.use(propertyRoutes);

router.use(errorMiddleware);

export default router;
