import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  IconButton,
  Link, Table,
  TableBody, TableCell,
  TableContainer, TableRow,
  Toolbar
} from '@mui/material';
import { Delete, Download, Upload } from '@mui/icons-material';
import {
  changeContentResources,
  deleteActivityContent, saveActivityContent,
  uploadActivityContent
} from '../../../../store/vehicleActivitiesSlice';
import { APIResponse, ContentMetadata } from '../../../../service/model/Response';
import { Activity, ContentResource } from '../../../../store/model/Activity';
import { useAppDispatch } from '../../../../App.hooks';
import { contentService } from '../../../../service';
import AuthThumbnail from '../../../../component/AuthThumbnail';
import ConfirmDialog from '../../../../component/ConfirmDialog';

const initialState:{contents:(ContentMetadata | null)[], contentThumbnails:string[]} = {
  contents: [],
  contentThumbnails: []
};

interface Props {
  activity: Activity
}

function ActivityAttachmentsPanel ({activity}:Props) {
  const [contentMetadataList, setContentMetadataList] = useState(initialState.contents);
  const [isUploading, setIsUploading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentUuid, setCurrentUuid] = useState('');

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (activity?.contentResources) {
      contentService.getContentMetadataList(activity.contentResources)
        .then((contentMetadataList) => {
          setContentMetadataList(contentMetadataList);
        });
    }
  }, [activity]);

  const handleUpload = async (event:ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { payload } = await dispatch(uploadActivityContent(file));
      const { data } = payload as APIResponse<ContentMetadata>;
      if (data) {
        const newContentResource:ContentResource = {contentResourceId: data.uuid};
        if (activity.id > 0) {
          newContentResource.activityId = activity.id;
          dispatch(saveActivityContent(newContentResource));
        }
        const updateContentResources = [...(activity.contentResources ?? []), newContentResource];
        dispatch(changeContentResources(updateContentResources));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  }

  const handleRowClick = (uuid:string | undefined):void => {
    console.log(uuid);
  }

  const handleDelete = ():void => {
    setIsConfirmOpen(true);
  }

  const deleteCancel = ():void => {
    setIsConfirmOpen(false);
  }

  const deleteConfirm = async () => {
    try {
      if (!activity.contentResources) { return; }

      const contentResource = activity.contentResources
        .find(contentResource => contentResource.contentResourceId === currentUuid);

      if (!contentResource || !contentResource.id) { return; }

      const { payload } = await dispatch(deleteActivityContent(contentResource.id));
      const { status } = payload as APIResponse<any>

      if (status === 204) {
        const updateContentResources = activity.contentResources
          .filter(contentMetadata => contentMetadata.contentResourceId !== currentUuid);

        dispatch(changeContentResources(updateContentResources));
      }

      setIsConfirmOpen(false);
    } catch (error) {
      console.error(error);
    }
  }

  const handleDownload = (uuid:string | undefined, fileName:string | undefined):void => {
    uuid?.trim() && contentService.download(uuid, fileName);
  }

  return (
    <>
      <Toolbar>
        <Box>
          { isUploading && <CircularProgress size={"small"} sx={{position: 'absolute', bottom: 88, right: 48}}/> }
          {!isUploading &&
          <IconButton
            component="label"
            aria-label="upload"
            color="primary"
          >
            <input onChange={handleUpload} hidden accept="*/*" type="file"/>
            <Upload/>
          </IconButton>
          }
        </Box>
        <Box>show upload progress here</Box>
      </Toolbar>

      <TableContainer sx={{ overflowX: 'hidden' }}>
        <Table aria-label="activity attachments table">
          <TableBody>
            {contentMetadataList?.map( (contentMetadata, index) =>
              <TableRow
                key={index}
                hover
                tabIndex={-1}
                sx={{width: '90%', '&:last-child td, &:last-child th': { border: 0 } }}
                onClick={() => handleRowClick(contentMetadata?.uuid)}
                onMouseEnter={() => setCurrentUuid(contentMetadata?.uuid ?? '')}
              >
                <TableCell component="td" width={30}>
                  <AuthThumbnail contentId={contentMetadata?.uuid} idx={index} sx={{width:28, height:36}}/>
                </TableCell>
                <TableCell component="td">
                  <Link color="secondary" noWrap={true} variant="subtitle1">
                    {contentMetadata?.filename}
                  </Link>
                </TableCell>
                <TableCell component="td" align="right" width={180}>
                  { currentUuid === contentMetadata?.uuid &&
                    <>
                      <IconButton size={'small'} onClick={() => handleDownload(contentMetadata?.uuid, contentMetadata?.filename)}>
                        <Download/>
                      </IconButton>
                      <IconButton size={'small'} onClick={() => handleDelete()}>
                        <Delete/>
                      </IconButton>
                    </>
                  }
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

      </TableContainer>

      <ConfirmDialog
        title="Delete"
        message="Are you sure to delete this attachment?"
        isShown={isConfirmOpen}
        confirmCallback={deleteConfirm}
        cancelCallback={deleteCancel}
      />
    </>
  )
}

export default ActivityAttachmentsPanel;