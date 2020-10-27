import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { getTasks } from "../re-ducks/users/selectors";
import { State } from "../re-ducks/store/types";
import { SecondaryButton, TextInput } from "../components/UIkit";
import { SmallTask } from "../components/Tasks";
import { divideTask } from "../re-ducks/users/operations";
import { makeStyles } from "@material-ui/core/styles";
import DateFnsUtils from "@date-io/date-fns";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
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
  const taskIndex = tasks.findIndex((element) => element.id === taskId);
  const task = tasks[taskIndex];
  const smallTask = task?.small_tasks.find(
    (element) => element.id === smallTaskId
  );
  const tinyTasks = task?.small_tasks.filter(
    (element) => element.parentId === smallTask?.id
  );
  const smallTasksExcludeNull = task?.small_tasks.filter(
    (element) => element.parentId !== null
  );

  const [contents, setContents] = useState("");
  const [deadline, setDeadline] = useState(null);

  const inputContents = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setContents(event.target.value);
    },
    [setContents]
  );

  const inputDeadline = useCallback(
    (date: any) => {
      setDeadline(date);
    },
    [setDeadline]
  );

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
          <TextInput
            fullWidth={true}
            label="内容"
            multiline={true}
            required={true}
            rows="5"
            type="text"
            name="contents"
            inputRef={register({
              required: "入力必須です。",
              maxLength: {
                value: 50,
                message: "50文字以内で入力してください。",
              },
            })}
            error={Boolean(errors.contents)}
            helperText={errors.contents && errors.contents.message}
            onChange={inputContents}
          />
          <div className="space-m"></div>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DateTimePicker
              clearable
              autoOk
              ampm={false}
              disablePast
              value={deadline}
              onChange={inputDeadline}
              format="yyyy/MM/dd HH:mm"
              label="タスクの期限"
            />
          </MuiPickersUtilsProvider>
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
                  (element) => element.parentId === tinyTasks[0].id
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
                    (element) => element.parentId === tinyTasks[0].id
                  ).length
                }
                smallTask={tinyTasks[0]}
                taskId={task.id}
              />
              <AddIcon className={classes.icon} color="primary" />
              <SmallTask
                tinyTaskLength={
                  smallTasksExcludeNull.filter(
                    (element) => element.parentId === tinyTasks[1].id
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
                        (element) => element.parentId === tinyTask.id
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
                    (element) => element.parentId === tinyTasks.slice(-1)[0].id
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
          />
        </>
      )}
    </div>
  );
};

export default SmallTaskDetail;
