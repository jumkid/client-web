import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  Box,
  IconButton, LinearProgress,
  Link, Table,
  TableBody, TableCell,
  TableContainer, TableRow
} from '@mui/material';
import { Delete, Download, Upload } from '@mui/icons-material';
import {
  changeContentResources,
  deleteActivityContent, saveActivityContent
} from '../../../../../store/vehicleActivitiesSlice';
import { APIResponse, ContentMetadata } from '../../../../../service/model/Response';
import { ContentResource } from '../../../../../store/model/Activity';
import { useAppDispatch, useAppSelector } from '../../../../../App.hooks';
import { contentService } from '../../../../../service';
import AuthThumbnail from '../../../../../component/AuthThumbnail';
import ConfirmDialog from '../../../../../component/ConfirmDialog';
import { RootState } from '../../../../../store';
import * as _ from 'lodash';
import './index.css'

const initialState:{contents:(ContentMetadata | null)[], contentThumbnails:string[]} = {
  contents: [],
  contentThumbnails: []
};

function ActivityAttachmentsPanel () {
  const [contentMetadataList, setContentMetadataList] = useState(initialState.contents);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentUuid, setCurrentUuid] = useState('');

  const currentActivity = useAppSelector((state:RootState) => state.vehicleActivities.currentActivity);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (currentActivity?.contentResources) {
      contentService.getContentMetadataList(currentActivity.contentResources)
        .then((contentMetadataList) => {
          setContentMetadataList(contentMetadataList);
        });
    }
  }, [currentActivity]);

  const handleUpload = async (event:ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || isUploading) { return; }

    setIsUploading(true);

    try {
      const response = await contentService.upload(file, 'private', setProgress);

      if (!response.data) { return; }

      const newContentResource:ContentResource = {contentResourceId: response.data.uuid};
      if (currentActivity.id > 0) {
        newContentResource.activityId = currentActivity.id;
        const { payload } = await dispatch(saveActivityContent(newContentResource));
        const { data } = payload as APIResponse<ContentResource>;
        newContentResource.id = data?.id;
      }

      const updateContentResources = [...(currentActivity.contentResources ?? []), newContentResource];
      dispatch(changeContentResources(updateContentResources));
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
      event.target.value = "";
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

  const deleteConfirm = async ():Promise<void> => {
    try {
      setIsConfirmOpen(false);

      if (!currentActivity.contentResources) { return; }

      const contentResource = currentActivity.contentResources
        .find(contentResource => contentResource.contentResourceId === currentUuid);

      if (!contentResource || !contentResource.id) { return; }

      const { payload } = await dispatch(deleteActivityContent(contentResource.id));
      const { status } = payload as APIResponse<string>

      if (status === 204) {
        const updateContentResources = currentActivity.contentResources
          .filter(contentMetadata => contentMetadata.contentResourceId !== currentUuid);

        dispatch(changeContentResources(updateContentResources));
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleDownload = (uuid:string | undefined, fileName:string | undefined):void => {
    uuid?.trim() && contentService.download(uuid, fileName);
  }

  return (
    <>
      <TableContainer>
        <Table aria-label="activity attachments">
          <TableBody>
            {!_.isNil(contentMetadataList) && contentMetadataList.map( (contentMetadata, index) =>
              <TableRow
                key={index}
                hover
                tabIndex={-1}
                className="attachments-table-row"
                onClick={() => handleRowClick(contentMetadata?.uuid)}
                onMouseEnter={() => setCurrentUuid(contentMetadata?.uuid ?? '')}
              >
                <TableCell component="td" width={30}>
                  <AuthThumbnail contentId={contentMetadata?.uuid} idx={index} width={28} height={36}/>
                </TableCell>
                <TableCell component="td">
                  <Link color="secondary" noWrap={true} variant="subtitle1">
                    {contentMetadata?.filename}
                  </Link>
                </TableCell>
                <TableCell component="td" align="right">
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

      <Box className="upload-toolbar">
        <IconButton className="upload-button" component="label" aria-label="upload">
          <input onChange={handleUpload} hidden accept="*/*" type="file"/>
          <Upload fontSize={"large"}/>
        </IconButton>
        <Box className="upload-progress">
          { isUploading && <LinearProgress variant={"determinate"} value={progress} color={"secondary"}/> }
        </Box>
      </Box>

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