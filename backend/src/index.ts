import * as db from "./db";
import boardsRouter from "./routes/boards";

import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

db.init();

app.get("/api", (req, res) => {
    res.send("Hi from backend");
});

app.use("/api/boards", boardsRouter);

app.listen(port, () => {
    console.log("Backend server started");
});