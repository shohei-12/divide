import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { push } from "connected-react-router";
import { SecondaryButton, TextInput } from "../components/UIkit";
import { signIn } from "../re-ducks/users/operations";

type Inputs = {
  email: string;
  password: string;
};

const SignIn: React.FC = () => {
  const { register, handleSubmit, errors } = useForm<Inputs>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const dispatch = useDispatch();

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

  const signInAsGuestUser = useCallback(() => {
    dispatch(signIn("guest@example.com", "password"));
  }, [dispatch]);

  const goSignUpPage = useCallback(() => {
    dispatch(push("/signup"));
  }, [dispatch]);

  const goPasswordResetPage = useCallback(() => {
    dispatch(push("/password/reset"));
  }, [dispatch]);

  return (
    <div className="c-mw700">
      <h2>ログイン</h2>
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
            message: "メールアドレスの形式が正しくありません。",
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
          pattern: {
            value: /^[a-zA-Z0-9_-]+$/,
            message:
              "半角英数字、ハイフン(-)、アンダーバー(_)のみ利用可能です。",
          },
        })}
        error={Boolean(errors.password)}
        helperText={errors.password && errors.password.message}
        onChange={inputPassword}
      />
      <div className="space-m"></div>
      <SecondaryButton
        text="ログインする"
        disabled={email && password ? false : true}
        onClick={handleSubmit(() => {
          dispatch(signIn(email, password));
        })}
      />
      <div className="space-m"></div>
      <SecondaryButton
        text="ゲストユーザーでログインする"
        onClick={signInAsGuestUser}
      />
      <div className="space-s"></div>
      <p className="inline-block pointer-h" onClick={goSignUpPage}>
        ユーザー登録がお済みでない方はこちら
      </p>
      <br />
      <p className="inline-block pointer-h" onClick={goPasswordResetPage}>
        パスワードを忘れた方はこちら
      </p>
    </div>
  );
};

export default SignIn;
