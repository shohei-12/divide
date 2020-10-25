import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { State } from "../re-ducks/store/types";
import { getUserId, getTasks } from "../re-ducks/users/selectors";
import {
  fetchTasksOnPageN,
  fetchTasksOnPage1,
} from "../re-ducks/users/operations";
import { Task } from "../components/Tasks";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Hidden from "@material-ui/core/Hidden";
import Pagination from "@material-ui/lab/Pagination";
import { db } from "../firebase";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrap: {
      paddingBottom: 60,
    },
    tasks: {
      position: "relative",
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
    fab: {
      position: "fixed",
      right: 30,
      bottom: 30,
    },
    pagination: {
      position: "absolute",
      bottom: -60,
    },
  })
);

const TaskList: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selector = useSelector((state: State) => state);
  const uid = getUserId(selector);
  let tasks = getTasks(selector);

  const [taskCount, setTaskCount] = useState(0);

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

  useEffect(() => {
    dispatch(fetchTasksOnPage1(uid));
    db.collection("users")
      .doc(uid)
      .collection("tasks")
      .get()
      .then((snapshots) => {
        setTaskCount(snapshots.size);
      });
  }, [dispatch, uid]);

  const calcPage = (taskCount: number) => {
    if (taskCount % 6 === 0) {
      return taskCount / 6;
    } else {
      return ((taskCount / 6) | 0) + 1;
    }
  };

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    dispatch(fetchTasksOnPageN(uid, value));
  };

  return (
    <div className={classes.wrap}>
      <div className={classes.tasks}>
        {tasks &&
          tasks.map((task, index) => (
            <div
              key={index}
              className={classes.task}
              onClick={() => dispatch(push(`/task/detail/${task.id}`))}
            >
              <Task
                smallTasks={task.small_tasks.filter(
                  (smallTask) => smallTask.parentId === null
                )}
                taskId={task.id}
                contents={task.contents}
                deadline={task.deadline}
                checked={task.checked}
                datetime={task.updated_at}
              />
            </div>
          ))}
        <Hidden smUp>
          <Fab
            className={classes.fab}
            color="primary"
            aria-label="タスクの登録"
            onClick={() => dispatch(push("/task/registration"))}
          >
            <AddIcon />
          </Fab>
        </Hidden>
        <Pagination
          className={classes.pagination}
          count={calcPage(taskCount)}
          color="primary"
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default TaskList;
