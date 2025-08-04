import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import loginRoute from "./routes/loginRoute.js";
import mongoose from "mongoose";

const app = express();
dotenv.config(); // loads .env varibales (that can be access using process.env)

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Database connected"))
  .catch((err) =>
    console.log("Database connection failed due to error :", err)
  );

app.use(cors()); //assigning middleware

app.use(express.json()); //handling data send by frontend

app.use("/api/auth", loginRoute);

app.listen(5000, () => {
  console.log("Server is running");
});
