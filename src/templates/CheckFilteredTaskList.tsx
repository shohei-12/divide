import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { State } from "../re-ducks/store/types";
import { getUserId } from "../re-ducks/users/selectors";
import { fetchTasksOnPageN } from "../re-ducks/users/operations";
import { Tasks } from "../components/Tasks";
import { db } from "../firebase";

const CheckFilteredTaskList: React.FC = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state: State) => state);
  const uid = getUserId(selector);
  const checkedStr = window.location.pathname.split("/")[3];
  const pageStr = window.location.pathname.split("/")[5];
  let checked: boolean | undefined = undefined;
  const page = pageStr ? parseInt(pageStr) : 1;

  switch (checkedStr) {
    case "finished":
      checked = true;
      break;
    case "unfinished":
      checked = false;
  }

  const [taskCount, setTaskCount] = useState(0);

  const handleChange = useCallback(
    (event: React.ChangeEvent<unknown>, page: number) => {
      dispatch(push(`/task/check/${checkedStr}/page/${page}`));
    },
    [dispatch, checkedStr]
  );

  const countTask = useCallback(() => {
    if (checked !== undefined) {
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
    }
  }, [checked, uid]);

  useEffect(() => {
    if (window.location.pathname.split("/")[4] === "page") {
      dispatch(fetchTasksOnPageN(uid, page, checked, null));
      countTask();
    } else {
      dispatch(fetchTasksOnPageN(uid, 1, checked, null));
      countTask();
    }
  }, [dispatch, uid, checked, page, countTask]);

  return (
    <Tasks page={page} taskCount={taskCount} handleChange={handleChange} />
  );
};

export default CheckFilteredTaskList;
