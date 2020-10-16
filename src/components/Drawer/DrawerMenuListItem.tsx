import React from "react";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

const useStyles = makeStyles({
  icon: {
    minWidth: 30,
  },
});

type Props = {
  text: string;
  icon: JSX.Element;
  path: string;
  handleDrawerToggle: () => void;
};

const DrawerMenuListItem: React.FC<Props> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
    <>
      {window.innerWidth >= 600 ? (
        <ListItem
          button
          onClick={() => {
            dispatch(push(props.path));
          }}
        >
          <ListItemIcon className={classes.icon}>{props.icon}</ListItemIcon>
          <ListItemText primary={props.text} />
        </ListItem>
      ) : (
        <ListItem
          button
          onClick={() => {
            dispatch(push(props.path));
            props.handleDrawerToggle();
          }}
        >
          <ListItemIcon className={classes.icon}>{props.icon}</ListItemIcon>
          <ListItemText primary={props.text} />
        </ListItem>
      )}
    </>
  );
};

export default DrawerMenuListItem;
