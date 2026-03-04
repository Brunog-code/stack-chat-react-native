import { UploadService } from "../../services/upload/uploadService.js";
import { Request, Response } from "express";

export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  uploadFile = async (req: Request, res: Response) => {
    try {
      const file = req.file;

      console.log(file);

      if (!file) throw new Error("Arquivo não enviado");

      const fileUrl = await this.uploadService.uploadFile({ file });

      return res.status(200).json({ url: fileUrl });
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  };
}
