import { useState, RefObject } from "react";

// Define the type for the initial state
interface InitialState {
  x: number;
  y: number;
}

const useDragScroll = (initialState: InitialState = { x: 0, y: 0 }) => {
  // Define state for the initial position and whether the user is dragging
  const [state, setState] = useState<InitialState>(initialState);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Define the onMouseDown event handler
  const onMouseDown = (e: React.MouseEvent) => {
    // Only start dragging if the left mouse button was pressed
    if (e.button === 0) {
      setIsDragging(true);
      setState({ x: e.clientX, y: e.clientY });
    }
  };

  // Define the onMouseMove event handler
  const onMouseMove = (e: React.MouseEvent, ref: RefObject<HTMLElement>) => {
    // Only move the scroll position if the user is dragging and the ref is defined
    if (!ref.current || !isDragging) return;

    ref.current.scrollLeft -= e.clientX - state.x;
    ref.current.scrollTop -= e.clientY - state.y;

    setState({ x: e.clientX, y: e.clientY });
  };

  // Define the onMouseUp event handler
  const onMouseUp = () => {
    setIsDragging(false);
  };

  // Return the event handlers
  return { onMouseDown, onMouseMove, onMouseUp };
};

export default useDragScroll;