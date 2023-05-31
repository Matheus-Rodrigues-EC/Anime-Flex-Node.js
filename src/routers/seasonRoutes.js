import cors from "cors";
import express from "express";

import { AddSeason, updateSeason, removeSeason } from '../controllers/seasonController.js';

const season = express();
season.use(cors());
season.use(express.json());

// Seasons Routes
season.post("/addseason", AddSeason);
season.put("/updateseason", updateSeason);
season.delete("/removeseason", removeSeason);

export default season;