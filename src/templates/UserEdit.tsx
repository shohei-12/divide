import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { PrimaryButton, TextInput } from "../components/UIkit";
import { db } from "../firebase";
import { getUsername, getEmail } from "../re-ducks/users/selectors";
import { State } from "../re-ducks/store/types";

type Inputs = {
  username: string;
  email: string;
};

const UserEdit: React.FC = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state: State) => state);
  const uname = getUsername(selector);
  const uemail = getEmail(selector);

  const [username, setUsername] = useState(uname);
  const [email, setEmail] = useState(uemail);

  const { register, handleSubmit, errors } = useForm<Inputs>({
    mode: "onChange",
    defaultValues: {
      username: username,
      email: email,
    },
  });

  const inputUsername = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setUsername(event.target.value);
    },
    [setUsername]
  );

  const inputEmail = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(event.target.value);
    },
    [setEmail]
  );

  return (
    <div className="c-mw700">
      <h2>ユーザー編集</h2>
      <TextInput
        fullWidth={true}
        label="ユーザー名"
        multiline={false}
        required={true}
        rows="1"
        type="text"
        name="username"
        inputRef={register({
          required: "必ず入力してください。",
          maxLength: {
            value: 30,
            message: "30文字以内で入力してください。",
          },
        })}
        error={Boolean(errors.username)}
        helperText={errors.username && errors.username.message}
        onChange={inputUsername}
      />
      <TextInput
        fullWidth={true}
        label="メールアドレス"
        multiline={false}
        required={true}
        rows="1"
        type="email"
        name="email"
        inputRef={register({
          required: "必ず入力してください。",
          pattern: {
            value: /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/,
            message: "正しいメールアドレスを入力してください。",
          },
        })}
        error={Boolean(errors.email)}
        helperText={errors.email && errors.email.message}
        onChange={inputEmail}
      />
      <div className="space-m"></div>
      {/* <PrimaryButton
        text="登録する"
        disabled={username && email ? false : true}
        onClick={handleSubmit(() => dispatchSignUp())}
      /> */}
    </div>
  );
};

export default UserEdit;
