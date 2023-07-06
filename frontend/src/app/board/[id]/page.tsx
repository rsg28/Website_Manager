"use client";

export default function Boards({ params }: { params: { id: string } }) {
    return (<div>Board id {params.id}</div>)
}
