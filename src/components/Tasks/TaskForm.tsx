import React, { useCallback } from "react";
import { FieldError } from "react-hook-form";
import { TextInput } from "../UIkit";
import DateFnsUtils from "@date-io/date-fns";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

type Props = {
  deadline: Date | null;
  setContents: (value: React.SetStateAction<string>) => void;
  setDeadline: (value: React.SetStateAction<Date | null>) => void;
  contentsErrors: FieldError | undefined;
  contentsValidation: any;
};

const TaskForm: React.FC<Props> = (props) => {
  const inputContents = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      props.setContents(event.target.value);
    },
    [props]
  );

  const inputDeadline = useCallback(
    (date: Date | null) => {
      props.setDeadline(date);
    },
    [props]
  );

  return (
    <>
      <TextInput
        fullWidth={true}
        label="内容"
        multiline={true}
        required={true}
        rows="5"
        type="text"
        name="contents"
        inputRef={props.contentsValidation}
        error={Boolean(props.contentsErrors)}
        helperText={props.contentsErrors && props.contentsErrors.message}
        onChange={inputContents}
      />
      <div className="space-m"></div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DateTimePicker
          clearable
          autoOk
          ampm={false}
          disablePast
          value={props.deadline}
          onChange={inputDeadline}
          format="yyyy/MM/dd HH:mm"
          label="タスクの期限"
        />
      </MuiPickersUtilsProvider>
    </>
  );
};

export default TaskForm;
