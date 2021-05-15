import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import TitleAnnouncer from '../TitleAnnouncer';
import { signOut } from '../../providers/actions/User';

import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
} from '@material-ui/core';

import {
  Home,
  Menu,
  Person,
  ExitToApp,
  EmojiPeople,
  People,
  Work,
  AddCircle,
  Settings,
  DoneAll,
} from '@material-ui/icons';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  link: {
    textDecoration: 'none',
    color: 'black',
  },
});

function Navigation({ firebase }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const { uuid, isLoading } = useSelector((state) => ({
    avatar: state.userReducer.avatar,
    name: state.userReducer.name,
    email: state.userReducer.email,
    phone: state.userReducer.phone,
    units: state.userReducer.units,
    unitsArr: state.userReducer.unitsArr,
    uuid: state.userReducer.uuid,
    roles: state.userReducer.roles,
    isLoading: state.userReducer.isLoading,
  }));

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const menuIcons = (index) => {
    if (index === 0) return <Home />;
    else if (index === 1) return <Person />;
  };

  const drawerItems = (text, index) => {
    if (index === 0) {
      return (
        <Link to={ROUTES.HOME} className={classes.link}>
          <ListItem button key={text}>
            <ListItemIcon>{menuIcons(index)}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        </Link>
      );
    } else if (index === 1) {
      return (
        <Link to={ROUTES.PATIENTS} className={classes.link}>
          <ListItem button key={text}>
            <ListItemIcon>{menuIcons(index)}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        </Link>
      );
    }
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {['Home', 'Patients'].map((text, index) => drawerItems(text, index))}
      </List>
      <Divider />
      <List>
        {['Sign Out'].map((text, index) => (
          <ListItem button onClick={() => dispatch(signOut())} key={text}>
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  const anchor = 'left';

  return (
    <div>
      <React.Fragment key={anchor}>
        {uuid !== null && uuid !== undefined && uuid !== '' ? (
          <>
            <AppBar position="static">
              <Toolbar>
                <IconButton
                  edge="start"
                  className={classes.menuButton}
                  color="inherit"
                  aria-label="menu"
                  onClick={toggleDrawer(anchor, true)}
                >
                  <Menu />
                </IconButton>
                <TitleAnnouncer />
              </Toolbar>
            </AppBar>

            <Drawer
              anchor={anchor}
              open={state[anchor]}
              onClose={toggleDrawer(anchor, false)}
            >
              {list(anchor)}
            </Drawer>
          </>
        ) : (
          <></>
        )}
      </React.Fragment>
    </div>
  );
}

export default Navigation;
