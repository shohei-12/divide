import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { State } from "../../re-ducks/store/types";
import { getTasks } from "../../re-ducks/users/selectors";
import { Task } from ".";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import Hidden from "@material-ui/core/Hidden";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Logo from "../../assets/img/icons/logo.png";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
      left: -2,
      width: 250,
      height: 250,
      [theme.breakpoints.up("sm")]: {
        width: 350,
        height: 350,
      },
    },
    taskRegistration: {
      color: "#0044CC",
      fontSize: 32,
      textDecoration: "underline",
    },
    fab: {
      position: "fixed",
      right: 30,
      bottom: 30,
    },
  })
);

type Props = {
  page: number;
  taskCount: number;
  handleChange: (event: React.ChangeEvent<unknown>, page: number) => void;
};

const Tasks: React.FC<Props> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selector = useSelector((state: State) => state);
  const tasks = getTasks(selector);

  const goTaskRegistration = useCallback(() => {
    dispatch(push("/task/registration"));
  }, [dispatch]);

  const handleChange = props.handleChange;

  const calcPage = (taskCount: number) => {
    if (taskCount % 6 === 0) {
      return taskCount / 6;
    } else {
      return ((taskCount / 6) | 0) + 1;
    }
  };

  return (
    <>
      {tasks.length > 0 ? (
        <>
          <div className={classes.tasks}>
            {tasks.map((task, index) => (
              <div key={index} className={classes.task}>
                <Task
                  smallTaskLength={
                    task.small_tasks.filter((ele) => ele.parentId === null)
                      .length
                  }
                  task={task}
                />
              </div>
            ))}
          </div>
          <Pagination
            className={classes.pagination}
            count={calcPage(props.taskCount)}
            page={props.page}
            color="primary"
            onChange={handleChange}
          />
        </>
      ) : (
        <div className={classes.noTask}>
          <img className={classes.logo} src={Logo} alt="App Logo" />
          <p
            className={`${classes.taskRegistration} inline-block pointer-h`}
            onClick={goTaskRegistration}
          >
            タスクを登録する
          </p>
        </div>
      )}
      <Hidden smUp>
        <Fab
          className={classes.fab}
          color="secondary"
          aria-label="タスクの登録"
          onClick={goTaskRegistration}
        >
          <AddIcon />
        </Fab>
      </Hidden>
    </>
  );
};

export default Tasks;
