import { config } from "dotenv";
config();
import express from "express";
const app = express();
import apiRouter from "./routes/api.js";
import cors from "cors";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
