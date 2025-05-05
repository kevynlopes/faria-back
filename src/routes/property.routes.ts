import { Router } from "express";
import { PropertyController } from "../controllers/PropertyController";
import multer from "multer";
import { authenticateToken } from "../middlewares/authMiddleware";
import { ImageController } from "../controllers/ImageController";

const router = Router();
const upload = multer();

const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

router.get("/properties", asyncHandler(PropertyController.index));

router.post(
  "/properties",
  authenticateToken,
  multer().array("images"),
  asyncHandler(PropertyController.store)
);

// router.get("/properties/:id", PropertyController.show);

// router.put("/properties/:id", PropertyController.update);

// router.delete("/properties/:id", PropertyController.delete);

router.post(
  "/properties/:propertyId/images",
  upload.array("images"),
  ImageController.addImage
);

router.delete("/images/:imageId", asyncHandler(ImageController.deleteImage));

export default router;
