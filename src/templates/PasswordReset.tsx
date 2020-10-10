import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { push } from "connected-react-router";
import { PrimaryButton, TextInput } from "../components/UIkit";
import { auth } from "../firebase";

type Inputs = {
  email: string;
};

const PasswordReset: React.FC = () => {
  const { register, handleSubmit, errors } = useForm<Inputs>({
    defaultValues: {
      email: "",
    },
  });

  const dispatch = useDispatch();

  const [email, setEmail] = useState("");

  const inputEmail = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(event.target.value);
    },
    [setEmail]
  );

  const resetPassword = (email: string) => {
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        alert(
          "入力されたメールアドレスにパスワードリセット用のメールを送信しました。"
        );
      })
      .catch(() => {
        alert(
          "入力されたメールアドレスにパスワードリセット用のメールを送信できませんでした。メールアドレスが正しいかどうかご確認くださいませ。"
        );
      });

    dispatch(push("/signin"));
  };

  return (
    <div className="c-mw700">
      <h2>パスワードのリセット</h2>
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
      <div className="space-m"></div>
      <PrimaryButton
        text="パスワードをリセットする"
        disabled={email ? false : true}
        onClick={handleSubmit(() => resetPassword(email))}
      />
      <div className="space-s"></div>
      <p
        className="inline-block pointer-h"
        onClick={() => dispatch(push("/signin"))}
      >
        ログインページに戻る
      </p>
    </div>
  );
};

export default PasswordReset;
