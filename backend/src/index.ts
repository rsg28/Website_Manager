import express from "express";
const app = express();
const port = 3000; // TODO: this should be an env variable 

app.get("/api", (req, res) => {
    res.send("Hi from backend");
});

app.listen(port, () => {
    console.log("Backend server started");
});