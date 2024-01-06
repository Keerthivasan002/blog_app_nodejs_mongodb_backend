import express from "express"
import { registerUser, login, profile } from "../Controls/userControls.js";
import { validateToken } from "../middleware/validateToken.js";


const userRoutes = express.Router();

userRoutes.post("/register", registerUser)
userRoutes.post("/login",login)
userRoutes.get("/profile",validateToken,profile)

export default userRoutes