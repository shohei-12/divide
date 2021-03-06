import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { SecondaryButton, TextInput } from "../components/UIkit";
import { getUserId, getEmail } from "../re-ducks/users/selectors";
import { State } from "../re-ducks/store/types";
import { updateUser } from "../re-ducks/users/operations";

type Inputs = {
  email: string;
};

const UserEdit: React.FC = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state: State) => state);
  const uid = getUserId(selector);
  const uemail = getEmail(selector);
  const guestId = "XOuPHCtNr3MdYlVmEuCSlcsmIgG2";

  const [email, setEmail] = useState(uemail);

  const { register, handleSubmit, errors } = useForm<Inputs>({
    defaultValues: {
      email: email,
    },
  });

  const inputEmail = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(event.target.value);
    },
    [setEmail]
  );

  return (
    <div className="c-mw700">
      <h2>メールアドレスの変更</h2>
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
        disabled={uid === guestId ? true : false}
        onChange={inputEmail}
      />
      <div className="space-m"></div>
      <SecondaryButton
        text="変更する"
        disabled={uid === guestId ? true : email ? false : true}
        onClick={handleSubmit(() => {
          dispatch(updateUser(uid, email));
        })}
      />
    </div>
  );
};

export default UserEdit;
