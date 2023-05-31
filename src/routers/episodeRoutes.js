import cors from "cors";
import express from "express";

import { addEpisode, updateEpisode, removeEpisode } from '../controllers/episodeController.js';

const episode = express();
episode.use(cors());
episode.use(express.json());

// Episodes Routes
episode.post("/addepisode", addEpisode);
episode.put("/updateepisode", updateEpisode);
episode.delete("/removeepisode", removeEpisode);

export default episode;