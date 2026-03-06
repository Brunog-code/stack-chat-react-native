import { Router } from "express";
import { AuthController } from "../../controllers/auth/AuthController";
import { AuthService } from "../../services/auth/AuthService";
import { validate } from "../../middlewares/validate-schema";
import { loginAuthSchema } from "../../middlewares/schemas/authSchemas";
import { authenticateToken } from "../../middlewares/authenticate-token";

const router = Router();

//1-instancia controler e injeta service
const authService = new AuthService();
const authController = new AuthController(authService);

router.post("/login", validate(loginAuthSchema), authController.login);
router.get("/me", authenticateToken, authController.getMe);

export default router;
