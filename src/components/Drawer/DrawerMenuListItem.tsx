import React, { useCallback } from "react";
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

  const goPath = useCallback(() => {
    dispatch(push(props.path));
    if (window.innerWidth < 600) {
      props.handleDrawerToggle();
    }
  }, [dispatch, props]);

  return (
    <ListItem button onClick={goPath}>
      <ListItemIcon className={classes.icon}>{props.icon}</ListItemIcon>
      <ListItemText primary={props.text} />
    </ListItem>
  );
};

export default DrawerMenuListItem;
