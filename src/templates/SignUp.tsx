import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { push } from "connected-react-router";
import { SecondaryButton, TextInput } from "../components/UIkit";
import { getTheme } from "../re-ducks/users/selectors";
import { State } from "../re-ducks/store/types";
import { EmailAndPasswordInput } from "../components/Users";
import { auth, db, FirebaseTimestamp } from "../firebase";

type Inputs = {
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUp: React.FC = () => {
  const { register, handleSubmit, errors } = useForm<Inputs>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const dispatch = useDispatch();
  const selector = useSelector((state: State) => state);
  const theme = getTheme(selector);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const inputConfirmPassword = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setConfirmPassword(event.target.value);
    },
    [setConfirmPassword]
  );

  const goSignInPage = useCallback(() => {
    dispatch(push("/signin"));
  }, [dispatch]);

  const signUp = (email: string, password: string) => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        const user = result.user;

        if (user) {
          const uid = user.uid;
          const timestamp = FirebaseTimestamp.now().toDate().toString();
          const userInitialData = {
            uid,
            email,
            theme,
            created_at: timestamp,
            updated_at: timestamp,
          };

          db.collection("users")
            .doc(uid)
            .set(userInitialData)
            .then(() => {
              dispatch(push("/"));
            })
            .catch((error) => {
              throw new Error(error);
            });
        }
      })
      .catch((error) => {
        throw new Error(error);
      });
  };

  return (
    <div className="c-mw700">
      <h2>新規ユーザー登録</h2>
      <EmailAndPasswordInput
        emailErrors={errors.email}
        passwordErrors={errors.password}
        setEmail={setEmail}
        setPassword={setPassword}
        emailValidation={register({
          required: "入力必須です。",
          pattern: {
            value: /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/,
            message: "メールアドレスの形式が正しくありません。",
          },
        })}
        passwordValidation={register({
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
          validate: (value) =>
            value === password || "パスワードが一致しません。",
        })}
        error={Boolean(errors.confirmPassword)}
        helperText={errors.confirmPassword && errors.confirmPassword.message}
        onChange={inputConfirmPassword}
      />
      <div className="space-m"></div>
      <SecondaryButton
        text="登録する"
        disabled={email && password && confirmPassword ? false : true}
        onClick={handleSubmit(() => signUp(email, password))}
      />
      <div className="space-s"></div>
      <p className="inline-block pointer-h" onClick={goSignInPage}>
        ユーザー登録がお済みの方はこちら
      </p>
    </div>
  );
};

export default SignUp;
