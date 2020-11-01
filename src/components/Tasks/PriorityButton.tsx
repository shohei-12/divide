import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../re-ducks/store/types";
import { getTasks } from "../../re-ducks/users/selectors";
import { setPriority } from "../../re-ducks/users/operations";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    red: {
      color: "#ff1744",
    },
    yellow: {
      color: "#ffea00",
    },
    green: {
      color: "#00e676",
    },
  })
);

type Props = {
  taskId: string;
  smallTaskId?: string;
};

const PriorityButton: React.FC<Props> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selector = useSelector((state: State) => state);
  const tasks = getTasks(selector);
  const taskId = props.taskId;
  const smallTaskId = props.smallTaskId;
  const task = tasks.find((ele) => ele.id === taskId)!;
  const smallTask = task.small_tasks.find((ele) => ele.id === smallTaskId);
  const priority = smallTaskId ? smallTask!.priority : task.priority;

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const setPriorityBind = smallTaskId
    ? setPriority.bind(null, taskId, smallTaskId)
    : setPriority.bind(null, taskId, null);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setAnchorEl(event.currentTarget);
    },
    [setAnchorEl]
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const dispatchSetPriorityBind0 = useCallback(() => {
    dispatch(setPriorityBind(0));
    handleClose();
  }, [dispatch, handleClose, setPriorityBind]);

  const dispatchSetPriorityBind1 = useCallback(() => {
    dispatch(setPriorityBind(1));
    handleClose();
  }, [dispatch, handleClose, setPriorityBind]);

  const dispatchSetPriorityBind2 = useCallback(() => {
    dispatch(setPriorityBind(2));
    handleClose();
  }, [dispatch, handleClose, setPriorityBind]);

  const dispatchSetPriorityBind3 = useCallback(() => {
    dispatch(setPriorityBind(3));
    handleClose();
  }, [dispatch, handleClose, setPriorityBind]);

  return (
    <>
      <Tooltip title="優先度">
        <IconButton onClick={handleClick}>
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
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={dispatchSetPriorityBind0}>
          <FiberManualRecordIcon />
          なし
        </MenuItem>
        <MenuItem onClick={dispatchSetPriorityBind1}>
          <FiberManualRecordIcon className={classes.red} />高
        </MenuItem>
        <MenuItem onClick={dispatchSetPriorityBind2}>
          <FiberManualRecordIcon className={classes.yellow} />中
        </MenuItem>
        <MenuItem onClick={dispatchSetPriorityBind3}>
          <FiberManualRecordIcon className={classes.green} />低
        </MenuItem>
      </Menu>
    </>
  );
};

export default PriorityButton;
