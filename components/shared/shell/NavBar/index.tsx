import {
  AppBar,
  Box,
  Button,
  IconButton,
  Link,
  ListItemIcon,
  Menu,
  MenuItem,
  Theme,
  Toolbar,
  Typography
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/MeetingRoom';
import { useAuth } from 'components/shared/auth/useAuth';
import React, { FC } from 'react';
import { useAuthService } from 'utils/hooks/useAuthService';
import { v4 } from 'uuid';
import { AuthPopup } from './AuthPopup';
import { useTheme } from '@mui/system';
import { AccountCircle } from '@mui/icons-material';
import NextLink from 'next/link';

export const NavBar: FC = () => {
  const [popupOpen, setPopupOpen] = React.useState(false);
  const { user } = useAuth();
  const { logout } = useAuthService();
  const theme = useTheme<Theme>();

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="medium"
          edge="start"
          color="inherit"
          aria-label="menu"
        ></IconButton>
        <NextLink href="/" passHref>
          <Link color="inherit" underline="hover">
            <Typography variant="h4">
              <em>YouFound</em>
            </Typography>
          </Link>
        </NextLink>
        <Box sx={{ flexGrow: 1 }} />
        {user ? (
          <BasicMenu buttonText={user.displayName || 'My account'}>
            <MenuItem disabled>
              Signed in{user.displayName ? ' as ' + user.displayName : ''}
            </MenuItem>
            <NextLink href="/_/items" passHref>
              <MenuItem>Your items</MenuItem>
            </NextLink>
            <MenuItem onClick={logout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Log out
            </MenuItem>
          </BasicMenu>
        ) : (
          <>
            <AuthPopup open={popupOpen} setOpen={setPopupOpen} />
            <Button onClick={() => setPopupOpen(true)} color="inherit">
              Log in / Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

const BasicMenu: FC<{ children?: React.ReactNode; buttonText: string }> = ({
  children,
  buttonText
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [idSuffix] = React.useState(v4());
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        id={'basic-button-' + idSuffix}
        aria-controls={'basic-menu-' + idSuffix}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        startIcon={<AccountCircle />}
        sx={{ textTransform: 'inherit' }}
        color="inherit"
      >
        {buttonText}
      </Button>
      <Menu
        id={'basic-menu-' + idSuffix}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-' + idSuffix
        }}
      >
        {children}
      </Menu>
    </>
  );
};
