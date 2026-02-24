import { Router } from "express";
import { UserService } from "../../services/user/UserService.js";
import { UserController } from "../../controllers/user/UserController.js";
import { validate } from "../../middlewares/validate-schema.js";
import { registerUserSchema } from "../../middlewares/schemas/userSchemas.js";

const router = Router();

//1-instancia controler e injeta service
const userService = new UserService();
const userController = new UserController(userService);

router.post("/register", validate(registerUserSchema), userController.register);

export default router;
