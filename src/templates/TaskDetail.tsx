import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { getTasks } from "../re-ducks/users/selectors";
import { State } from "../re-ducks/store/types";
import { SecondaryButton, TextInput } from "../components/UIkit";
import { SmallTask, Task } from "../components/Tasks";
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

  const inputContents = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setContents(event.target.value);
    },
    [setContents]
  );

  const inputDeadline = useCallback(
    (date: Date | null) => {
      setDeadline(date);
    },
    [setDeadline]
  );

  const dispatchTaskDivision = () => {
    dispatch(divideTask(contents, taskId, null, deadline));
    reset();
    setDeadline(null);
  };

  return (
    <div className="c-mw700">
      {task && (
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
          {smallTasks.length === 1 && (
            <SmallTask
              tinyTaskLength={
                smallTasksExcludeNull.filter(
                  (smallTask) => smallTask.parentId === smallTasks[0].id
                ).length
              }
              taskId={task.id}
              smallTaskId={smallTasks[0].id}
              contents={smallTasks[0].contents}
              deadline={smallTasks[0].deadline}
              checked={smallTasks[0].checked}
              datetime={smallTasks[0].updated_at}
            />
          )}
          {smallTasks.length === 2 && (
            <>
              <SmallTask
                tinyTaskLength={
                  smallTasksExcludeNull.filter(
                    (smallTask) => smallTask.parentId === smallTasks[0].id
                  ).length
                }
                taskId={task.id}
                smallTaskId={smallTasks[0].id}
                contents={smallTasks[0].contents}
                deadline={smallTasks[0].deadline}
                checked={smallTasks[0].checked}
                datetime={smallTasks[0].updated_at}
              />
              <AddIcon className={classes.icon} color="primary" />
              <SmallTask
                tinyTaskLength={
                  smallTasksExcludeNull.filter(
                    (smallTask) => smallTask.parentId === smallTasks[1].id
                  ).length
                }
                taskId={task.id}
                smallTaskId={smallTasks[1].id}
                contents={smallTasks[1].contents}
                deadline={smallTasks[1].deadline}
                checked={smallTasks[1].checked}
                datetime={smallTasks[1].updated_at}
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
                        (element) => element.parentId === smallTask.id
                      ).length
                    }
                    taskId={task.id}
                    smallTaskId={smallTask.id}
                    contents={smallTask.contents}
                    deadline={smallTask.deadline}
                    checked={smallTask.checked}
                    datetime={smallTask.updated_at}
                  />
                  <AddIcon className={classes.icon} color="primary" />
                </React.Fragment>
              ))}
              <SmallTask
                tinyTaskLength={
                  smallTasksExcludeNull.filter(
                    (smallTask) =>
                      smallTask.parentId === smallTasks.slice(-1)[0].id
                  ).length
                }
                taskId={task.id}
                smallTaskId={smallTasks.slice(-1)[0].id}
                contents={smallTasks.slice(-1)[0].contents}
                deadline={smallTasks.slice(-1)[0].deadline}
                checked={smallTasks.slice(-1)[0].checked}
                datetime={smallTasks.slice(-1)[0].updated_at}
              />
            </>
          )}
          {smallTasks.length > 0 && (
            <ArrowDownwardIcon className={classes.icon} color="primary" />
          )}
          <div className="space-l"></div>
          <Task
            smallTaskLength={smallTasks.length}
            taskId={taskId}
            contents={task.contents}
            deadline={task.deadline}
            checked={task.checked}
            datetime={task.updated_at}
          />
        </>
      )}
    </div>
  );
};

export default TaskDetail;
