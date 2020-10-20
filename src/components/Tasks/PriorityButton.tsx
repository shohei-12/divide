import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../re-ducks/store/types";
import { getTasks } from "../../re-ducks/users/selectors";
import { setPriority } from "../../re-ducks/users/operations";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

const useStyles = makeStyles({
  red: {
    color: "#ff1744",
  },
  yellow: {
    color: "#ffea00",
  },
  green: {
    color: "#00e676",
  },
});

type Props = {
  taskId: string;
};

const PriorityButton: React.FC<Props> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selector = useSelector((state: State) => state);
  const tasks = getTasks(selector);
  const task = tasks.find((element) => element.id === props.taskId)!;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    [setAnchorEl]
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  return (
    <>
      <IconButton
        onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          event.stopPropagation();
          handleClick(event);
        }}
      >
        {(() => {
          switch (task.priority) {
            case 0:
              return <FiberManualRecordIcon />;
            case 1:
              return <FiberManualRecordIcon className={classes.red} />;
            case 2:
              return <FiberManualRecordIcon className={classes.yellow} />;
            case 3:
              return <FiberManualRecordIcon className={classes.green} />;
          }
        })()}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
          event.stopPropagation();
          handleClose();
        }}
      >
        <MenuItem
          onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
            event.stopPropagation();
            handleClose();
            dispatch(setPriority(0, props.taskId));
          }}
        >
          <FiberManualRecordIcon />
          なし
        </MenuItem>
        <MenuItem
          onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
            event.stopPropagation();
            handleClose();
            dispatch(setPriority(1, props.taskId));
          }}
        >
          <FiberManualRecordIcon className={classes.red} />高
        </MenuItem>
        <MenuItem
          onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
            event.stopPropagation();
            handleClose();
            dispatch(setPriority(2, props.taskId));
          }}
        >
          <FiberManualRecordIcon className={classes.yellow} />中
        </MenuItem>
        <MenuItem
          onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
            event.stopPropagation();
            handleClose();
            dispatch(setPriority(3, props.taskId));
          }}
        >
          <FiberManualRecordIcon className={classes.green} />低
        </MenuItem>
      </Menu>
    </>
  );
};

export default PriorityButton;
