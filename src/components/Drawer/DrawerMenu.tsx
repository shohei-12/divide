import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { getIsSignedIn, getTheme } from "../../re-ducks/users/selectors";
import { State } from "../../re-ducks/store/types";
import { signOut, themeToggle } from "../../re-ducks/users/operations";
import { DrawerMenuListItem } from ".";
import AppBar from "@material-ui/core/AppBar";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import EditIcon from "@material-ui/icons/Edit";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import LockIcon from "@material-ui/icons/Lock";
import Brightness3Icon from "@material-ui/icons/Brightness3";
import BrightnessHighIcon from "@material-ui/icons/BrightnessHigh";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    drawer: {
      [theme.breakpoints.up("sm")]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        display: "none",
      },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
    },
    icon: {
      minWidth: 30,
    },
    close: {
      padding: 0,
      width: 48,
      height: 48,
      position: "absolute",
      left: 4,
      top: 4,
    },
    appName: {
      backgroundColor: theme.palette.primary.main,
      margin: 0,
      height: 60,
      textAlign: "center",
      lineHeight: "60px",
      color: "#092122",
      "&:hover": {
        cursor: "pointer",
      },
    },
  })
);

const DrawerMenu: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selector = useSelector((state: State) => state);
  const isSignedIn = getIsSignedIn(selector);
  const theme = getTheme(selector);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(!mobileOpen);
  }, [setMobileOpen, mobileOpen]);

  const signInList = [
    {
      text: "タスクの登録",
      icon: <AddCircleIcon />,
      path: "/task/registration",
    },
    {
      text: "プロフィールの編集",
      icon: <EditIcon />,
      path: "/user/edit",
    },
    {
      text: "パスワードのリセット",
      icon: <LockIcon />,
      path: "/password/reset",
    },
  ];

  const guestList = [
    {
      text: "ログイン",
      icon: <ExitToAppIcon />,
      path: "/signin",
    },
    {
      text: "ユーザーの登録",
      icon: <PersonAddIcon />,
      path: "/signup",
    },
    {
      text: "パスワードのリセット",
      icon: <LockIcon />,
      path: "/password/reset",
    },
  ];

  const listChild = (
    <>
      {isSignedIn ? (
        <>
          {signInList.map((item, index) => (
            <DrawerMenuListItem
              key={index}
              text={item.text}
              icon={item.icon}
              path={item.path}
              handleDrawerToggle={handleDrawerToggle}
            />
          ))}
          {window.innerWidth >= 600 ? (
            <>
              <ListItem
                button
                onClick={() => {
                  dispatch(signOut());
                }}
              >
                <ListItemIcon className={classes.icon}>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="ログアウト" />
              </ListItem>
              {theme === "light" ? (
                <ListItem
                  button
                  onClick={() => {
                    dispatch(themeToggle("dark"));
                  }}
                >
                  <ListItemIcon className={classes.icon}>
                    <Brightness3Icon />
                  </ListItemIcon>
                  <ListItemText primary="ダークモード" />
                </ListItem>
              ) : (
                <ListItem
                  button
                  onClick={() => {
                    dispatch(themeToggle("light"));
                  }}
                >
                  <ListItemIcon className={classes.icon}>
                    <BrightnessHighIcon />
                  </ListItemIcon>
                  <ListItemText primary="ライトモード" />
                </ListItem>
              )}
            </>
          ) : (
            <>
              <ListItem
                button
                onClick={() => {
                  dispatch(signOut());
                  handleDrawerToggle();
                }}
              >
                <ListItemIcon className={classes.icon}>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="ログアウト" />
              </ListItem>
              {theme === "light" ? (
                <ListItem
                  button
                  onClick={() => {
                    dispatch(themeToggle("dark"));
                    handleDrawerToggle();
                  }}
                >
                  <ListItemIcon className={classes.icon}>
                    <Brightness3Icon />
                  </ListItemIcon>
                  <ListItemText primary="ダークモード" />
                </ListItem>
              ) : (
                <ListItem
                  button
                  onClick={() => {
                    dispatch(themeToggle("light"));
                    handleDrawerToggle();
                  }}
                >
                  <ListItemIcon className={classes.icon}>
                    <BrightnessHighIcon />
                  </ListItemIcon>
                  <ListItemText primary="ライトモード" />
                </ListItem>
              )}
            </>
          )}
        </>
      ) : (
        <>
          {guestList.map((item, index) => (
            <DrawerMenuListItem
              key={index}
              text={item.text}
              icon={item.icon}
              path={item.path}
              handleDrawerToggle={handleDrawerToggle}
            />
          ))}
          {window.innerWidth >= 600 ? (
            <>
              {theme === "light" ? (
                <ListItem
                  button
                  onClick={() => {
                    dispatch(themeToggle("dark"));
                  }}
                >
                  <ListItemIcon className={classes.icon}>
                    <Brightness3Icon />
                  </ListItemIcon>
                  <ListItemText primary="ダークモード" />
                </ListItem>
              ) : (
                <ListItem
                  button
                  onClick={() => {
                    dispatch(themeToggle("light"));
                  }}
                >
                  <ListItemIcon className={classes.icon}>
                    <BrightnessHighIcon />
                  </ListItemIcon>
                  <ListItemText primary="ライトモード" />
                </ListItem>
              )}
            </>
          ) : (
            <>
              {theme === "light" ? (
                <ListItem
                  button
                  onClick={() => {
                    dispatch(themeToggle("dark"));
                    handleDrawerToggle();
                  }}
                >
                  <ListItemIcon className={classes.icon}>
                    <Brightness3Icon />
                  </ListItemIcon>
                  <ListItemText primary="ダークモード" />
                </ListItem>
              ) : (
                <ListItem
                  button
                  onClick={() => {
                    dispatch(themeToggle("light"));
                    handleDrawerToggle();
                  }}
                >
                  <ListItemIcon className={classes.icon}>
                    <BrightnessHighIcon />
                  </ListItemIcon>
                  <ListItemText primary="ライトモード" />
                </ListItem>
              )}
            </>
          )}
        </>
      )}
    </>
  );

  return (
    <div className={classes.root}>
      <Hidden smUp>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              className="pointer-h"
              variant="h6"
              onClick={() => dispatch(push("/"))}
            >
              DIVIDE
            </Typography>
          </Toolbar>
        </AppBar>
      </Hidden>
      <nav className={classes.drawer} aria-label="navigation">
        <Hidden smUp>
          <Drawer
            variant="temporary"
            anchor="left"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            <div className={classes.toolbar} />
            <IconButton
              className={classes.close}
              onClick={() => handleDrawerToggle()}
            >
              <CloseIcon />
            </IconButton>
            <List>{listChild}</List>
          </Drawer>
        </Hidden>
        <Hidden xsDown>
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            <Typography
              className={classes.appName}
              variant="h6"
              onClick={() => dispatch(push("/"))}
            >
              DIVIDE
            </Typography>
            <List>{listChild}</List>
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
};

export default DrawerMenu;
