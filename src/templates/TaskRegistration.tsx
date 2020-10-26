import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { SecondaryButton, TextInput } from "../components/UIkit";
import { registerTask } from "../re-ducks/users/operations";
import DateFnsUtils from "@date-io/date-fns";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

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
  const [deadline, setDeadline] = useState<Date | null>(null);

  const inputContents = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setContents(event.target.value);
    },
    [setContents]
  );

  const inputDeadline = useCallback(
    (date: Date | null) => {
      setDeadline(date);
    },
    [setDeadline]
  );

  const dispatchTaskRegistration = () => {
    dispatch(registerTask(contents, deadline));
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
            value: 50,
            message: "50文字以内で入力してください。",
          },
        })}
        error={Boolean(errors.contents)}
        helperText={errors.contents && errors.contents.message}
        onChange={inputContents}
      />
      <div className="space-m"></div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DateTimePicker
          clearable
          autoOk
          ampm={false}
          disablePast
          value={deadline}
          onChange={inputDeadline}
          format="yyyy/MM/dd HH:mm"
          label="タスクの期限"
        />
      </MuiPickersUtilsProvider>
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
