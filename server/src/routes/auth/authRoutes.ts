import { Router } from "express";
import { AuthController } from "../../controllers/auth/AuthController.js";
import { AuthService } from "../../services/auth/AuthService.js";
import { validate } from "../../middlewares/validate-schema.js";
import { loginAuthSchema } from "../../middlewares/schemas/authSchemas.js";
import { authenticateToken } from "../../middlewares/authenticate-token.js";

const router = Router();

//1-instancia controler e injeta service
const authService = new AuthService();
const authController = new AuthController(authService);

router.post("/login", validate(loginAuthSchema), authController.login);
router.get("/me", authenticateToken, authController.getMe);

export default router;
