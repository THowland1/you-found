import { AppBar, Box, Button, IconButton, Toolbar } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import React, { FC } from 'react';
import { AuthPopup } from './AuthPopup';

export const NavBar: FC = () => {
  const [popupOpen, setPopupOpen] = React.useState(false);

  return (
    <AppBar position="static">
      <Toolbar>
        {/* <IconButton
          size="medium"
          edge="start"
          color="inherit"
          aria-label="menu"
        >
          <MenuIcon />
        </IconButton> */}
        <Box sx={{ flexGrow: 1 }} />
        <AuthPopup open={popupOpen} setOpen={setPopupOpen} />
        <Button onClick={() => setPopupOpen(true)} color="inherit">
          Log in / Register
        </Button>
      </Toolbar>
    </AppBar>
  );
};
