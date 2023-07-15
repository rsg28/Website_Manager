import { IBoard } from "../../backend/src/db";

export async function createNewBoard(name: string, authToken: string) {
    const res = await fetch('/api/boards', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ name })
    });
    const data = await res.json();
    return data.id;
}

export async function fetchBoard(id: string, authToken: string) {
    const res = await fetch(`/api/boards/${id}`, {
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${authToken}`
        }
    });
    const data = await res.json();
    return data;
}

export async function updateBoard(boardId: string, boardData: IBoard, authToken: string) {
    const res = await fetch(`/api/boards/${boardId}`, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(boardData)
    });
    const data = await res.json();
    return data;
}

export async function getBoardMetadata(authToken: string) {
    const res = await fetch('/api/boards', {
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${authToken}`
        }
    });
    const data = await res.json();
    return data;
}