import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { useForm } from "react-hook-form";
import { PrimaryButton, TextInput } from "../components/UIkit";
import { db, FirebaseTimestamp } from "../firebase";
import { State } from "../re-ducks/store/types";
import { getUserId } from "../re-ducks/users/selectors";

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
  const selector = useSelector((state: State) => state);
  const uid = getUserId(selector);

  const [contents, setContents] = useState("");

  const inputContents = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setContents(event.target.value);
    },
    [setContents]
  );

  const taskRegistration = (contents: string) => {
    const timestamp = FirebaseTimestamp.now();
    const tasksRef = db.collection("users").doc(uid).collection("tasks");
    const id = tasksRef.doc().id;

    const taskInitialData = {
      id,
      contents,
      created_at: timestamp,
      updated_at: timestamp,
    };

    tasksRef
      .doc(id)
      .set(taskInitialData)
      .then(() => {
        dispatch(push("/"));
      })
      .catch(() => {
        alert(
          "タスクの登録ができませんでした。通信環境の良い場所で再度お試しくださいませ。"
        );
      });
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
      <PrimaryButton
        text="登録する"
        disabled={contents ? false : true}
        onClick={handleSubmit(() => taskRegistration(contents))}
      />
    </div>
  );
};

export default TaskRegistration;
