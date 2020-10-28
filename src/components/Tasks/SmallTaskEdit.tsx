import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { SecondaryButton, TextInput } from "../UIkit";
import { SmallTaskState } from "../../re-ducks/users/types";
import { updateTask } from "../../re-ducks/users/operations";
import DateFnsUtils from "@date-io/date-fns";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    close: {
      position: "absolute",
      top: 4,
      right: 4,
      padding: 4,
    },
    title: {
      marginTop: 0,
    },
  })
);

type Inputs = {
  contents: string;
};

type Props = {
  smallTask: SmallTaskState;
  taskId: string;
  handleClose: () => void;
};

const SmallTaskEdit: React.FC<Props> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const taskId = props.taskId;
  const smallTask = props.smallTask;

  const { register, handleSubmit, errors } = useForm<Inputs>({
    defaultValues: {
      contents: smallTask.contents,
    },
  });

  const [contents, setContents] = useState(smallTask.contents);
  const [deadline, setDeadline] = useState(
    smallTask.deadline ? new Date(smallTask.deadline) : null
  );

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

  return (
    <>
      {smallTask && (
        <>
          <IconButton className={classes.close} onClick={props.handleClose}>
            <CloseIcon />
          </IconButton>
          <h2 className={classes.title}>タスクの編集</h2>
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
            text="更新する"
            disabled={contents ? false : true}
            onClick={handleSubmit(() => {
              dispatch(updateTask(contents, taskId, smallTask.id, deadline));
              props.handleClose();
            })}
          />
        </>
      )}
    </>
  );
};

export default SmallTaskEdit;
