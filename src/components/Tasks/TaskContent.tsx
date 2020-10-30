import React, { useCallback, useMemo } from "react";
import { Deadline } from ".";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
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
  contents: string;
  checked: boolean;
  deadline: string | null;
  updatedAt: string;
  taskLength: number;
  setOpen: (value: React.SetStateAction<boolean>) => void;
  dispatchToggleTaskCheck: () => void;
  goDividePage: () => void;
  dispatchDeleteTask: () => void;
};

const TaskContent: React.FC<Props> = (props) => {
  const classes = useStyles();
  const contents = props.contents;
  const checked = props.checked;
  const deadline = props.deadline;
  const updatedAt = props.updatedAt;

  const handleOpen = useCallback(() => {
    props.setOpen(true);
  }, [props]);

  const dispatchToggleTaskCheck = props.dispatchToggleTaskCheck;

  const goDividePage = props.goDividePage;

  const dispatchDeleteTask = props.dispatchDeleteTask;

  const formatDatetime = useMemo(() => {
    const datetime = new Date(updatedAt);
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
  }, [updatedAt]);

  return (
    <>
      <div className={classes.flex}>
        <Typography className={classes.datetime} color="textSecondary">
          {formatDatetime}
        </Typography>
        <div className={classes.flex + " " + classes.alignRight}>
          {deadline && <Deadline deadline={deadline} />}
          <Tooltip title="タスクの完了">
            <Checkbox
              checked={checked}
              color="primary"
              inputProps={{ "aria-label": "タスクの完了" }}
              onClick={dispatchToggleTaskCheck}
            />
          </Tooltip>
        </div>
      </div>
      <Typography className={classes.contents} variant="h5" component="h3">
        {contents}
      </Typography>
      <Tooltip title="分割">
        <IconButton onClick={goDividePage}>
          <Badge badgeContent={props.taskLength} color="primary">
            <ViewModuleIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Tooltip title="編集">
        <IconButton onClick={handleOpen}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="削除">
        <IconButton onClick={dispatchDeleteTask}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default TaskContent;
