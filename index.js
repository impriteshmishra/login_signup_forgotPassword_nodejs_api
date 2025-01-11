import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";

dotenv.config();
const app = express()
const PORT = process.env.PORT || 3000;

app.use(express.json());


 //my api
app.use("/api/v1/user", userRoute);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server listen at port ${PORT}`);
});