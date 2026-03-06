import { Router } from "express";
import { UserService } from "../../services/user/UserService";
import { UserController } from "../../controllers/user/UserController";
import { validate } from "../../middlewares/validate-schema";
import {
  registerUserSchema,
  updateImageSchema,
  updateNameSchema,
} from "../../middlewares/schemas/userSchemas";

const router = Router();

//1-instancia controler e injeta service
const userService = new UserService();
const userController = new UserController(userService);

router.post("/register", validate(registerUserSchema), userController.register);
router.patch(
  "/update-name/:id",
  validate(updateNameSchema),
  userController.updateName,
);
router.patch(
  "/update-image/:id",
  validate(updateImageSchema),
  userController.updateImage,
);

export default router;
