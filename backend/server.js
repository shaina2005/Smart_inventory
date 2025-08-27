import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import loginRoute from "./routes/loginRoute.js";
import mongoose from "mongoose";
import inventoryRoute from "./routes/inventoryRoute.js";

const app = express();
dotenv.config(); // loads .env varibales (that can be access using process.env)
app.use(express.json()); //handling data send by frontend

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Database connected :" , mongoose.connection.name))
  .catch((err) =>
    console.log("Database connection failed due to error :", err)
  );

app.use(cors()); //assigning middleware


app.use("/api/auth", loginRoute);
app.use("/items",inventoryRoute);

app.listen(5000, () => {
  console.log("Server is running");
});
