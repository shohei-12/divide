import React, { useState, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { Deadline, PriorityButton, TaskEdit } from ".";
import { toggleTaskCheck, deleteTask } from "../../re-ducks/users/operations";
import { TaskState } from "../../re-ducks/users/types";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import ViewModuleIcon from "@material-ui/icons/ViewModule";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";
import Badge from "@material-ui/core/Badge";
import Modal from "@material-ui/core/Modal";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      "&:last-child": {
        paddingBottom: 16,
      },
    },
    datetime: {
      fontSize: 14,
    },
    alignRight: {
      marginRight: 0,
      marginLeft: "auto",
    },
    flex: {
      display: "flex",
      alignItems: "center",
    },
    contents: {
      fontSize: 18,
      [theme.breakpoints.up("sm")]: {
        fontSize: 20,
      },
    },
    modal: {
      position: "relative",
      backgroundColor: theme.palette.background.paper,
      width: "85%",
      maxWidth: 700,
      padding: "30px 20px",
      margin: "60px auto 0",
      borderRadius: 4,
    },
  })
);

type Props = {
  smallTaskLength: number;
  task: TaskState;
};

const Task: React.FC<Props> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const task = props.task;
  const id = task.id;
  const contents = task.contents;
  const checked = task.checked;
  const deadline = task.deadline;
  const updatedAt = task.updated_at;

  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const formatDatetime = useMemo(() => {
    const datetime = new Date(updatedAt);
    return (
      datetime.getFullYear() +
      "-" +
      ("00" + (datetime.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + datetime.getDate()).slice(-2) +
      " " +
      ("00" + datetime.getHours()).slice(-2) +
      ":" +
      ("00" + datetime.getMinutes()).slice(-2)
    );
  }, [updatedAt]);

  const dispatchToggleTaskCheck = useCallback(() => {
    dispatch(toggleTaskCheck(!checked, id, null));
  }, [dispatch, checked, id]);

  const goDividePage = useCallback(() => {
    dispatch(push(`/task/detail/${id}`));
  }, [dispatch, id]);

  const dispatchDeleteTask = useCallback(() => {
    if (window.confirm("タスクを削除しますか？")) {
      dispatch(deleteTask(id, null));
    }
  }, [dispatch, id]);

  return (
    <>
      <Card>
        <CardContent className={classes.content}>
          <div className={classes.flex}>
            <Typography className={classes.datetime} color="textSecondary">
              {formatDatetime}
            </Typography>
            <div className={classes.flex + " " + classes.alignRight}>
              {deadline && <Deadline deadline={deadline} />}
              <Tooltip title="タスクの完了">
                <Checkbox
                  checked={checked}
                  color="primary"
                  inputProps={{ "aria-label": "タスクの完了" }}
                  onClick={dispatchToggleTaskCheck}
                />
              </Tooltip>
            </div>
          </div>
          <Typography className={classes.contents} variant="h5" component="h3">
            {contents}
          </Typography>
          <Tooltip title="分割">
            <IconButton onClick={goDividePage}>
              <Badge badgeContent={props.smallTaskLength} color="primary">
                <ViewModuleIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="編集">
            <IconButton onClick={handleOpen}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="削除">
            <IconButton onClick={dispatchDeleteTask}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <PriorityButton taskId={id} />
        </CardContent>
      </Card>
      <Modal open={open} onClose={handleClose}>
        <div className={classes.modal}>
          <TaskEdit task={task} handleClose={handleClose} />
        </div>
      </Modal>
    </>
  );
};

export default Task;
