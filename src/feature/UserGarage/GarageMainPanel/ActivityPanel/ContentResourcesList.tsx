import React, { ChangeEvent, useEffect, useState } from 'react';
import { Box, CircularProgress, IconButton, Link, Typography } from '@mui/material';
import { Upload } from '@mui/icons-material';
import { changeContentResources, saveUpdate, uploadActivityContent } from '../../../../store/vehicleActivitiesSlice';
import { useAppDispatch } from '../../../../App.hooks';
import { Activity, ContentResource } from '../../../../store/model/Activity';
import { contentService } from '../../../../service';
import { APIResponse, ContentMetadata } from '../../../../service/model/Response';
import AuthThumbnail from '../../../../component/AuthThumbnail';

interface Props {
  activity: Activity
}

const initialState:{contents:(ContentMetadata | null)[], contentThumbnails:string[]} = {
  contents: [],
  contentThumbnails: []
};

function ContentResourcesList ({activity}:Props) {
  const [contentMetadataList, setContentMetadataList] = useState(initialState.contents);
  const [isUploading, setIsUploading] = useState(false);
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
        }
        const updateContentResources = [...(activity.contentResources ?? []), newContentResource];
        dispatch(changeContentResources(updateContentResources));
        if (activity.id > 0) {
          dispatch(saveUpdate({id: activity.id, contentResources: updateContentResources }));
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <fieldset style={{height: '93%'}}>
      <legend>Attachment</legend>

      <Box>
        {contentMetadataList && contentMetadataList.map( (contentMetadata, index) =>
          <div key={index} className="activity-attachment">
            <AuthThumbnail contentId={contentMetadata?.uuid} idx={index} sx={{width:28, height:36}}/>
            <Link color="secondary" variant="subtitle1" sx={{verticalAlign: 'middle'}}>
              <Typography noWrap={true} sx={{verticalAlign: 'middle'}}>{contentMetadata?.filename}</Typography>
            </Link>
          </div>
        )}
      </Box>

      { isUploading && <CircularProgress size={"small"} sx={{position: 'absolute', bottom: 88, right: 48}}/> }
      { !isUploading &&
        <IconButton
          component="label"
          sx={{position: 'absolute', bottom: 88, right: 48}}
          aria-label="upload"
          color="primary"
        >
          <input onChange={handleUpload} hidden accept="*/*" type="file" />
          <Upload/>
        </IconButton>
      }
    </fieldset>
  )
}

export default ContentResourcesList;
