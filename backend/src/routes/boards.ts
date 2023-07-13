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
const userDataCache = new Map<string, string>();

async function getUserID(userAuthorizationHeader: string) {
    if (userDataCache.has(userAuthorizationHeader)) {
        return userDataCache.get(userAuthorizationHeader);
    }

    const userInfoRes = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}userinfo`, {
        headers: {
            "content-type": "application/json",
            Authorization: userAuthorizationHeader
        }
    }); 

    
    const userInfo = await userInfoRes.json();
    if(userInfo.sub !== undefined) {
        userDataCache.set(userAuthorizationHeader, userInfo.sub);
    }
    return userInfo.sub;
}

// Return all metadata for boards owned by the user
router.get("/", async (req, res) => {
    const uid = await getUserID(req.headers.authorization!);

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

        const uid = await getUserID(req.headers.authorization!);
        
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
    // body("description").notEmpty().isString(), // TODO: re-enable these once validation is done
    // body("thumbnail").notEmpty().isString(), // TODO: re-enable these once validation is done
    body("widgets").notEmpty().isArray(), // TODO: validate widgets
    async (req, res) => {
        const validated = validationResult(req);
        if (!validated.isEmpty()) {
            res.status(400).send(validated);
            return;
        }

        const board = await db.Board.findByIdAndUpdate(
            {
                _id: req.params?.id ?? "" ,
                ownedBy: await getUserID(req.headers.authorization!)
            },
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
        const board = db.Board.findByIdAndDelete(req.body._id);
        if (!board) {
            res.status(404).send("Board delete failed");
            return;
        }
        res.send(board);
    }
);

export default router;
