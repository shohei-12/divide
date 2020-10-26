import React from "react";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { Deadline, PriorityButton } from ".";
import { toggleTaskCheck, deleteTask } from "../../re-ducks/users/operations";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import ViewModuleIcon from "@material-ui/icons/ViewModule";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";
import Badge from "@material-ui/core/Badge";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      "&:last-child": {
        paddingBottom: 16,
      },
    },
    datetime: {
      fontSize: 14,
    },
    alignRight: {
      marginRight: 0,
      marginLeft: "auto",
    },
    flex: {
      display: "flex",
      alignItems: "center",
    },
    contents: {
      fontSize: 18,
      [theme.breakpoints.up("sm")]: {
        fontSize: 20,
      },
    },
  })
);

type Props = {
  tinyTaskLength: number;
  taskId: string;
  smallTaskId: string;
  contents: string;
  deadline: string | null;
  checked: boolean;
  datetime: string;
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
            {formatDatetime(new Date(props.datetime))}
          </Typography>
          <div className={classes.flex + " " + classes.alignRight}>
            {props.deadline && <Deadline deadline={props.deadline} />}
            <Tooltip title="タスクの完了">
              <Checkbox
                checked={props.checked}
                color="primary"
                inputProps={{ "aria-label": "タスクの完了" }}
                onClick={() => {
                  dispatch(
                    toggleTaskCheck(
                      !props.checked,
                      props.taskId,
                      props.smallTaskId
                    )
                  );
                }}
              />
            </Tooltip>
          </div>
        </div>
        <Typography className={classes.contents} variant="h5" component="h3">
          {props.contents}
        </Typography>
        <Tooltip title="分割">
          <IconButton
            onClick={() =>
              dispatch(
                push(`/small-task/detail/${props.taskId}/${props.smallTaskId}`)
              )
            }
          >
            <Badge badgeContent={props.tinyTaskLength} color="primary">
              <ViewModuleIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        <Tooltip title="編集">
          <IconButton
            onClick={() =>
              dispatch(
                push(`/small-task/edit/${props.taskId}/${props.smallTaskId}`)
              )
            }
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="削除">
          <IconButton
            onClick={() => {
              if (window.confirm("タスクを削除しますか？")) {
                dispatch(deleteTask(props.taskId, props.smallTaskId));
              }
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <PriorityButton taskId={props.taskId} smallTaskId={props.smallTaskId} />
      </CardContent>
    </Card>
  );
};

export default SmallTask;
