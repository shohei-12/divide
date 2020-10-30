import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { PriorityButton, TaskContent, TaskEdit } from ".";
import { toggleTaskCheck, deleteTask } from "../../re-ducks/users/operations";
import { TaskState } from "../../re-ducks/users/types";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Modal from "@material-ui/core/Modal";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      "&:last-child": {
        paddingBottom: 16,
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

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

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
          <TaskContent
            contents={contents}
            checked={checked}
            deadline={deadline}
            updatedAt={updatedAt}
            taskLength={props.smallTaskLength}
            setOpen={setOpen}
            dispatchToggleTaskCheck={dispatchToggleTaskCheck}
            goDividePage={goDividePage}
            dispatchDeleteTask={dispatchDeleteTask}
          />
          <PriorityButton taskId={id} />
        </CardContent>
      </Card>
      <Modal
        open={open}
        onClose={handleClose}
        disableEnforceFocus
        disableAutoFocus
      >
        <div className={classes.modal}>
          <TaskEdit task={task} handleClose={handleClose} />
        </div>
      </Modal>
    </>
  );
};

export default Task;
