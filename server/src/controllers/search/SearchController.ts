import { SearchService } from "../../services/search/searchService.js";
import { Request, Response } from "express";

export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  search = async (req: Request, res: Response) => {
    try {
      const { textSearch } = req.query;

      if (!textSearch) throw new Error("Nenhum texto definido para procura");

      const result = await this.searchService.search(String(textSearch));

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
}
