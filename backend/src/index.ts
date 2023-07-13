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

// TODO: this is a temporary proxy to get around CORS issues
// it will have to be completely rewritten to support POST requests and absolute URLs
app.get('/api/proxy', async (req, res) => {
    const url = req.query.url;
  
    if (url === undefined) {
        res.status(400).send('Error: URL not specified');
        return;
    }

    try {
        const resFetch = await fetch(url as string);
        const data = await resFetch.text();
        res.setHeader('Content-Type', resFetch.headers.get('Content-Type') || 'application/octet-stream');
        res.send(data);
    } catch (error) {
        res.status(500).send('Error: Unable to fetch URL');
    }
});

app.use("/api/boards", boardsRouter);

app.listen(port, () => {
    console.log("Backend server started");
});