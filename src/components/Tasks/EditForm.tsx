import React from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { SecondaryButton } from "../UIkit";
import { TaskForm } from ".";
import { TaskState, SmallTaskState } from "../../re-ducks/users/types";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
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
  task: TaskState | SmallTaskState;
  handleClose: () => void;
  contents: string;
  deadline: Date | null;
  setContents: (value: React.SetStateAction<string>) => void;
  setDeadline: (value: React.SetStateAction<Date | null>) => void;
  updateTask: any;
};

const EditForm: React.FC<Props> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { register, handleSubmit, errors } = useForm<Inputs>({
    defaultValues: {
      contents: props.task.contents,
    },
  });

  return (
    <>
      <IconButton className={classes.close} onClick={props.handleClose}>
        <CloseIcon />
      </IconButton>
      <h2 className={classes.title}>タスクの編集</h2>
      <TaskForm
        deadline={props.deadline}
        setContents={props.setContents}
        setDeadline={props.setDeadline}
        contentsErrors={errors.contents}
        contentsValidation={register({
          required: "入力必須です。",
          maxLength: {
            value: 50,
            message: "50文字以内で入力してください。",
          },
        })}
      />
      <div className="space-m"></div>
      <SecondaryButton
        text="更新する"
        disabled={props.contents ? false : true}
        onClick={handleSubmit(() => {
          dispatch(props.updateTask);
          props.handleClose();
        })}
      />
    </>
  );
};

export default EditForm;
