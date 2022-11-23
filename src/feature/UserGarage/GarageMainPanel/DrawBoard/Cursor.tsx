import React, { useEffect, useState } from 'react';
import './DrawBoard.css';
import { Box, Chip } from '@mui/material';

type Props = {
  isShown: boolean
  offsetX: number
  offsetY: number
  showAxis: boolean
}

function Cursor ({isShown, offsetX, offsetY, showAxis}:Props) {
  const [position, setPosition] = useState({x: 0, y: 0});

  useEffect(() => {
    addEventListeners();
    return () => removeEventListeners();
  }, []);

  const addEventListeners = () => {
    document.addEventListener("mousemove", onMouseMove);
  };

  const removeEventListeners = () => {
    document.removeEventListener("mousemove", onMouseMove);
  };

  const onMouseMove = (event:MouseEvent) => {
    setPosition({x: event.clientX - offsetX, y: event.clientY - offsetY});
  };

  return (
    <>
      <div
        className="cursor"
        style={{ position: 'absolute', top: position.y, left: position.x, display: isShown ? "block" : "none" }}
      />
      { showAxis &&
        <Box sx={{ float: 'right' }}>
          <Chip label={`X:${position.x}`}/> &nbsp;
          <Chip label={`Y:${position.y}`}/>
        </Box>
      }
    </>
  )
}

export default Cursor;
