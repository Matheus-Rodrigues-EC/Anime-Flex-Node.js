import cors from "cors";
import express from "express";

import { createEpisode, readEpisode, updateEpisode, deleteEpisode } from '../controllers/episodeController.js';

const episode = express();
episode.use(cors());
episode.use(express.json());

// Episodes Routes
episode.post("/createEpisode", createEpisode);
episode.get("/:anime/:season/:episode", readEpisode);
episode.put("/updateepisode", updateEpisode);
episode.delete("/deleteEpisode", deleteEpisode);

export default episode;