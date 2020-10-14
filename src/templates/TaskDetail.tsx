import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { getTasks } from "../re-ducks/users/selectors";
import { State } from "../re-ducks/store/types";
import { PrimaryButton, TextInput } from "../components/UIkit";
import { Task } from "../components/Tasks";
import { taskDivision } from "../re-ducks/users/operations";
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
  const taskIndex = tasks.findIndex((element) => element.id === taskId);
  const task = tasks[taskIndex];

  const [contents, setContents] = useState("");

  const inputContents = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setContents(event.target.value);
    },
    [setContents]
  );

  const dispatchTaskDivision = () => {
    dispatch(taskDivision(contents, taskId, taskIndex));
    reset();
  };

  return (
    <div className="c-mw700">
      {task && (
        <>
          <h2>タスクの詳細</h2>
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
          <PrimaryButton
            text="分割"
            disabled={contents ? false : true}
            onClick={handleSubmit(() => dispatchTaskDivision())}
          />
          <div className="space-l"></div>
          {task.small_tasks.length === 1 && (
            <Task
              contents={task.small_tasks[0].contents}
              datetime={task.small_tasks[0].updated_at}
            />
          )}
          {task.small_tasks.length === 2 && (
            <>
              <Task
                contents={task.small_tasks[0].contents}
                datetime={task.small_tasks[0].updated_at}
              />
              <AddIcon className={classes.icon} color="primary" />
              <Task
                contents={task.small_tasks[1].contents}
                datetime={task.small_tasks[1].updated_at}
              />
            </>
          )}
          {task.small_tasks.length > 2 && (
            <>
              {task.small_tasks.slice(0, -1).map((smallTask, index) => (
                <React.Fragment key={index}>
                  <Task
                    contents={smallTask.contents}
                    datetime={smallTask.updated_at}
                  />
                  <AddIcon className={classes.icon} color="primary" />
                </React.Fragment>
              ))}
              <Task
                contents={task.small_tasks.slice(-1)[0].contents}
                datetime={task.small_tasks.slice(-1)[0].updated_at}
              />
            </>
          )}
          {task.small_tasks.length > 0 && (
            <ArrowDownwardIcon className={classes.icon} color="primary" />
          )}
          <div className="space-l"></div>
          <Task contents={task.contents} datetime={task.updated_at} />
        </>
      )}
    </div>
  );
};

export default TaskDetail;
