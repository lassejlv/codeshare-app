import { config } from "dotenv";
config();
import express from "express";
const app = express();
import apiRouter from "./routes/api.js";
import cors from "cors";
import { rateLimit } from "express-rate-limit";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);
app.use(
  rateLimit({
    // per minute
    windowMs: 60 * 1000,
    limit: 15,
    message: "Too many requests from this IP, please try again later",
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
