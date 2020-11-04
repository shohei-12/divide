import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { State } from "../re-ducks/store/types";
import { getUserId } from "../re-ducks/users/selectors";
import { fetchTasksOnPageN } from "../re-ducks/users/operations";
import { Tasks } from "../components/Tasks";
import { db } from "../firebase";

const TaskList: React.FC = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state: State) => state);
  const uid = getUserId(selector);
  const pageStr = window.location.pathname.split("/")[2];
  const page = pageStr ? parseInt(pageStr) : 1;

  const [taskCount, setTaskCount] = useState(0);

  const handleChange = useCallback(
    (event: React.ChangeEvent<unknown>, page: number) => {
      dispatch(push(`/page/${page}`));
    },
    [dispatch]
  );

  const countTask = useCallback(() => {
    db.collection("users")
      .doc(uid)
      .collection("tasks")
      .get()
      .then((snapshots) => {
        setTaskCount(snapshots.size);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [uid]);

  useEffect(() => {
    if (window.location.pathname.split("/")[1] === "page") {
      dispatch(fetchTasksOnPageN(uid, page, null, null));
      countTask();
    } else {
      dispatch(fetchTasksOnPageN(uid, 1, null, null));
      countTask();
    }
  }, [dispatch, uid, page, countTask]);

  return (
    <Tasks page={page} taskCount={taskCount} handleChange={handleChange} />
  );
};

export default TaskList;
