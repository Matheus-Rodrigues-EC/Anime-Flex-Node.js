import express from "express";
import cors from "cors";

import { signUpValidation } from "../middlewares/SignUpMiddleware.js";
import { signInValidation } from './../middlewares/SignInMiddleware.js';
import { signIn, createMember, updateMember, favoritar, favoritesList, desfavoritar, logOut, unsubscribe } from "../controllers/memberController.js";

const member = express();
member.use(cors());
member.use(express.json());

member.post("/signup", signUpValidation, createMember);
member.post("/signin", signInValidation, signIn);
member.put("/updateMember", updateMember);
member.post("/favoritar", favoritar);
member.get('/favoritesList', favoritesList);
member.delete("/desfavoritar", desfavoritar);
member.delete("/logout", logOut)
member.delete("/unsubscribe", unsubscribe);

export default member;