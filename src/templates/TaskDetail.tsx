import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { getTasks } from "../re-ducks/users/selectors";
import { State } from "../re-ducks/store/types";
import { PrimaryButton, TextInput } from "../components/UIkit";
import { Task } from "../components/Tasks";

type Inputs = {
  contents: string;
};

const TaskDetail: React.FC = () => {
  const { register, handleSubmit, errors } = useForm<Inputs>({
    defaultValues: {
      contents: "",
    },
  });

  const dispatch = useDispatch();
  const selector = useSelector((state: State) => state);
  const tasks = getTasks(selector);
  const taskId = window.location.pathname.split("/")[3];
  const task = tasks.find((element) => element.id === taskId);

  const [contents, setContents] = useState("");

  const inputContents = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setContents(event.target.value);
    },
    [setContents]
  );

  return (
    <div className="c-mw700">
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
        onClick={handleSubmit(() => console.log("hoge"))}
      />
      <div className="space-l"></div>
      {task && <Task contents={task.contents} datetime={task.updated_at} />}
    </div>
  );
};

export default TaskDetail;
