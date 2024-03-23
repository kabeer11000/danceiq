import { ArrowBack, Info } from '@mui/icons-material';
import { Alert, IconButton, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import React, { FC, useEffect, useRef } from 'react';


interface ViewerProps { }

const Viewer: FC<ViewerProps> = () => {
  const canvasRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');

    // Sample keypoints data for a human pose
    const sampleKeypoints = [
      // Upper body
      { x: 200, y: 100, score: 0.9 }, // Nose
      { x: 180, y: 140, score: 0.8 }, // Left eye
      { x: 220, y: 140, score: 0.8 }, // Right eye
      { x: 190, y: 180, score: 0.7 }, // Left ear
      { x: 230, y: 180, score: 0.7 }, // Right ear
      { x: 200, y: 180, score: 0.95 }, // Throat
      // Left arm
      { x: 150, y: 200, score: 0.85 }, // Left shoulder
      { x: 130, y: 240, score: 0.8 }, // Left elbow
      { x: 100, y: 280, score: 0.75 }, // Left wrist
      { x: 90, y: 300, score: 0.7 }, // Left hand
      // Right arm
      { x: 250, y: 200, score: 0.85 }, // Right shoulder
      { x: 270, y: 240, score: 0.8 }, // Right elbow
      { x: 300, y: 280, score: 0.75 }, // Right wrist
      { x: 310, y: 300, score: 0.7 }, // Right hand
      // Body
      { x: 200, y: 220, score: 0.9 }, // Mid hip
      // Left leg
      { x: 180, y: 280, score: 0.8 }, // Left knee
      { x: 160, y: 340, score: 0.75 }, // Left ankle
      { x: 160, y: 380, score: 0.7 }, // Left foot
      // Right leg
      { x: 220, y: 280, score: 0.8 }, // Right knee
      { x: 240, y: 340, score: 0.75 }, // Right ankle
      { x: 240, y: 380, score: 0.7 }, // Right foot
    ];

    // Draw keypoints and lines on canvas to represent the body
    ctx.strokeStyle = theme.palette.violet.main; //'#00FF00';
    ctx.lineWidth = 2;
    // Head
    ctx.beginPath();
    ctx.moveTo(sampleKeypoints[0].x, sampleKeypoints[0].y);
    ctx.lineTo(sampleKeypoints[1].x, sampleKeypoints[1].y);
    ctx.lineTo(sampleKeypoints[2].x, sampleKeypoints[2].y);
    ctx.lineTo(sampleKeypoints[3].x, sampleKeypoints[3].y);
    ctx.lineTo(sampleKeypoints[4].x, sampleKeypoints[4].y);
    ctx.lineTo(sampleKeypoints[0].x, sampleKeypoints[0].y);
    ctx.stroke();
    ctx.closePath();
    // Torso
    ctx.beginPath();
    ctx.moveTo(sampleKeypoints[5].x, sampleKeypoints[5].y);
    ctx.lineTo(sampleKeypoints[11].x, sampleKeypoints[11].y);
    ctx.stroke();
    ctx.closePath();
    // Left arm
    ctx.beginPath();
    ctx.moveTo(sampleKeypoints[5].x, sampleKeypoints[5].y);
    ctx.lineTo(sampleKeypoints[6].x, sampleKeypoints[6].y);
    ctx.lineTo(sampleKeypoints[7].x, sampleKeypoints[7].y);
    ctx.lineTo(sampleKeypoints[8].x, sampleKeypoints[8].y);
    ctx.stroke();
    ctx.closePath();
    // Right arm
    ctx.beginPath();
    ctx.moveTo(sampleKeypoints[5].x, sampleKeypoints[5].y);
    ctx.lineTo(sampleKeypoints[9].x, sampleKeypoints[9].y);
    ctx.lineTo(sampleKeypoints[10].x, sampleKeypoints[10].y);
    ctx.lineTo(sampleKeypoints[11].x, sampleKeypoints[11].y);
    ctx.stroke();
    ctx.closePath();
    // Left leg
    ctx.beginPath();
    ctx.moveTo(sampleKeypoints[11].x, sampleKeypoints[11].y);
    ctx.lineTo(sampleKeypoints[12].x, sampleKeypoints[12].y);
    ctx.lineTo(sampleKeypoints[13].x, sampleKeypoints[13].y);
    ctx.stroke();
    ctx.closePath();
    // Right leg
    ctx.beginPath();
    ctx.moveTo(sampleKeypoints[11].x, sampleKeypoints[11].y);
    ctx.lineTo(sampleKeypoints[14].x, sampleKeypoints[14].y);
    ctx.lineTo(sampleKeypoints[15].x, sampleKeypoints[15].y);
    ctx.stroke();
    ctx.closePath();
  }, []);
  return (
    <Tooltip title='Pose Viewer'>
      <div className='relative aspect-[9/16] w-full'>
        <div className='absolute t-5 flex align-center gap-2 justify-between l-0 justify-center p-4 w-full'>
          <div className={'flex align-center mx-auto ' + (isMobile ? '' : 'hidden')}>
            <IconButton>
              <ArrowBack />
            </IconButton>
          </div>
          <Alert className='flex-1' variant="outlined" icon={<Info fontSize="inherit" />} severity="success">
            Websocket connection is established.
          </Alert>
        </div>
        <canvas ref={canvasRef} className='w-full h-full' />
      </div>
    </Tooltip>
  );
}

export default Viewer;
