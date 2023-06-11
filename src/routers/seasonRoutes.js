import cors from "cors";
import express from "express";

import { createSeason, readSeasons, readSeason, updateSeason, deleteSeason } from '../controllers/seasonController.js';

const season = express();
season.use(cors());
season.use(express.json());

// Seasons Routes
season.post("/createSeason", createSeason);
season.get("/:name/:season", readSeasons);
season.get("/season/:season", readSeason);
season.put("/updateSeason", updateSeason);
season.delete("/deleteSeason", deleteSeason);

export default season;