import cors from "cors";
import express from "express";

import { createAnime, readAnimes, readAnime, updateAnime, deleteAnime } from '../controllers/animeController.js';

const anime = express();
anime.use(cors());
anime.use(express.json());

// Animes Routes
anime.post("/createAnime", createAnime);
anime.get("/animes", readAnimes);
anime.get("/anime/:name", readAnime);
anime.put("/updateAnime", updateAnime);
anime.delete("/deleteAnime", deleteAnime);

export default anime;