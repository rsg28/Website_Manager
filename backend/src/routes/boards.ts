// All routes for /api/boards
import * as db from "../db";

import express from "express";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Interfaces

export interface BoardMetadata {
    id: string;
    name: string;
    description: string;
    thumbnail: string;
}

// Handlers

function getUserID() {
    // TODO: the user ID will be either provided by a JWT or auth0
    return "abc123";
}

// Return all metadata for boards owned by the user
router.get("/", async (req, res) => {
    const uid = getUserID();

    const boards = await db.Board.find({ ownedBy: uid });
    
    const metadata: Array<BoardMetadata> = boards.map((board) => {
        return {
            id: board._id.toString(),
            name: board.name,
            description: board.description,
            thumbnail: board.thumbnail
        } as BoardMetadata;
    });
    

    res.send(metadata);
});

// Insert a new board
router.post(
    "/",
    body("name").notEmpty().isString(),
    async (req, res) => {
        const validated = validationResult(req);
        if (!validated.isEmpty()) {
            res.status(400).send(validated);
            return;
        }

        const uid = getUserID();
        
        const board = new db.Board({
            name: req.body.name,
            description: "A new board on stormboard",
            ownedBy: uid,
            thumbnail: "",
            widgets: []
        });

        await board.save();
        res.send({ id: board._id.toString() });
});


// Get a board
router.get(
    "/:id",
    async (req, res) => {
        const board = await db.Board.findById(req.params.id);
        if (!board) {
            res.status(404).send("Board not found");
            return;
        }
    
        res.send(board);
    }
);

// Update a board
router.put(
    "/:id",
    body("name").notEmpty().isString(),
    body("description").notEmpty().isString(),
    body("thumbnail").notEmpty().isString(),
    body("widgets").notEmpty().isArray(), // TODO: validate widgets
    async (req, res) => {
        //throw new Error("Not implemented");
        const board = await db.Board.findByIdAndUpdate(
            req.body._id,
            req.body
        );
        if (!board) {
            res.status(404).send("Board update failed");
            return;
        }
        res.send(board);
    }
);

// Delete a board
router.delete(
    "/:id",
    async (req, res) => {
        //throw new Error("Not implemented");
        const board = db.Board.findByIdAndDelete(req.body._id);
        if (!board) {
            res.status(404).send("Board delete failed");
            return;
        }
        res.send(board);
    }
);

export default router;
