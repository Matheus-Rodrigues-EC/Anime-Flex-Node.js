import cors from "cors";
import express from "express";

import { loginAdmin, createAdmin, readAdmin, updateAdmin, deleteAdmin, listMembers, banMember } from "../controllers/adminController.js";


const admin = express();
admin.use(cors());
admin.use(express.json());

// Admin Routes
admin.post("/admlogin", loginAdmin);
admin.post("/createAdmin", createAdmin);
admin.get("/getadmins", readAdmin);
admin.get("/getMembers", listMembers)
admin.put("/updateadmin", updateAdmin);
admin.delete("/deleteAdmin", deleteAdmin);
admin.delete("/banMember", banMember);

export default admin;