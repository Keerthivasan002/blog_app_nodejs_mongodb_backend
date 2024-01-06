import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import BlogRoutes from "./routes/blog.js"
import userRoutes from "./routes/userRoutes.js";
import cors from "cors"

dotenv.config();
const app = express()

app.use(cors({ origin: "*" }))

mongoose.connect(process.env.URL).then(console.log("contected_mong")).catch(err => console.log(err));

app.use(express.json())


app.use("/", userRoutes, BlogRoutes)//app.use its an middleware 
app.listen(5000, () => {
    console.log("node connected");
});