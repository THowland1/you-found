import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Theme,
  Typography,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { FC } from 'react';
import { AuthPopupForm } from './AuthPopupForm';

export const AuthPopup: FC<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ open, setOpen }) => {
  const [isNewUser, setIsNewUser] = React.useState(false);

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>
        <Grid container>
          <Grid item>
            <Typography display="inline" variant="h4">
              {isNewUser ? 'Create your account' : 'Log in'}
            </Typography>
          </Grid>
          <Box sx={{ flexGrow: 1 }} />
          <Grid item>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <AuthPopupForm
          isNewUserState={[isNewUser, setIsNewUser]}
          onAuthSuccess={_ => {
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
