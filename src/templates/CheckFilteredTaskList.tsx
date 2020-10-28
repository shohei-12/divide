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
import Logo from "../assets/img/icons/logo.png";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrap: {
      paddingBottom: 60,
    },
    tasks: {
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
    pagination: {
      marginTop: 30,
    },
    noTask: {
      marginTop: 40,
      textAlign: "center",
    },
    logo: {
      display: "block",
      margin: "0 auto",
      position: "relative",
      left: -3,
    },
    taskRegistration: {
      display: "inline-block",
      color: "#0044CC",
      fontSize: 40,
      textDecoration: "underline",
    },
    fab: {
      position: "fixed",
      right: 30,
      bottom: 30,
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
      {tasks.length > 0 ? (
        <>
          <div className={classes.tasks}>
            {tasks.map((task, index) => (
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
          </div>
          <Pagination
            className={classes.pagination}
            count={calcPage(taskCount)}
            color="primary"
            onChange={handleChange}
          />
        </>
      ) : (
        <div className={classes.noTask}>
          <img
            className={classes.logo}
            src={Logo}
            alt="App Logo"
            width="350px"
            height="350px"
          />
          <p
            className={`${classes.taskRegistration} pointer-h`}
            onClick={goTaskRegistration}
          >
            タスクを登録する
          </p>
        </div>
      )}
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
    </div>
  );
};

export default CheckFilteredTaskList;
