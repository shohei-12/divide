import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { State } from "../re-ducks/store/types";
import { getTasks } from "../re-ducks/users/selectors";
import { Task } from "../components/Tasks";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    flex: {
      display: "flex",
      flexWrap: "wrap",
    },
    task: {
      margin: 8,
      [theme.breakpoints.up("xs")]: {
        width: "100%",
      },
      [theme.breakpoints.up("lg")]: {
        width: "calc(50% - 16px)",
      },
      [theme.breakpoints.up("xl")]: {
        width: "calc(33.3333% - 16px)",
      },
      "&:hover": {
        cursor: "pointer",
      },
    },
  })
);

const TaskList: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selector = useSelector((state: State) => state);
  const tasks = getTasks(selector);

  return (
    <div className={classes.flex}>
      {tasks &&
        tasks.map((task, index) => (
          <div
            key={index}
            className={classes.task}
            onClick={() => dispatch(push(`/task/detail/${task.id}`))}
          >
            <Task contents={task.contents} datetime={task.updated_at} />
          </div>
        ))}
    </div>
  );
};

export default TaskList;
