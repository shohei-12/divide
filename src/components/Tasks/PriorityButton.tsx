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
  smallTaskId?: string;
};

const PriorityButton: React.FC<Props> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selector = useSelector((state: State) => state);
  const tasks = getTasks(selector);
  const task = tasks.find((element) => element.id === props.taskId)!;
  const smallTask = task.small_tasks.find(
    (element) => element.id === props.smallTaskId
  );

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

  const taskSetPriority = props.smallTaskId
    ? setPriority.bind(null, props.taskId, props.smallTaskId)
    : setPriority.bind(null, props.taskId, null);

  const priority = props.smallTaskId ? smallTask!.priority : task.priority;

  return (
    <>
      <IconButton
        onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          event.stopPropagation();
          handleClick(event);
        }}
      >
        {(() => {
          switch (priority) {
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
            dispatch(taskSetPriority(0));
          }}
        >
          <FiberManualRecordIcon />
          なし
        </MenuItem>
        <MenuItem
          onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
            event.stopPropagation();
            handleClose();
            dispatch(taskSetPriority(1));
          }}
        >
          <FiberManualRecordIcon className={classes.red} />高
        </MenuItem>
        <MenuItem
          onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
            event.stopPropagation();
            handleClose();
            dispatch(taskSetPriority(2));
          }}
        >
          <FiberManualRecordIcon className={classes.yellow} />中
        </MenuItem>
        <MenuItem
          onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
            event.stopPropagation();
            handleClose();
            dispatch(taskSetPriority(3));
          }}
        >
          <FiberManualRecordIcon className={classes.green} />低
        </MenuItem>
      </Menu>
    </>
  );
};

export default PriorityButton;
