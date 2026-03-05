import { Request, Response } from "express";
import { UserService } from "../../services/user/UserService.js";

export class UserController {
  constructor(private readonly userService: UserService) {}

  register = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      const dataRegister = {
        name,
        email,
        password,
      };

      const user = await this.userService.register(dataRegister);

      return res
        .status(201)
        .json({ message: "Usuário criado com sucesso", user: user });
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

  updateName = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { name } = req.body;

    try {
      const result = await this.userService.updateName(id, name);

      return res.status(200).json(result);
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

  updateImage = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { urlImage } = req.body;

    try {
      await this.userService.updateImage(id, urlImage);

      return res.status(200).json({ message: "Imagem alterada" });
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
