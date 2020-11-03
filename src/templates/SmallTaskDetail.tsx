import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { getTasks } from "../re-ducks/users/selectors";
import { State } from "../re-ducks/store/types";
import { SecondaryButton } from "../components/UIkit";
import { SmallTask, TaskForm } from "../components/Tasks";
import { divideTask } from "../re-ducks/users/operations";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

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

const SmallTaskDetail: React.FC = () => {
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
  const smallTaskId = window.location.pathname.split("/")[4];
  const task = tasks.find((ele) => ele.id === taskId)!;
  const smallTask = task?.small_tasks.find((ele) => ele.id === smallTaskId);
  const tinyTasks = task?.small_tasks.filter(
    (ele) => ele.parentId === smallTask?.id
  );
  const smallTasksExcludeNull = task?.small_tasks.filter(
    (ele) => ele.parentId !== null
  );

  const [contents, setContents] = useState("");
  const [deadline, setDeadline] = useState<Date | null>(null);

  const dispatchTaskDivision = () => {
    dispatch(divideTask(contents, taskId, smallTaskId, deadline));
    reset();
    setDeadline(null);
  };

  return (
    <div className="c-mw700">
      {smallTask && (
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
            onClick={handleSubmit(() => dispatchTaskDivision())}
          />
          <div className="space-l"></div>
          {tinyTasks.length === 1 && (
            <SmallTask
              tinyTaskLength={
                smallTasksExcludeNull.filter(
                  (ele) => ele.parentId === tinyTasks[0].id
                ).length
              }
              smallTask={tinyTasks[0]}
              taskId={task.id}
            />
          )}
          {tinyTasks.length === 2 && (
            <>
              <SmallTask
                tinyTaskLength={
                  smallTasksExcludeNull.filter(
                    (ele) => ele.parentId === tinyTasks[0].id
                  ).length
                }
                smallTask={tinyTasks[0]}
                taskId={task.id}
              />
              <AddIcon className={classes.icon} color="primary" />
              <SmallTask
                tinyTaskLength={
                  smallTasksExcludeNull.filter(
                    (ele) => ele.parentId === tinyTasks[1].id
                  ).length
                }
                smallTask={tinyTasks[1]}
                taskId={task.id}
              />
            </>
          )}
          {tinyTasks.length > 2 && (
            <>
              {tinyTasks.slice(0, -1).map((tinyTask, index) => (
                <React.Fragment key={index}>
                  <SmallTask
                    tinyTaskLength={
                      smallTasksExcludeNull.filter(
                        (ele) => ele.parentId === tinyTask.id
                      ).length
                    }
                    smallTask={tinyTask}
                    taskId={task.id}
                  />
                  <AddIcon className={classes.icon} color="primary" />
                </React.Fragment>
              ))}
              <SmallTask
                tinyTaskLength={
                  smallTasksExcludeNull.filter(
                    (ele) => ele.parentId === tinyTasks.slice(-1)[0].id
                  ).length
                }
                smallTask={tinyTasks.slice(-1)[0]}
                taskId={task.id}
              />
            </>
          )}
          {tinyTasks.length > 0 && (
            <ArrowDownwardIcon className={classes.icon} color="primary" />
          )}
          <div className="space-l"></div>
          <SmallTask
            tinyTaskLength={tinyTasks.length}
            smallTask={smallTask}
            taskId={task.id}
            backIcon={<ArrowBackIcon />}
          />
        </>
      )}
    </div>
  );
};

export default SmallTaskDetail;
