import cors from "cors";
import express from "express";

import { loginAdmin, addAdmin, removeAdmin, banMember } from "../controllers/adminController.js";


const admin = express();
admin.use(cors());
admin.use(express.json());

// Admin Routes
admin.post("/add", addAdmin);
admin.post("/admlogin", loginAdmin);
admin.delete("/removeadmin", removeAdmin);
admin.delete("/banmember", banMember);

export default admin;