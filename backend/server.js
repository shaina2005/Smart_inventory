import express from "express";
import cors from "cors";
import loginRoute from "./routes/loginRoute.js";

const app = express();
app.use(cors()); //assigning middleware

app.use(express.json()); //handling data send by frontend

app.use("/api/auth", loginRoute);

app.listen(5000, () => {
  console.log("Server is running");
});
