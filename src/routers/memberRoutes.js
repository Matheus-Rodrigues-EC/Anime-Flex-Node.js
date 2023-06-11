import express from "express";
import cors from "cors";

import { signUpValidation } from "../middlewares/SignUpMiddleware.js";
import { signInValidation } from './../middlewares/SignInMiddleware.js';
import { signIn, signUp, favoritar, desfavoritar, logOut, unsubscribe } from "../controllers/memberController.js";

const member = express();
member.use(cors());
member.use(express.json());

member.post("/signup", signUpValidation, signUp);
member.post("/signin", signInValidation, signIn);
member.post("/favoritar", favoritar);
member.delete("/desfavoritar", desfavoritar);
member.delete("/logout", logOut)
member.delete("/unsubscribe", unsubscribe);

export default member;