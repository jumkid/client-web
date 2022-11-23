import React, { useEffect, useLayoutEffect, useReducer, useState } from 'react';
import { Box, Button, Chip, CircularProgress, Stack } from '@mui/material';
import * as C from '../../../../App.constants';
import './DrawBoard.css';
import { contentService } from '../../../../service';
import { ControlCamera, Pause, PlayCircleOutline } from '@mui/icons-material';
import { Buffer } from 'buffer';

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

function GalleryDrawBoard ({mediaGalleryId}:Props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    clearInterval(state.intervalEvent);
    setLoading(true);
    contentService.getGalleryItemIds(mediaGalleryId!).then(
      (items) => {
        dispatch({ type: 'setItemsId', payload: items });
      }
    )
  }, [mediaGalleryId]);

  useLayoutEffect(() => {
    preloadImages(state.itemsId, () => {
      setLoading(false);
    });
  }, [state.itemsId]);

  useEffect(() => {
    if (state.autoplay) {
      const intervalEvent = runAutoplay();
      dispatch({ type: 'setIntervalEvent', payload: intervalEvent });
    }
    else clearInterval(state.intervalEvent);
  }, [state.autoplay]);

  const preloadImages = (items:string[], callback:()=>void) => {
    const imagesBase64:string[] = [];
    items.map((item, i, {length}) => {
      contentService.getContentSteam(item).then((response) => {
        const base64 = Buffer.from(response.data, 'binary').toString('base64');
        const data = `data:${response.headers['content-type']};base64,${base64}`;
        imagesBase64.push(data);
        if (i === length - 1) {
          dispatch({ type: 'setItemsImage', payload: imagesBase64 });
          callback();
        }
      })
    });
  }

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

  const oneStepChange = () => {
    const max = state.itemsId.length - 1;
    state.direction === C.RIGHT
      ?
      setStep(prevStep => (prevStep > 0) ? prevStep - 1 : max )
      :
      setStep(prevStep => (prevStep < max) ? prevStep + 1 : 0)

  }

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
    <Box width="100%" height="380px" sx={{ backgroundColor: '#FFF', py: 1}}>
      <Stack alignItems="center" height="100%">
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
    </Box>
  )
}

export default GalleryDrawBoard;
