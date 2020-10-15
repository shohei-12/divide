import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { SecondaryButton, TextInput } from "../components/UIkit";
import { State } from "../re-ducks/store/types";
import { getTasks } from "../re-ducks/users/selectors";
import { taskUpdate } from "../re-ducks/users/operations";

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

  const inputContents = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setContents(event.target.value);
    },
    [setContents]
  );

  const dispatchTaskUpdate = () => {
    dispatch(taskUpdate(contents!, taskId, taskIndex));
  };

  return (
    <div className="c-mw700">
      <h2>タスクの更新</h2>
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
            value: 100,
            message: "100文字以内で入力してください。",
          },
        })}
        error={Boolean(errors.contents)}
        helperText={errors.contents && errors.contents.message}
        onChange={inputContents}
      />
      <div className="space-m"></div>
      <SecondaryButton
        text="更新する"
        disabled={contents ? false : true}
        onClick={handleSubmit(() => dispatchTaskUpdate())}
      />
    </div>
  );
};

export default TaskEdit;
