import { Schema, model, connect, ObjectId, Document } from "mongoose";

// Interfaces
export interface IBoard {
    _id: ObjectId;
    name: string;
    description: string;
    ownedBy: String; // TODO: Change to ObjectId if we don't use the auth0 uuid directly
    thumbnail: string;
    widgets: IWidget[];
}

export interface IWidget {
    size: {width: number, height: number};
    position: {x: number, y: number};
    contentType: "htmlPreview" | "text" | "graphic",
    content: IHtmlPreviewWidget | ITextWidget | IGraphicWidget;
}

export interface IHtmlPreviewWidget extends Document {
    URL: string;
    zoom: number;
    scroll: {x: number, y: number};
}

export interface ITextWidget {
    text: string;
    fontSize: number;
    font: string;
}

export interface IGraphicWidget {
    URL: string;
    scroll: {x: number, y: number};
    zoom: number;
}

// Schemas
const BoardSchema = new Schema<IBoard>({
    name: { type: String, required: true },
    description: { type: String, required: false },
    ownedBy: { type: String, required: true },
    thumbnail: { type: String, required: false },
    widgets: {
        type: [
            {
                size: {
                    width: { type: Number, required: true },
                    height: { type: Number, required: true }
                },
                position: {
                    x: { type: Number, required: true },
                    y: { type: Number, required: true }
                },
                contentType: { type: String, required: true },
                content: { type: Schema.Types.Mixed, required: true }
            }
        ],
        required: true
    }
});

// Models
export const Board = model<IBoard>("Board", BoardSchema);

// Connect to DB
export async function init() {
    await connect(process.env.MONGO_CONNECTION_STRING || "");
}
