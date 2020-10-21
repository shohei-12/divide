import React from "react";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { Deadline, PriorityButton } from ".";
import { taskCheckToggle, taskDelete } from "../../re-ducks/users/operations";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles({
  content: {
    "&:last-child": {
      paddingBottom: 16,
    },
  },
  datetime: {
    fontSize: 14,
    display: "inline-block",
  },
  alignRight: {
    marginRight: 0,
    marginLeft: "auto",
  },
  flex: {
    display: "flex",
    alignItems: "center",
  },
});

type Props = {
  taskId: string;
  contents: string;
  deadline: firebase.firestore.Timestamp | null;
  checked: boolean;
  datetime: firebase.firestore.Timestamp;
};

const Task: React.FC<Props> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const formatDatetime = (datetime: Date) => {
    return (
      datetime.getFullYear() +
      "-" +
      ("00" + (datetime.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + datetime.getDate()).slice(-2) +
      " " +
      ("00" + datetime.getHours()).slice(-2) +
      ":" +
      ("00" + datetime.getMinutes()).slice(-2)
    );
  };

  return (
    <Card>
      <CardContent className={classes.content}>
        <div className={classes.flex}>
          <Typography className={classes.datetime} color="textSecondary">
            {formatDatetime(props.datetime.toDate())}
          </Typography>
          <div className={classes.flex + " " + classes.alignRight}>
            {props.deadline && <Deadline deadline={props.deadline} />}
            <Checkbox
              checked={props.checked}
              color="primary"
              inputProps={{ "aria-label": "タスクの完了" }}
              onClick={(
                event: React.MouseEvent<HTMLButtonElement, MouseEvent>
              ) => {
                event.stopPropagation();
                dispatch(taskCheckToggle(!props.checked, props.taskId, null));
              }}
            />
          </div>
        </div>
        <Typography variant="h5" component="h3">
          {props.contents}
        </Typography>
        <IconButton
          onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            event.stopPropagation();
            dispatch(push(`/task/edit/${props.taskId}`));
          }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            event.stopPropagation();
            if (window.confirm("本当に削除しますか？")) {
              dispatch(taskDelete(props.taskId));
            }
          }}
        >
          <DeleteIcon />
        </IconButton>
        <PriorityButton taskId={props.taskId} />
      </CardContent>
    </Card>
  );
};

export default Task;
