import * as db from "./db";
import boardsRouter from "./routes/boards";

import express from "express";
import { auth } from "express-oauth2-jwt-bearer";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

db.init();

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

const jwtCheck = auth({
    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    tokenSigningAlg: 'RS256'
});

app.use(jwtCheck);

app.get("/api/test", async (req, res) => {
    const testInfo = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}userinfo`, {
        headers: {
            "content-type": "application/json",
            Authorization: req.headers.authorization!
        }
    }); 

    // google-oauth2|113842120758769624140

    const testInfoJson = await testInfo.json();
    console.log(testInfoJson);

    // console.log(req.auth);
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log("Backend server started");
});