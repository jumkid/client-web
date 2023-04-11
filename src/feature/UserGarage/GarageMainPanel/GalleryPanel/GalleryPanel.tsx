import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { Box, Button, Chip, CircularProgress, Paper, Stack } from '@mui/material';
import * as C from '../../../../App.constants';
import './Gallery.css';
import { contentService } from '../../../../service';
import { ControlCamera, Pause, PlayCircleOutline } from '@mui/icons-material';
import * as _ from 'lodash';
import { preloadContentThumbnails } from '../../../../App.utils';

const showDebug= false;

type ComponentState = {
  itemsId:string[]      // store the item id in media gallery
  itemsImage:string[]   // store the image of base64 string for each item
  isDragging:boolean    // indicate user is dragging the gallery image
  axisX:number          // scale the horizontal movement of mouse
  direction:string
  autoplay:boolean      // auto switch image display in gallery
  intervalEvent:ReturnType<typeof setInterval>
}

type Action = { type: 'setItemsId', payload: string[] }
  | { type: 'setItemsImage', payload: string[] }
  | { type: 'setIsDragging', payload: boolean }
  | { type: 'setAxisX', payload: number }
  | { type: 'setDirection', payload: string }
  | { type: 'setAutoplay', payload: boolean }
  | { type: 'setIntervalEvent', payload: ReturnType<typeof setInterval> }
  | { type: 'reset' }

const stepDistance = 15;

const initialState:ComponentState = {
  itemsId: [],
  itemsImage: [],
  isDragging: false,
  axisX: 0,
  direction: C.RIGHT,
  autoplay: false,
  intervalEvent: setInterval(() => { return; }, -1)
}

const reducer = (state:ComponentState, action:Action):ComponentState => {
  switch (action.type) {
  case 'setItemsId':
    return {...state, itemsId: action.payload};
  case 'setItemsImage':
    return {...state, itemsImage: action.payload};
  case 'setIsDragging':
    return {...state, isDragging: action.payload};
  case 'setAxisX':
    return {...state, axisX: action.payload};
  case 'setDirection':
    return {...state, direction: action.payload};
  case 'setAutoplay':
    return {...state, autoplay: action.payload};
  case 'setIntervalEvent':
    return {...state, intervalEvent: action.payload};
  case 'reset':
    return initialState;
  default:
    throw new Error(`Unknown action type`);
  }
}

type Props = {
  mediaGalleryId?:string | null
}

function GalleryPanel ({mediaGalleryId}:Props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clearInterval(state.intervalEvent);
    setStep(0);
    setLoading(true);
    if (!mediaGalleryId) { return; }

    contentService.getGalleryItemIds(mediaGalleryId)
      .then((items) => { dispatch({ type: 'setItemsId', payload: items });});

  }, [mediaGalleryId]);

  useEffect(() => {
    preloadContentThumbnails(state.itemsId, 'large')
      .then((response) => {
        dispatch({ type: 'setItemsImage', payload: response });
        setLoading(false);
      })
  }, [state.itemsId]);

  useEffect(() => {
    if (state.autoplay) {
      const intervalEvent = runAutoplay();
      dispatch({ type: 'setIntervalEvent', payload: intervalEvent });
    } else {
      clearInterval(state.intervalEvent);
    }
  }, [state.autoplay]);

  const handleMouseMove = (event:React.MouseEvent) => {
    if (state.axisX > event.clientX ) {
      dispatch({ type: 'setDirection', payload: C.LEFT });
    } else if (state.axisX < event.clientX ) {
      dispatch({ type: 'setDirection', payload: C.RIGHT });
    }

    if (Math.abs(event.clientX - state.axisX) >= stepDistance && state.isDragging) {
      dispatch({ type: 'setAxisX', payload: event.clientX });
      oneStepChange();
    }
  }

  const oneStepChange = useCallback(() => {
    const max = state.itemsId.length - 1;
    state.direction === C.RIGHT
      ?
      setStep(prevStep => (prevStep > 0) ? prevStep - 1 : max )
      :
      setStep(prevStep => (prevStep < max) ? prevStep + 1 : 0)

  }, [state.itemsId, state.direction]);

  const handleMouseDown = (event:React.MouseEvent) => {
    dispatch({ type: 'setIsDragging', payload: true });
    dispatch({ type: 'setAutoplay', payload: false });
  }

  const handleMouseUp = (event:React.MouseEvent) => {
    dispatch({ type: 'setIsDragging', payload: false });
  }

  const toggleAutoplay = () => {
    dispatch({ type: 'setDirection', payload: C.RIGHT });
    dispatch({ type: 'setAutoplay', payload: !state.autoplay });
  }

  const runAutoplay = ():ReturnType<typeof setInterval> => {
    return setInterval(() => {
      oneStepChange();
    }, 100);
  }

  return (
    <Box
      width="100%"
      height="380px"
      className="drawboard"
      sx={{ py: 1, gridTemplateColumns: 'repeat(10, 1fr)', display: 'grid', gap: 1 }}
    >
      <Stack alignItems="center" height="100%" gridColumn="span 9">
        <Box
          className='draggable'
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          sx={{
            width: '60%',
            height: '100%',
            background: `url('${!loading && state.itemsImage[step]}')`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center'
          }}
        >
          {loading && (
            <CircularProgress
              size={86}
              sx={{
                marginLeft: '45%',
                marginTop: '20%'
              }}
            />
          )}
        </Box>
        { showDebug &&
        <Box sx={{ float: 'right' }}>
          <Chip label={`direction: ${state.direction}`}/>
          <Chip label={`dragging: ${state.isDragging}`}/>
          <Chip label={`step: ${step}`}/>
          <Chip label={`total: ${state.itemsId.length}`}/>
        </Box>
        }
        <Box>
          <Chip icon={<ControlCamera/>} label="drag to change" />
          <Button color="primary" onClick={toggleAutoplay}>
            { !state.autoplay ? <PlayCircleOutline/> : <Pause/> }
            Autoplay
          </Button>
        </Box>
      </Stack>

      <Box gridColumn="span 1" sx={{ float: 'right', overflowY: 'auto' }}>
        {!_.isEmpty(state.itemsImage) && !loading && state.itemsImage.map((itemImage, idx) => (
          <Paper key={idx}
            sx={{
              width: '90%',
              height: 54,
              mb: 1,
              background: `#000 url('${itemImage}')`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
              cursor: 'pointer',
            }}
            onClick={() => setStep(idx)}
          >
          </Paper>
        ))}
      </Box>
    </Box>
  )
}

export default GalleryPanel;
