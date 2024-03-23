import { Paper } from '@mui/material';
import React, { FC } from 'react';


interface VideoPreviewProps {}

const VideoPreview: FC<VideoPreviewProps> = () => (
  <Paper className='aspect-[9/16] bg-red -z-50 rounded'>
  </Paper>
);

export default VideoPreview;
