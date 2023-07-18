import React, { ChangeEvent, useCallback, useEffect, useReducer, useState } from 'react';
import { Box, Button, Chip, CircularProgress, LinearProgress, Paper, Stack } from '@mui/material';
import './Gallery.css';
import { contentService } from '../../../../service';
import { Delete, Pause, PlayCircleOutline, Upload } from '@mui/icons-material';
import { preloadContentThumbnails } from '../../../../App.utils';
import { useAppDispatch, useAppSelector } from '../../../../App.hooks';
import { ContentMetadata } from '../../../../service/model/Response';
import { changeMediaGalleryId, updateVehicle } from '../../../../store/userVehiclesSlice';
import { RootState } from '../../../../store';
import ConfirmDialog from '../../../../component/ConfirmDialog';
import { DISPLAY_MODE } from '../../../../service/model/CommonTypes';
import * as _ from 'lodash';
import * as C from '../../../../App.constants';
import { JK_RED } from '../../../../layout/Layout.Theme';

const showDebug= false;

const initialState:ComponentState = {
  itemsId: [],
  itemsImage: [],
  isDragging: false,
  axisX: 0,
  direction: C.RIGHT,
  autoplay: false,
  intervalEvent: setInterval(() => { return; }, -1)
}

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
  mode: DISPLAY_MODE
  mediaGalleryId?: string | null
}

function GalleryPanel ({mode, mediaGalleryId}:Props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const editableVehicle = useAppSelector((state: RootState) => state.userVehicles.currentVehicle);
  const appDispatch = useAppDispatch();

  //set mediaGalleryId for form
  if (!_.isNil(editableVehicle)) { mediaGalleryId = editableVehicle.mediaGalleryId; }

  useEffect(() => {
    if (_.isNil(mediaGalleryId)) { return; }

    clearInterval(state.intervalEvent);
    setStep(0);
    setLoading(true);

    dispatch({ type:'setItemsImage', payload:[] });

    contentService.getGalleryItemIds(mediaGalleryId)
      .then((itemsId) => {
        dispatch({ type:'setItemsId', payload:itemsId });
        if (!_.isEmpty(itemsId)) {
          preloadGalleryImages(itemsId, 'large', () => {setLoading(false);});
        } else {
          setLoading(false);
        }
      });
  }, [mediaGalleryId]);

  useEffect(() => {
    if (state.autoplay) {
      const intervalEvent = runAutoplay();
      dispatch({ type: 'setIntervalEvent', payload: intervalEvent });
    } else {
      clearInterval(state.intervalEvent);
    }
  }, [state.autoplay]);

  const preloadGalleryImages = (itemsId:string[], size:string, callBack?:()=>void) => {
    preloadContentThumbnails(itemsId, 'large')
      .then((response) => {
        dispatch({ type:'setItemsImage', payload:response });
        if (!_.isNil(callBack)) {
          callBack();
        }
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

  const confirmDelete = ():void => {
    if (loading) {
      return;
    }
    setIsConfirmOpen(true);
  }

  const confirmCancel = ():void => {
    setIsConfirmOpen(false);
  };

  const handleUpload = async (event:ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || isUploading || _.isNil(editableVehicle)) { return; }

    setIsUploading(true);
    try {
      const tags = [editableVehicle.make, editableVehicle.model, editableVehicle.modelYear];
      const response = await contentService.galleryUpload(mediaGalleryId, files, tags, editableVehicle.name,
        editableVehicle.accessScope, setProgress);

      if (!response.data) { return; }

      const updatedMediaGallery:ContentMetadata = response.data;
      if (updatedMediaGallery.uuid != mediaGalleryId) {
        appDispatch(changeMediaGalleryId(updatedMediaGallery.uuid));
        appDispatch(updateVehicle({
          id:editableVehicle.id!,
          vehicle:{
            mediaGalleryId:updatedMediaGallery.uuid,
            accessScope:editableVehicle.accessScope,
            modificationDate:editableVehicle.modificationDate
          }
        }));
      }

      //reload gallery
      const updatedItemsId = updatedMediaGallery.children.map(ref => ref.uuid);
      dispatch({ type:'setItemsId', payload:updatedItemsId });
      preloadGalleryImages(updatedItemsId, 'large', () => {setLoading(false);});
      //show the last image
      setStep(updatedItemsId.length - 1);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  const handleDelete = async () => {
    if (_.isNil(mediaGalleryId)) { return; }
    setIsConfirmOpen(false);
    setLoading(true);
    try {
      const itemId = state.itemsId[step];
      const response = await contentService.deleteGalleryItems(mediaGalleryId, [itemId]);

      if (!_.isNil(response.data)) {
        const remainItems = response.data as ContentMetadata[];
        const updatedItemsId = remainItems.map(metadata => metadata.uuid);
        dispatch({type: 'setItemsId', payload: updatedItemsId});
        preloadGalleryImages(updatedItemsId, 'large');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setStep(prevState => prevState != 0 ? prevState - 1 : 0);
    }
  }

  return (
    <Box
      width="100%"
      height={mode === C.MODE_ACTIVE ? '364px' : '236px'}
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
            backgroundPosition: 'center center',
            mb:1
          }}
        >
          { loading && (
            <CircularProgress
              size={86}
              sx={{
                marginLeft: '45%',
                marginTop: '10%'
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
          { mode === C.MODE_ACTIVE &&
          <>
            <Button color="primary" onClick={toggleAutoplay}>
              { !state.autoplay ? <PlayCircleOutline/> : <Pause/> }
              Autoplay
            </Button>
            <Button component="label" aria-label="upload" color="primary">
              <input onChange={handleUpload} hidden accept="*/*" type="file" multiple={true}/>
              <Upload />Upload
            </Button>
            <Button
              component="label"
              aria-label="delete"
              color="primary"
              disabled={_.isEmpty(state.itemsId)}
              onClick={confirmDelete}
            >
              <Delete />Delete
            </Button>
            <Box sx={{height:4}}>{ isUploading && <LinearProgress variant={"determinate"} value={progress}/> }</Box>
            <ConfirmDialog
              title="Delete Image"
              message="This image will be removed. Are you sure to delete?"
              isShown={isConfirmOpen}
              confirmCallback={handleDelete}
              cancelCallback={confirmCancel}
            />
          </>
          }
        </Box>
      </Stack>

      <Box gridColumn="span 1" sx={{ float: 'right', overflowY: 'auto' }}>
        {!loading && !_.isEmpty(state.itemsImage) && state.itemsImage.map((itemImage, idx) => (
          <Paper
            key={idx}
            sx={{
              width: '90%',
              height: 54,
              mb: 1,
              background: `#000 url('${itemImage}')`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
              cursor: 'pointer',
              border: `4px ${(step === idx) ? JK_RED : '#000'} solid`
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
