import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { SecondaryButton, TextInput } from "../components/UIkit";
import { taskRegistration } from "../re-ducks/users/operations";

type Inputs = {
  contents: string;
};

const TaskRegistration: React.FC = () => {
  const { register, handleSubmit, errors } = useForm<Inputs>({
    defaultValues: {
      contents: "",
    },
  });

  const dispatch = useDispatch();

  const [contents, setContents] = useState("");

  const inputContents = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setContents(event.target.value);
    },
    [setContents]
  );

  const dispatchTaskRegistration = () => {
    dispatch(taskRegistration(contents));
  };

  return (
    <div className="c-mw700">
      <h2>タスクの登録</h2>
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
        text="登録する"
        disabled={contents ? false : true}
        onClick={handleSubmit(() => dispatchTaskRegistration())}
      />
    </div>
  );
};

export default TaskRegistration;
