import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { SecondaryButton, TextInput } from "../components/UIkit";
import { State } from "../re-ducks/store/types";
import { getTasks } from "../re-ducks/users/selectors";
import { taskUpdate } from "../re-ducks/users/operations";
import DateFnsUtils from "@date-io/date-fns";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

type Inputs = {
  contents: string;
};

const TaskEdit: React.FC = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state: State) => state);
  const tasks = getTasks(selector);
  const taskId = window.location.pathname.split("/")[3];
  const taskIndex = tasks.findIndex((element) => element.id === taskId);
  const task = tasks[taskIndex];

  const { register, handleSubmit, errors } = useForm<Inputs>({
    defaultValues: {
      contents: task?.contents,
    },
  });

  const [contents, setContents] = useState(task?.contents);
  const [deadline, setDeadline] = useState(task?.deadline?.toDate()!);
  const [deadlineNull, setDeadlineNull] = useState(null);

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

  const inputDeadlineNull = useCallback(
    (date: any) => {
      setDeadlineNull(date);
    },
    [setDeadlineNull]
  );

  const dispatchTaskUpdate = () => {
    task.deadline
      ? dispatch(taskUpdate(contents, taskId, taskIndex, deadline))
      : dispatch(taskUpdate(contents, taskId, taskIndex, deadlineNull));
  };

  return (
    <div className="c-mw700">
      {task && (
        <>
          <h2>タスクの編集</h2>
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
          {task.deadline ? (
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
          ) : (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker
                clearable
                autoOk
                ampm={false}
                disablePast
                value={deadlineNull}
                onChange={inputDeadlineNull}
                format="yyyy/MM/dd HH:mm"
                label="タスクの期限"
              />
            </MuiPickersUtilsProvider>
          )}
          <div className="space-m"></div>
          <SecondaryButton
            text="更新する"
            disabled={contents ? false : true}
            onClick={handleSubmit(() => dispatchTaskUpdate())}
          />
        </>
      )}
    </div>
  );
};

export default TaskEdit;
