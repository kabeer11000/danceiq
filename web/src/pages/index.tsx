import * as React from 'react';
import { Alert, Box, Button, ButtonBase, Chip, Container, Divider, Grid, IconButton, ListItemText, Paper, Skeleton, styled, Tooltip, Typography, } from '@mui/material';
import Head from 'next/head';
import Viewer from '@/components/viewer/viewer';
import { Bookmark, Info, OpenInNew, VideoLibrary } from '@mui/icons-material';
import { useSocketConnectionState } from '@/zustand/socket';
import { useMediaFeedState } from '@/zustand/media-feed';
import { getWebcamFeed } from '@/utils/get-media';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
const HUD = () => {
  const [client, address, model, connected] = useSocketConnectionState(state => [state.client, state.address, state.model, state.connected]);
  const isLoading = !client || !address || !model || !connected;

  return (
    <Container disableGutters className='grid grid-gap-4 gap-y-4 mb-4 md:pt-0 md:m-0 px-4 pt-0'>
      {isLoading ? (
        <>
          <Skeleton variant="text" width={210} height={40} />
          <div className='flex gap-2 overflow-scroll'>
            <Skeleton variant="rectangular" width={80} height={32} />
            <Skeleton variant="rectangular" width={120} height={32} />
            <Skeleton variant="rectangular" width={90} height={32} />
          </div>
          <div className='flex justify-between'>
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="rectangular" width={180} height={36} />
          </div>
        </>
      ) : (
        <>
          <ListItemText className='mb-2' primary={<>Dance IQ — <strong>Paused</strong></>} secondary="Match initial pose to begin" />
          <div className='flex gap-2 overflow-scroll no-scrollbar snap-x'>
            <Chip label={model.name} variant="filled" className="snap-start"/>
            <Chip label={(new URL(address)).host} variant="outlined" className="snap-start" />
            <Chip disabled label={client.version} variant="outlined" className="snap-start" />
          </div>
          <div className='flex justify-between'>
            <Tooltip title={'View Dance Library'}>
              <IconButton>
                <VideoLibrary />
              </IconButton>
            </Tooltip>
            <Button variant='text' className='gap-2'>
              View Reference Video{' '}<OpenInNew />
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}
export default function Home() {
  const [setLive, setRawStream] = useMediaFeedState(state => [state.setLive, state.setRawStream]);
  React.useEffect(() => {
    getWebcamFeed().then((stream: MediaStream) => {
      setLive(true);
      setRawStream(stream);
    })
  }, []);
  return (
    <>
      <Head>
        <title>DanceIQ: The AI dance trainer app</title>
      </Head>
      <Container className='my-auto md:mt-[5rem] relative' disableGutters maxWidth="md">
        <Grid container columnSpacing={4} spacing={4}>
          <Grid item xs={12} md={6}>
            <Box className={'bg-gray-100 relative md:rounded-md w-full min-h-[60vh]'}>
              <Viewer />
              {/* <div className='absolute flex sm:hidden bottom-1 flex align-center gap-0 justify-between right-1 z-[1000] justify-center p-4 w-full'>
                <div style={{ flexGrow: '1 1 auto' }} />
                <div className='w-full max-w-[7rem]'><><VideoPreview /></></div>
              </div> */}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <HUD />
          </Grid>
        </Grid>
        {/* <div className='absolute bottom-0 hidden md:lg:flex align-center gap-0 justify-between right-0 justify-center p-0 w-full'>
          <div style={{ flexGrow: '1 1 auto' }} />
          <div className='w-full max-w-[10rem]'><VideoPreview /></div>
        </div> */}
      </Container>
    </>
  )
}
