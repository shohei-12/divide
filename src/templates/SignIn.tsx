import React, { useState, useCallback } from "react";
import { PrimaryButton, TextInput } from "../components/UIkit";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const inputEmail = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(event.target.value);
    },
    [setEmail]
  );

  const inputPassword = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(event.target.value);
    },
    [setPassword]
  );
  return (
    <div className="c-m700">
      <h2>ログイン</h2>
      <TextInput
        fullWidth={true}
        label="メールアドレス"
        multiline={false}
        required={true}
        rows="1"
        value={email}
        type="email"
        onChange={inputEmail}
      />
      <TextInput
        fullWidth={true}
        label="パスワード"
        multiline={false}
        required={true}
        rows="1"
        value={password}
        type="password"
        onChange={inputPassword}
      />
      <div className="space-m"></div>
      <PrimaryButton text="ログインする" onClick={} />
    </div>
  );
};

export default SignIn;
