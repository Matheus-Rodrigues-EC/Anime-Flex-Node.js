import express from "express";
import cors from "cors";

import { signIn, signUp, favoritar, desfavoritar, logOut, unsubscribe } from "../controllers/memberController.js";

const member = express();
member.use(cors());
member.use(express.json());

member.post("/login", signIn);
member.post("/cadastro", signUp);
member.post("/favoritar", favoritar);
member.delete("/desfavoritar", desfavoritar);
member.delete("/logout", logOut)
member.delete("/unsubscribe", unsubscribe);

export default member;