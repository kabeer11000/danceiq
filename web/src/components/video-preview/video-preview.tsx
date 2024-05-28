import { useMediaFeedState } from '@/zustand/media-feed';
import { Paper, Skeleton } from '@mui/material';
import React, { FC, Ref, RefObject, useEffect, useRef } from 'react';

interface VideoPreviewProps {
  noElevation?: boolean, video: Ref<HTMLVideoElement>
}

const VideoPreview: FC<VideoPreviewProps> = ({ noElevation, video }) => {
  const [live, rawStream] = useMediaFeedState(state => [state.live, state.rawStream]);

  useEffect(() => {
    if (video.current && rawStream && live) {
      if ("srcObject" in video.current) {
        video.current.srcObject = rawStream;
        console.log('Setting srcObject on video element:', rawStream);
      } else {
        console.error("srcObject is not available in this browser");
        // Avoid using this in new browsers, as it is going away.
        // video.current.src = window.URL.createObjectURL(rawStream);
      }
    } else {
      console.log('Video element:', video.current);
      console.log('Raw stream:', rawStream);
      console.log('Live status:', live);
    }
  }, [live, rawStream, video.current]);

  return (
    <Paper elevation={noElevation ? 0 : 1} className='w-full h-full'>
      {live ? (
        <video
          ref={video}
          className='w-full h-full object-cover'
          autoPlay
          playsInline
        />
      ) : (
        <Skeleton className='w-full h-full' variant='rounded' />
      )}
    </Paper>
  );
}

export default VideoPreview;
