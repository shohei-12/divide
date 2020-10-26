import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { SecondaryButton, TextInput } from "../UIkit";
import { TaskState } from "../../re-ducks/users/types";
import { updateTask } from "../../re-ducks/users/operations";
import DateFnsUtils from "@date-io/date-fns";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      marginTop: 0,
    },
    close: {
      position: "absolute",
      top: 4,
      right: 4,
      padding: 4,
    },
    modal: {
      position: "relative",
      backgroundColor: theme.palette.background.paper,
      width: 700,
      padding: "30px 20px",
      margin: "60px auto 0",
      borderRadius: 4,
    },
  })
);

type Inputs = {
  contents: string;
};

type Props = {
  task: TaskState;
  handleClose: () => void;
};

const TaskEdit: React.FC<Props> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const task = props.task;
  const taskId = task.id;
  const taskDeadline = task.deadline;

  const { register, handleSubmit, errors } = useForm<Inputs>({
    defaultValues: {
      contents: task.contents,
    },
  });

  const [contents, setContents] = useState(task.contents);
  const [deadline, setDeadline] = useState(
    taskDeadline ? new Date(taskDeadline) : null
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

  const dispatchUpdateTask = () => {
    dispatch(updateTask(contents, taskId, null, deadline));
  };

  return (
    <div className={classes.modal}>
      {task && (
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
              onClick={(
                event: React.MouseEvent<HTMLDivElement, MouseEvent>
              ) => {
                event.stopPropagation();
              }}
            />
          </MuiPickersUtilsProvider>
          <div className="space-m"></div>
          <SecondaryButton
            text="更新する"
            disabled={contents ? false : true}
            onClick={handleSubmit(() => {
              dispatchUpdateTask();
              props.handleClose();
            })}
          />
        </>
      )}
    </div>
  );
};

export default TaskEdit;
