import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { PriorityButton, SmallTaskEdit, TaskContent } from ".";
import { toggleTaskCheck, deleteTask } from "../../re-ducks/users/operations";
import { getTasks } from "../../re-ducks/users/selectors";
import { SmallTaskState } from "../../re-ducks/users/types";
import { State } from "../../re-ducks/store/types";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
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
  tinyTaskLength: number;
  smallTask: SmallTaskState;
  taskId: string;
  backIcon?: JSX.Element;
};

const SmallTask: React.FC<Props> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selector = useSelector((state: State) => state);
  const tasks = getTasks(selector);
  const taskId = props.taskId;
  const task = tasks.find((ele) => ele.id === taskId)!;
  const smallTask = props.smallTask;
  const smallTaskId = smallTask.id;
  const contents = smallTask.contents;
  const checked = smallTask.checked;
  const deadline = smallTask.deadline;
  const parentId = smallTask.parentId;
  const updatedAt = smallTask.updated_at;

  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const dispatchToggleTaskCheck = useCallback(() => {
    if (task.demo !== true) {
      dispatch(toggleTaskCheck(!checked, taskId, smallTaskId));
    } else {
      alert("デモデータはチェックの切り替えができません！");
    }
  }, [dispatch, taskId, checked, smallTaskId, task.demo]);

  const goDividePage = useCallback(() => {
    dispatch(push(`/small-task/detail/${taskId}/${smallTaskId}`));
  }, [dispatch, taskId, smallTaskId]);

  const dispatchDeleteTask = useCallback(() => {
    if (window.confirm("タスクを削除しますか？")) {
      if (task.demo !== true) {
        dispatch(deleteTask(taskId, smallTaskId));
      } else {
        alert("デモデータは削除できません！");
      }
    }
  }, [dispatch, taskId, smallTaskId, task.demo]);

  const goBack = useCallback(() => {
    if (parentId === null) {
      dispatch(push(`/task/detail/${taskId}`));
    } else {
      dispatch(push(`/small-task/detail/${taskId}/${parentId}`));
    }
  }, [dispatch, taskId, parentId]);

  return (
    <>
      <Card>
        <CardContent className={classes.content}>
          <TaskContent
            contents={contents}
            checked={checked}
            deadline={deadline}
            updatedAt={updatedAt}
            taskLength={props.tinyTaskLength}
            setOpen={setOpen}
            dispatchToggleTaskCheck={dispatchToggleTaskCheck}
            goDividePage={goDividePage}
            dispatchDeleteTask={dispatchDeleteTask}
          />
          <PriorityButton taskId={taskId} smallTaskId={smallTaskId} />
          {props.backIcon && (
            <Tooltip title="戻る">
              <IconButton onClick={goBack}>{props.backIcon}</IconButton>
            </Tooltip>
          )}
        </CardContent>
      </Card>
      <Modal
        open={open}
        onClose={handleClose}
        disableEnforceFocus
        disableAutoFocus
      >
        <div className={classes.modal}>
          <SmallTaskEdit
            smallTask={smallTask}
            taskId={taskId}
            handleClose={handleClose}
          />
        </div>
      </Modal>
    </>
  );
};

export default SmallTask;
