import express from "express";
const app = express();
import apiRouter from "./routes/api.js";
import cors from "cors";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use("/api", apiRouter);

app.listen(parseInt(Bun.env.PORT), () => {
  console.log(`Server listening on port ${Bun.env.PORT}`);
});
