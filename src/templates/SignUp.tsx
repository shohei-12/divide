import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { push } from "connected-react-router";
import { PrimaryButton, TextInput } from "../components/UIkit";
import { signUp } from "../re-ducks/users/operations";

type Inputs = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUp: React.FC = () => {
  const { register, handleSubmit, errors } = useForm<Inputs>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validation, setValidation] = useState("");

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

  const inputPassword = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(event.target.value);
      setValidation(event.target.value);
    },
    [setPassword]
  );

  const inputConfirmPassword = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setConfirmPassword(event.target.value);
    },
    [setConfirmPassword]
  );

  const dispatchSignUp = () => {
    dispatch(signUp(username, email, password, confirmPassword));
  };

  return (
    <div className="c-mw700">
      <h2>新規ユーザー登録</h2>
      <TextInput
        fullWidth={true}
        label="ユーザー名"
        multiline={false}
        required={true}
        rows="1"
        type="text"
        name="username"
        inputRef={register({
          required: "入力必須です。",
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
          required: "入力必須です。",
          pattern: {
            value: /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/,
            message: "正しいメールアドレスを入力してください。",
          },
        })}
        error={Boolean(errors.email)}
        helperText={errors.email && errors.email.message}
        onChange={inputEmail}
      />
      <TextInput
        fullWidth={true}
        label="パスワード"
        multiline={false}
        required={true}
        rows="1"
        type="password"
        name="password"
        inputRef={register({
          required: "入力必須です。",
          minLength: {
            value: 6,
            message: "6文字以上で入力してください。",
          },
        })}
        error={Boolean(errors.password)}
        helperText={errors.password && errors.password.message}
        onChange={inputPassword}
      />
      <TextInput
        fullWidth={true}
        label="パスワード（確認）"
        multiline={false}
        required={true}
        rows="1"
        type="password"
        name="confirmPassword"
        inputRef={register({
          required: "入力必須です。",
          minLength: {
            value: 6,
            message: "6文字以上で入力してください。",
          },
          pattern: {
            value: new RegExp("^" + validation + "$"),
            message: "パスワードが一致しません。",
          },
        })}
        error={Boolean(errors.confirmPassword)}
        helperText={errors.confirmPassword && errors.confirmPassword.message}
        onChange={inputConfirmPassword}
      />
      <div className="space-m"></div>
      <PrimaryButton
        text="登録する"
        disabled={
          username && email && password && confirmPassword ? false : true
        }
        onClick={handleSubmit(() => dispatchSignUp())}
      />
      <div className="space-s"></div>
      <p
        className="inline-block pointer-h"
        onClick={() => dispatch(push("/signin"))}
      >
        ユーザー登録がお済みの方はこちら
      </p>
    </div>
  );
};

export default SignUp;
