import React from "react";

export function CustomDrag(
    props: {children: React.ReactNode, 
    setPosition: (position: {x: number, y: number}) => void,
    currentPosition: {x: number, y: number},
    onEnd: () => void
    className?: string,
}) {
    const [isDragging, setIsDragging] = React.useState(false);
    const [startingMousePosition, setStartingMousePosition] = React.useState({x: 0, y: 0});
    const [disablePointerEvents, setDisablePointerEvents] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            if (isDragging) {
                setIsDragging(false);
                props.onEnd();
                setDisablePointerEvents(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isDragging, props]);

    return (<div
        className={props.className}
        style={{position: "absolute", top: props.currentPosition.y, left: props.currentPosition.x}}
        onMouseDown={(e) => {setIsDragging(true); setStartingMousePosition({x: e.clientX, y: e.clientY})}}
        onMouseUp={(e) => {setIsDragging(false); props.onEnd(); setDisablePointerEvents(false);}}
        onMouseMove={(e) => {
            if (isDragging) {
                setDisablePointerEvents(true);
                const differenceX = e.clientX - startingMousePosition.x;
                const differenceY = e.clientY - startingMousePosition.y;
                props.setPosition({x: props.currentPosition.x + differenceX, y: props.currentPosition.y + differenceY});
                setStartingMousePosition({x: e.clientX, y: e.clientY});
            }
        }}
        >   
            <div style={{pointerEvents: disablePointerEvents ? "none" : "all", width: "100%", height: "100%"}}>
                {props.children}
            </div>
    </div>);
};