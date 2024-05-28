import { useWelcomeDialog } from '@/zustand/welcome';
import { Dialog, DialogTitle, DialogContent, useTheme, DialogContentText, DialogActions, Button, Zoom, useMediaQuery } from '@mui/material';
import React, { FC, useEffect } from 'react';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Zoom ref={ref} {...props} />;
});

interface WelcomeDialogProps {
  open?: boolean,
}

const WelcomeDialog: FC<WelcomeDialogProps> = ({ open: defaultOpen }: { open?: boolean }) => {
  const open = useWelcomeDialog(state => state.open);
  const setOpen = useWelcomeDialog(state => state.setOpen);
  const handleClose = () => setOpen(false);
  const theme = useTheme();
  const isFullScreen = useMediaQuery(theme.breakpoints.down('md'));
  useEffect(() => {
    if (typeof defaultOpen === "boolean") setOpen(defaultOpen);
  }, [defaultOpen, setOpen])
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={isFullScreen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        TransitionComponent={Transition}>
        <DialogTitle id="alert-dialog-title">
          Welcome to DanceIQ
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Select from various pre-computed dances and start training
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default WelcomeDialog;
