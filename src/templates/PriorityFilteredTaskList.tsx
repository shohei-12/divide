import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { State } from "../re-ducks/store/types";
import { getUserId } from "../re-ducks/users/selectors";
import { fetchTasksOnPageN } from "../re-ducks/users/operations";
import { Tasks } from "../components/Tasks";
import { db } from "../firebase";

const PriorityFilteredTaskList: React.FC = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state: State) => state);
  const uid = getUserId(selector);
  const priorityStr = window.location.pathname.split("/")[3];
  const pageStr = window.location.pathname.split("/")[5];
  let priority: number = -1;
  const page = pageStr ? parseInt(pageStr) : 1;

  switch (priorityStr) {
    case "none":
      priority = 0;
      break;
    case "high":
      priority = 1;
      break;
    case "medium":
      priority = 2;
      break;
    case "low":
      priority = 3;
  }

  const [taskCount, setTaskCount] = useState(0);

  const handleChange = useCallback(
    (event: React.ChangeEvent<unknown>, page: number) => {
      dispatch(push(`/task/priority/${priorityStr}/page/${page}`));
    },
    [dispatch, priorityStr]
  );

  const countTask = useCallback(() => {
    if (priority !== -1) {
      db.collection("users")
        .doc(uid)
        .collection("tasks")
        .get()
        .then((snapshots) => {
          switch (priority) {
            case 0:
              setTaskCount(
                snapshots.docs.filter(
                  (snapshot) => snapshot.data().priority === 0
                ).length
              );
              break;
            case 1:
              setTaskCount(
                snapshots.docs.filter(
                  (snapshot) => snapshot.data().priority === 1
                ).length
              );
              break;
            case 2:
              setTaskCount(
                snapshots.docs.filter(
                  (snapshot) => snapshot.data().priority === 2
                ).length
              );
              break;
            case 3:
              setTaskCount(
                snapshots.docs.filter(
                  (snapshot) => snapshot.data().priority === 3
                ).length
              );
          }
        })
        .catch((error) => {
          throw new Error(error);
        });
    }
  }, [priority, uid]);

  useEffect(() => {
    if (window.location.pathname.split("/")[4] === "page") {
      dispatch(fetchTasksOnPageN(uid, page, null, priority));
      countTask();
    } else {
      dispatch(fetchTasksOnPageN(uid, 1, null, priority));
      countTask();
    }
  }, [dispatch, uid, priority, page, countTask]);

  return (
    <Tasks page={page} taskCount={taskCount} handleChange={handleChange} />
  );
};

export default PriorityFilteredTaskList;
