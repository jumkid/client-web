import React, { useLayoutEffect, useState } from 'react';
import { contentService } from '../service';

type Props = {
  id: string
}

function AuthImage ({id}:Props) {
  const [imgSrc, setImgSrc] = useState('');

  useLayoutEffect(() => {
    contentService.getContentSteam(id).then((response) => {
      const data = `data:${response.headers['content-type']};base64,${new Buffer(response.data).toString('base64')}`;
      setImgSrc(data);
    })
  }, []);

  return (
    <img src={imgSrc} alt="image is loading with authentication" />
  )
}

export default AuthImage;
