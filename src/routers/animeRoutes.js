import cors from "cors";
import express from "express";

import { addAnime, updateAnime, removeAnime } from '../controllers/animeController.js';

const anime = express();
anime.use(cors());
anime.use(express.json());

// Animes Routes
anime.post("/addanime", addAnime);
anime.put("/updateanime", updateAnime);
anime.delete("/removeanime", removeAnime);

export default anime;