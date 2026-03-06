import { Router } from "express";

import { authenticateToken } from "../../middlewares/authenticate-token";
import { UploadService } from "../../services/upload/uploadService";
import { UploadController } from "../../controllers/upload/UploadController";
import multer from "multer";
import uploadConfig from "../../config/multer";

const router = Router();
const upload = multer(uploadConfig);

//1-instancia controler e injeta service
const uploadService = new UploadService();
const uploadController = new UploadController(uploadService);

router.post(
  "/",
  authenticateToken,
  upload.single("file"),
  uploadController.uploadFile,
);

export default router;
