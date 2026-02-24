import { AuthService } from "../../services/auth/AuthService.js";
import { Request, Response } from "express";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const dataLogin = {
        email,
        password,
      };

      const session = await this.authService.login(dataLogin);

      return res
        .status(200)
        .json({ message: "Login efetuado com sucesso", session: session });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          error: error.message,
        });
      }

      return res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  };

  getMe = async (req: Request, res: Response) => {
    try {
      const id = req.user_id;

      const user = await this.authService.getMe({ id });

      res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          error: error.message,
        });
      }

      return res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  };
}
