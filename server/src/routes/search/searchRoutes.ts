import { Router } from "express";

import { authenticateToken } from "../../middlewares/authenticate-token.js";
import { SearchService } from "../../services/search/searchService.js";
import { SearchController } from "../../controllers/search/SearchController.js";

const router = Router();

//1-instancia controler e injeta service
const searchService = new SearchService();
const searchController = new SearchController(searchService);

router.get("/", authenticateToken, searchController.search);

export default router;
