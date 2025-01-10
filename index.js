import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";

dotenv.config();
const app = express()
const PORT = process.env.PORT || 3000;

//middlewares
app.use(express.json());
// app.use(cookieParser());

// const corsOptions = {
//     origin: process.env.URL,
//     credentials: true
// }
// app.use(cors(corsOptions));

 //api
app.use("/api/v1/user", userRoute);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server listen at port ${PORT}`);
});