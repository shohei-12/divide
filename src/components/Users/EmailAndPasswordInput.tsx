import React, { useCallback } from "react";
import { FieldError } from "react-hook-form";
import { TextInput } from "../UIkit";

type Props = {
  emailErrors: FieldError | undefined;
  passwordErrors: FieldError | undefined;
  setEmail: (value: React.SetStateAction<string>) => void;
  setPassword: (value: React.SetStateAction<string>) => void;
  emailValidation: any;
  passwordValidation: any;
};

const EmailAndPasswordInput: React.FC<Props> = (props) => {
  const inputEmail = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      props.setEmail(event.target.value);
    },
    [props]
  );

  const inputPassword = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      props.setPassword(event.target.value);
    },
    [props]
  );

  return (
    <>
      <TextInput
        fullWidth={true}
        label="メールアドレス"
        multiline={false}
        required={true}
        rows="1"
        type="email"
        name="email"
        inputRef={props.emailValidation}
        error={Boolean(props.emailErrors)}
        helperText={props.emailErrors && props.emailErrors.message}
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
        inputRef={props.passwordValidation}
        error={Boolean(props.passwordErrors)}
        helperText={props.passwordErrors && props.passwordErrors.message}
        onChange={inputPassword}
      />
    </>
  );
};

export default EmailAndPasswordInput;
