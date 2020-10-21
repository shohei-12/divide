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
  let tasks = getTasks(selector);

  switch (selector.router.location.search) {
    case "?finished":
      tasks = tasks.filter((task) => task.checked === true);
      break;
    case "?unfinished":
      tasks = tasks.filter((task) => task.checked === false);
      break;
    case "?priority=none":
      tasks = tasks.filter((task) => task.priority === 0);
      break;
    case "?priority=high":
      tasks = tasks.filter((task) => task.priority === 1);
      break;
    case "?priority=medium":
      tasks = tasks.filter((task) => task.priority === 2);
      break;
    case "?priority=low":
      tasks = tasks.filter((task) => task.priority === 3);
  }

  return (
    <div className={classes.flex}>
      {tasks &&
        tasks.map((task, index) => (
          <div
            key={index}
            className={classes.task}
            onClick={() => dispatch(push(`/task/detail/${task.id}`))}
          >
            <Task
              taskId={task.id}
              contents={task.contents}
              deadline={task.deadline}
              checked={task.checked}
              datetime={task.updated_at}
            />
          </div>
        ))}
    </div>
  );
};

export default TaskList;
