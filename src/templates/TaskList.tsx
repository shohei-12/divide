import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../re-ducks/store/types";
import { getUserId } from "../re-ducks/users/selectors";
import { fetchTasksOnPageN } from "../re-ducks/users/operations";
import { Tasks } from "../components/Tasks";
import { db } from "../firebase";

const TaskList: React.FC = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state: State) => state);
  const uid = getUserId(selector);

  const [taskCount, setTaskCount] = useState(0);

  const handleChange = useCallback(
    (event: React.ChangeEvent<unknown>, page: number) => {
      dispatch(fetchTasksOnPageN(uid, page, null, null));
    },
    [dispatch, uid]
  );

  useEffect(() => {
    dispatch(fetchTasksOnPageN(uid, 1, null, null));
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
  }, [dispatch, uid]);

  return <Tasks taskCount={taskCount} handleChange={handleChange} />;
};

export default TaskList;
