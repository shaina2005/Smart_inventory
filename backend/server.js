import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import loginRoute from "./routes/loginRoute.js";
import mongoose from "mongoose";
import inventoryRoute from "./routes/inventoryRoute.js";
import HelpRoute from "./routes/HelpRoute.js"

const PORT = 5000;
const app = express();
dotenv.config(); // loads .env varibales (that can be access using process.env)
app.use(express.json()); //handling data send by frontend

const customMiddleware = (req, res, next) => {
  const current = new Date().toLocaleString();
  console.log(`Date : ${current} , Method : ${req.method} , URL : ${req.url}`);
  next();
};

app.use(customMiddleware);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Database connected :", mongoose.connection.name))
  .catch((err) =>
    console.log("Database connection failed due to error :", err)
  );

app.use(cors()); //assigning middleware

app.use("/api/auth", loginRoute);
app.use("/items", inventoryRoute);
app.use("/help",HelpRoute);

app.listen(PORT, () => {
  console.log("Server is running : ", PORT);
});
