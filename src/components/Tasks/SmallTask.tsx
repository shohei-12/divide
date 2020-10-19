import React from "react";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { Deadline } from ".";
import { smallTaskDelete } from "../../re-ducks/users/operations";
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
  smallTaskId: string;
  contents: string;
  deadline: firebase.firestore.Timestamp | null;
  datetime: firebase.firestore.Timestamp;
};

const SmallTask: React.FC<Props> = (props) => {
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
              color="primary"
              inputProps={{ "aria-label": "タスクの完了" }}
            />
          </div>
        </div>
        <Typography variant="h5" component="h3">
          {props.contents}
        </Typography>
        <IconButton
          onClick={() =>
            dispatch(
              push(`/small-task/edit/${props.taskId}/${props.smallTaskId}`)
            )
          }
        >
          <EditIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            if (window.confirm("本当に削除しますか？")) {
              dispatch(smallTaskDelete(props.taskId, props.smallTaskId));
            }
          }}
        >
          <DeleteIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
};

export default SmallTask;
