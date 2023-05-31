import express from "express";
import cors from "cors";

import { create, readOne, readAll, update, remove } from "../controllers/commentController.js";

const comment = express();
comment.use(cors());
comment.use(express.json());

comment.post("/comentarios", create);
comment.get("/comentario", readOne);
comment.get("/comentarios", readAll);
comment.put("/comentarios", update);
comment.delete("/comentarios", remove);

export default comment;
