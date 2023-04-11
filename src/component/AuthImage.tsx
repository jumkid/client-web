import React, { useEffect, useState } from 'react';
import { contentService } from '../service';

type Props = {
  id: string
}

function AuthImage ({id}:Props) {
  const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
    try {
      contentService.getContentSteam(id).then((response) => {
        const data = `data:${response.headers['content-type']};base64,${new Buffer(response.data).toString('base64')}`;
        setImgSrc(data);
      })
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <img src={imgSrc} alt="image is loading with authentication" />
  )
}

export default AuthImage;
