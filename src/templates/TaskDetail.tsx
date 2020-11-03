import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { getTasks } from "../re-ducks/users/selectors";
import { State } from "../re-ducks/store/types";
import { SecondaryButton } from "../components/UIkit";
import { SmallTask, Task, TaskForm } from "../components/Tasks";
import { divideTask } from "../re-ducks/users/operations";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

const useStyles = makeStyles({
  icon: {
    display: "block",
    width: 50,
    height: 50,
    margin: "15px auto",
  },
});

type Inputs = {
  contents: string;
};

const TaskDetail: React.FC = () => {
  const classes = useStyles();

  const { register, handleSubmit, reset, errors } = useForm<Inputs>({
    defaultValues: {
      contents: "",
    },
  });

  const dispatch = useDispatch();
  const selector = useSelector((state: State) => state);
  const tasks = getTasks(selector);
  const taskId = window.location.pathname.split("/")[3];
  const task = tasks.find((ele) => ele.id === taskId)!;
  const smallTasks = task?.small_tasks.filter((ele) => ele.parentId === null);
  const smallTasksExcludeNull = task?.small_tasks.filter(
    (ele) => ele.parentId !== null
  );

  const [contents, setContents] = useState("");
  const [deadline, setDeadline] = useState<Date | null>(null);

  const dispatchDivideTask = () => {
    dispatch(divideTask(contents, taskId, null, deadline));
    reset();
    setDeadline(null);
  };

  return (
    <div className="c-mw700">
      {task && (
        <>
          <h2>タスクの分割</h2>
          <TaskForm
            task={task}
            deadline={deadline}
            setContents={setContents}
            setDeadline={setDeadline}
            contentsErrors={errors.contents}
            contentsValidation={register({
              required: "入力必須です。",
              maxLength: {
                value: 50,
                message: "50文字以内で入力してください。",
              },
            })}
          />
          <div className="space-m"></div>
          <SecondaryButton
            text="分割"
            disabled={contents ? false : true}
            onClick={handleSubmit(() => dispatchDivideTask())}
          />
          <div className="space-l"></div>
          {smallTasks.length === 1 && (
            <SmallTask
              tinyTaskLength={
                smallTasksExcludeNull.filter(
                  (ele) => ele.parentId === smallTasks[0].id
                ).length
              }
              smallTask={smallTasks[0]}
              taskId={task.id}
            />
          )}
          {smallTasks.length === 2 && (
            <>
              <SmallTask
                tinyTaskLength={
                  smallTasksExcludeNull.filter(
                    (ele) => ele.parentId === smallTasks[0].id
                  ).length
                }
                smallTask={smallTasks[0]}
                taskId={task.id}
              />
              <AddIcon className={classes.icon} color="primary" />
              <SmallTask
                tinyTaskLength={
                  smallTasksExcludeNull.filter(
                    (ele) => ele.parentId === smallTasks[1].id
                  ).length
                }
                smallTask={smallTasks[1]}
                taskId={task.id}
              />
            </>
          )}
          {smallTasks.length > 2 && (
            <>
              {smallTasks.slice(0, -1).map((smallTask, index) => (
                <React.Fragment key={index}>
                  <SmallTask
                    tinyTaskLength={
                      smallTasksExcludeNull.filter(
                        (ele) => ele.parentId === smallTask.id
                      ).length
                    }
                    smallTask={smallTask}
                    taskId={task.id}
                  />
                  <AddIcon className={classes.icon} color="primary" />
                </React.Fragment>
              ))}
              <SmallTask
                tinyTaskLength={
                  smallTasksExcludeNull.filter(
                    (ele) => ele.parentId === smallTasks.slice(-1)[0].id
                  ).length
                }
                smallTask={smallTasks.slice(-1)[0]}
                taskId={task.id}
              />
            </>
          )}
          {smallTasks.length > 0 && (
            <ArrowDownwardIcon className={classes.icon} color="primary" />
          )}
          <div className="space-l"></div>
          <Task smallTaskLength={smallTasks.length} task={task} />
        </>
      )}
    </div>
  );
};

export default TaskDetail;
