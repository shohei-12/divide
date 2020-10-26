import React, { useState, useCallback } from "react";
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
  })
);

type Props = {
  smallTaskLength: number;
  task: TaskState;
  taskId: string;
  contents: string;
  deadline: string | null;
  checked: boolean;
  datetime: string;
};

const Task: React.FC<Props> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const formatDatetime = (datetime: Date) => {
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
  };

  return (
    <>
      <Card>
        <CardContent className={classes.content}>
          <div className={classes.flex}>
            <Typography className={classes.datetime} color="textSecondary">
              {formatDatetime(new Date(props.datetime))}
            </Typography>
            <div className={classes.flex + " " + classes.alignRight}>
              {props.deadline && <Deadline deadline={props.deadline} />}
              <Tooltip title="タスクの完了">
                <Checkbox
                  checked={props.checked}
                  color="primary"
                  inputProps={{ "aria-label": "タスクの完了" }}
                  onClick={() => {
                    dispatch(
                      toggleTaskCheck(!props.checked, props.taskId, null)
                    );
                  }}
                />
              </Tooltip>
            </div>
          </div>
          <Typography className={classes.contents} variant="h5" component="h3">
            {props.contents}
          </Typography>
          <Tooltip title="分割">
            <IconButton
              onClick={() => dispatch(push(`/task/detail/${props.taskId}`))}
            >
              <Badge badgeContent={props.smallTaskLength} color="primary">
                <ViewModuleIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="編集">
            <IconButton
              onClick={() => {
                handleOpen();
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="削除">
            <IconButton
              onClick={() => {
                if (window.confirm("タスクを削除しますか？")) {
                  dispatch(deleteTask(props.taskId, null));
                }
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <PriorityButton taskId={props.taskId} />
        </CardContent>
      </Card>
      <Modal open={open} onClose={handleClose}>
        <TaskEdit task={props.task} handleClose={handleClose} />
      </Modal>
    </>
  );
};

export default Task;
