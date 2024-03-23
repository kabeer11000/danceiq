import * as React from 'react';
import { Alert, Box, Button, ButtonBase, Chip, Container, Divider, Grid, IconButton, ListItemText, Paper, styled, Tooltip, Typography, } from '@mui/material';
import Head from 'next/head';
import Viewer from '@/components/viewer/viewer';
import { Bookmark, Info, OpenInNew, VideoLibrary } from '@mui/icons-material';
import VideoPreview from '@/components/video-preview/video-preview';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
export default function Home() {
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
              <div className='absolute flex sm:hidden bottom-1 flex align-center gap-0 justify-between right-1 z-[1000] justify-center p-4 w-full'>
                <div style={{ flexGrow: '1 1 auto' }} />
                <div className='w-full max-w-[7rem]'><><VideoPreview /></></div>
              </div>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Container disableGutters className='grid grid-gap-4 gap-y-4 mb-4 md:pt-0 md:m-0 px-4 pt-2'>
              <ListItemText className='mb-2' primary={<>Dance IQ — <strong>Paused</strong></>} secondary="Match initial pose to begin" />
              <div className='flex gap-2 overflow-scroll'>
                <Chip label="BlazePose" variant="filled" />
                <Chip label="localhost:3000" variant="outlined" />
                <Chip disabled label="Client v1.0.2" variant="outlined" />
              </div>
              <div className='flex justify-between'>
                <Tooltip title={'View Dance Libarary'} >
                  <IconButton>
                    <VideoLibrary />
                  </IconButton>
                </Tooltip>
                <Button variant='text' className='gap-2'>
                  View Reference Video{' '}<OpenInNew />
                </Button>
              </div>
              {/* <Divider variant='middle' textAlign='right'/> */}
            </Container>
          </Grid>
        </Grid>
        <div className='absolute bottom-0 hidden md:lg:flex align-center gap-0 justify-between right-0 justify-center p-0 w-full'>
          <div style={{ flexGrow: '1 1 auto' }} />
          <div className='w-full max-w-[10rem]'><VideoPreview /></div>
        </div>
      </Container>
    </>
  )
}
