import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { State } from "../re-ducks/store/types";
import { getUserId, getTasks } from "../re-ducks/users/selectors";
import { fetchTasksOnPageN } from "../re-ducks/users/operations";
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

const CheckFilteredTaskList: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selector = useSelector((state: State) => state);
  const uid = getUserId(selector);
  const tasks = getTasks(selector);
  const checked =
    window.location.pathname.split("/")[3] === "finished" ? true : false;

  const [taskCount, setTaskCount] = useState(0);

  const calcPage = (taskCount: number) => {
    if (taskCount % 6 === 0) {
      return taskCount / 6;
    } else {
      return ((taskCount / 6) | 0) + 1;
    }
  };

  const goTaskRegistration = useCallback(() => {
    dispatch(push("/task/registration"));
  }, [dispatch]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      dispatch(fetchTasksOnPageN(uid, value, checked, null));
    },
    [dispatch, uid, checked]
  );

  useEffect(() => {
    dispatch(fetchTasksOnPageN(uid, 1, checked, null));
    db.collection("users")
      .doc(uid)
      .collection("tasks")
      .get()
      .then((snapshots) => {
        if (checked) {
          setTaskCount(
            snapshots.docs.filter(
              (snapshot) => snapshot.data().checked === true
            ).length
          );
        } else {
          setTaskCount(
            snapshots.docs.filter(
              (snapshot) => snapshot.data().checked === false
            ).length
          );
        }
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [dispatch, uid, checked]);

  return (
    <div className={classes.wrap}>
      <div className={classes.tasks}>
        {tasks.length > 0 &&
          tasks.map((task, index) => (
            <div key={index} className={classes.task}>
              <Task
                smallTaskLength={
                  task.small_tasks.filter(
                    (smallTask) => smallTask.parentId === null
                  ).length
                }
                task={task}
              />
            </div>
          ))}
        <Hidden smUp>
          <Fab
            className={classes.fab}
            color="primary"
            aria-label="タスクの登録"
            onClick={goTaskRegistration}
          >
            <AddIcon />
          </Fab>
        </Hidden>
        {taskCount > 0 && (
          <Pagination
            className={classes.pagination}
            count={calcPage(taskCount)}
            color="primary"
            onChange={handleChange}
          />
        )}
      </div>
    </div>
  );
};

export default CheckFilteredTaskList;
