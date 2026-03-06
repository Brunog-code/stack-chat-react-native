import { Router } from "express";

import { authenticateToken } from "../../middlewares/authenticate-token";
import { SearchService } from "../../services/search/searchService";
import { SearchController } from "../../controllers/search/SearchController";

const router = Router();

//1-instancia controler e injeta service
const searchService = new SearchService();
const searchController = new SearchController(searchService);

router.get("/", authenticateToken, searchController.search);

export default router;
