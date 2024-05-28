import { useSocketConnectionState } from '@/zustand/socket';
import { ArrowBack, Info } from '@mui/icons-material';
import { Alert, IconButton, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import React, { FC, useEffect, useRef } from 'react';
import VideoPreview from '../video-preview/video-preview';

const downscaleWidth = 192; // Width to downscale the image to
const downscaleHeight = 192; // Height to downscale the image to

interface ViewerProps { }

function blobToBase64(blob: Blob) {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader?.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
  });
}

const Viewer: FC<ViewerProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const compressionCanvasRef = useRef<HTMLCanvasElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const connected = useSocketConnectionState(state => state.connected);
  const rawSocket = useSocketConnectionState(state => state.rawSocket);

  useEffect(() => {
    if (!connected || !rawSocket) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !context) return;

    const drawSkeleton = (skeleton) => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = theme.palette.violet.main;
      context.lineWidth = 2;

      skeleton.forEach((keypoint, index) => {
        const { x, y, score } = keypoint;
        // Only draw keypoints with a score higher than a threshold
        if (score > 0.2) {
          context.beginPath();
          context.arc(x * canvas.width, y * canvas.height, 5, 0, 2 * Math.PI);
          context.fill();
          context.closePath();
        }
      });

      // Draw lines connecting keypoints (example for a simple model, adjust as needed)
      const connectKeypoints = (a, b) => {
        if (skeleton[a].score > 0.2 && skeleton[b].score > 0.2) {
          context.beginPath();
          context.moveTo(skeleton[a].x * canvas.width, skeleton[a].y * canvas.height);
          context.lineTo(skeleton[b].x * canvas.width, skeleton[b].y * canvas.height);
          context.stroke();
          context.closePath();
        }
      };

      // Example connections for body parts (adjust according to the actual model keypoints)
      connectKeypoints(0, 1); // Nose to left eye
      connectKeypoints(0, 2); // Nose to right eye
      connectKeypoints(1, 3); // Left eye to left ear
      connectKeypoints(2, 4); // Right eye to right ear
      connectKeypoints(0, 5); // Nose to throat
      connectKeypoints(5, 6); // Throat to left shoulder
      connectKeypoints(6, 7); // Left shoulder to left elbow
      connectKeypoints(7, 8); // Left elbow to left wrist
      connectKeypoints(5, 9); // Throat to right shoulder
      connectKeypoints(9, 10); // Right shoulder to right elbow
      connectKeypoints(10, 11); // Right elbow to right wrist
      connectKeypoints(5, 12); // Throat to mid hip
      connectKeypoints(12, 13); // Mid hip to left knee
      connectKeypoints(13, 14); // Left knee to left ankle
      connectKeypoints(12, 15); // Mid hip to right knee
      connectKeypoints(15, 16); // Right knee to right ankle
    };

    rawSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.__type === 'async-frame-data-response') {
        drawSkeleton(message.skeleton);
      }
    };

    return () => {
      if (rawSocket) {
        rawSocket.onmessage = null;
      }
    };
  }, [connected, rawSocket, theme.palette.violet.main]);

  useEffect(() => {
    if (!connected || !rawSocket || !compressionCanvasRef.current) return;
    const canvas = compressionCanvasRef.current;
    const context = compressionCanvasRef.current.getContext('2d');
    canvas.width = downscaleWidth;
    canvas.height = downscaleHeight;

    const captureFrame = () => {
      if (!context) return;
      context.drawImage(video.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(async (blob) => {
        if (blob && rawSocket.readyState === WebSocket.OPEN) {
          rawSocket.send(JSON.stringify({ __type: "async-frame-data", data: [...new Uint8Array(await (blob.arrayBuffer()))] }));
        }
      }, 'image/png', 0.5); // Send as JPEG with 50% quality
      context?.reset();
    };

    // Capture frames at regular intervals
    window.captureFrame = captureFrame;
    // setInterval(captureFrame, 2000);
  }, [rawSocket, connected, compressionCanvasRef, video]);

  return (
    <Tooltip title='Pose Viewer'>
      <div className={'relative aspect-[9/16] w-full ' + (isMobile ? 'border-b-[1px] border-neutral-200' : 'rounded-lg outline outline-neutral-200')}>
        <div style={{ width: '100%', height: '8rem', position: "fixed", top: 0, left: 0, zIndex: 0, background: 'linear-gradient(white, rgba(255, 255, 255, 0)' }}></div>
        <div className='absolute t-5 flex align-center gap-2 justify-between l-0 justify-center p-4 w-full'>
          <div className={'flex align-center mx-auto ' + (isMobile ? '' : 'hidden')}>
            <IconButton>
              <ArrowBack />
            </IconButton>
          </div>
          {connected ? <Alert className='flex-1' variant="outlined" icon={<Info fontSize="inherit" />} severity="success">
            Websocket connection is established.
          </Alert> : <div className="flex-1"></div>}
        </div>
        <canvas ref={compressionCanvasRef} id="compression-canvas" className='w-0 h-0' />
        <canvas ref={canvasRef} className='absolute w-full h-full' />
        <VideoPreview video={video} noElevation />
      </div>
    </Tooltip>
  );
}

export default Viewer;
