import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../re-ducks/store/types";
import { getUserId } from "../re-ducks/users/selectors";
import { fetchTasksOnPageN } from "../re-ducks/users/operations";
import { Tasks } from "../components/Tasks";
import { db } from "../firebase";

const CheckFilteredTaskList: React.FC = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state: State) => state);
  const uid = getUserId(selector);
  let checked: boolean | undefined = undefined;

  switch (window.location.pathname.split("/")[3]) {
    case "finished":
      checked = true;
      break;
    case "unfinished":
      checked = false;
  }

  const [taskCount, setTaskCount] = useState(0);

  const handleChange = useCallback(
    (event: React.ChangeEvent<unknown>, page: number) => {
      dispatch(fetchTasksOnPageN(uid, page, checked, null));
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

  return <Tasks taskCount={taskCount} handleChange={handleChange} />;
};

export default CheckFilteredTaskList;
