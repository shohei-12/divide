import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { getTasks } from "../re-ducks/users/selectors";
import { State } from "../re-ducks/store/types";
import { SecondaryButton, TextInput } from "../components/UIkit";
import { SmallTask } from "../components/Tasks";
import { smallTaskDivision } from "../re-ducks/users/operations";
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
  const smallTaskIndex = task?.small_tasks.findIndex(
    (element) => element.id === smallTaskId
  );
  const smallTask = task?.small_tasks[smallTaskIndex];
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
    dispatch(
      smallTaskDivision(contents, taskId, smallTaskId, taskIndex, deadline)
    );
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
            label="タスクを分割する"
            multiline={true}
            required={true}
            rows="5"
            type="text"
            name="contents"
            inputRef={register({
              required: "入力必須です。",
              maxLength: {
                value: 100,
                message: "100文字以内で入力してください。",
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
              tinyTasks={smallTasksExcludeNull.filter(
                (element) => element.parentId === tinyTasks[0].id
              )}
              taskId={task.id}
              smallTaskId={tinyTasks[0].id}
              contents={tinyTasks[0].contents}
              deadline={tinyTasks[0].deadline}
              checked={tinyTasks[0].checked}
              datetime={tinyTasks[0].updated_at}
            />
          )}
          {tinyTasks.length === 2 && (
            <>
              <SmallTask
                tinyTasks={smallTasksExcludeNull.filter(
                  (element) => element.parentId === tinyTasks[0].id
                )}
                taskId={task.id}
                smallTaskId={tinyTasks[0].id}
                contents={tinyTasks[0].contents}
                deadline={tinyTasks[0].deadline}
                checked={tinyTasks[0].checked}
                datetime={tinyTasks[0].updated_at}
              />
              <AddIcon className={classes.icon} color="primary" />
              <SmallTask
                tinyTasks={smallTasksExcludeNull.filter(
                  (element) => element.parentId === tinyTasks[1].id
                )}
                taskId={task.id}
                smallTaskId={tinyTasks[1].id}
                contents={tinyTasks[1].contents}
                deadline={tinyTasks[1].deadline}
                checked={tinyTasks[1].checked}
                datetime={tinyTasks[1].updated_at}
              />
            </>
          )}
          {tinyTasks.length > 2 && (
            <>
              {tinyTasks.slice(0, -1).map((tinyTask, index) => (
                <React.Fragment key={index}>
                  <SmallTask
                    tinyTasks={smallTasksExcludeNull.filter(
                      (element) => element.parentId === tinyTask.id
                    )}
                    taskId={task.id}
                    smallTaskId={tinyTask.id}
                    contents={tinyTask.contents}
                    deadline={tinyTask.deadline}
                    checked={tinyTask.checked}
                    datetime={tinyTask.updated_at}
                  />
                  <AddIcon className={classes.icon} color="primary" />
                </React.Fragment>
              ))}
              <SmallTask
                tinyTasks={smallTasksExcludeNull.filter(
                  (element) => element.parentId === tinyTasks.slice(-1)[0].id
                )}
                taskId={task.id}
                smallTaskId={tinyTasks.slice(-1)[0].id}
                contents={tinyTasks.slice(-1)[0].contents}
                deadline={tinyTasks.slice(-1)[0].deadline}
                checked={tinyTasks.slice(-1)[0].checked}
                datetime={tinyTasks.slice(-1)[0].updated_at}
              />
            </>
          )}
          {tinyTasks.length > 0 && (
            <ArrowDownwardIcon className={classes.icon} color="primary" />
          )}
          <div className="space-l"></div>
          <SmallTask
            tinyTasks={tinyTasks}
            taskId={task.id}
            smallTaskId={smallTaskId}
            contents={smallTask.contents}
            deadline={smallTask.deadline}
            checked={smallTask.checked}
            datetime={smallTask.updated_at}
          />
        </>
      )}
    </div>
  );
};

export default SmallTaskDetail;
