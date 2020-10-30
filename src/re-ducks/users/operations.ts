import { push } from "connected-react-router";
import {
  signInAction,
  signOutAction,
  taskNonPayloadAction,
  toggleThemeAction,
} from "./actions";
import { auth, db, FirebaseTimestamp } from "../../firebase";
import { TaskState, SmallTaskState } from "../users/types";
import firebase from "firebase/app";

const usersRef = db.collection("users");

const getTasksRef = (uid: string) => usersRef.doc(uid).collection("tasks");

const getSmallTasksRef = (uid: string, taskId: string) =>
  usersRef.doc(uid).collection("tasks").doc(taskId).collection("small_tasks");

const getTimestamp = () => FirebaseTimestamp.now().toDate().toString();

const dispatchSignInAction = (user: firebase.User, dispatch: any) => {
  const uid = user.uid;

  usersRef
    .doc(uid)
    .get()
    .then((snapshot) => {
      const userData = snapshot.data()!;

      dispatch(
        signInAction({
          uid,
          email: userData.email,
          theme: userData.theme,
        })
      );
    })
    .catch((error) => {
      throw new Error(error);
    });
};

export const listenAuthState = () => {
  return async (dispatch: any) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        dispatchSignInAction(user, dispatch);
      } else {
        dispatch(push("/signin"));
      }
    });
  };
};

export const signIn = (email: string, password: string) => {
  return async (dispatch: any) => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        const user = result.user;
        if (user) {
          dispatchSignInAction(user, dispatch);

          dispatch(push("/"));
        }
      })
      .catch(() => {
        alert("入力されたメールアドレスまたはパスワードに誤りがあります。");
      });
  };
};

export const signOut = () => {
  return async (dispatch: any) => {
    auth
      .signOut()
      .then(() => {
        dispatch(signOutAction());
        dispatch(push("/signin"));
      })
      .catch((error) => {
        throw new Error(error);
      });
  };
};

export const updateUser = (uid: string, email: string) => {
  return async (dispatch: any) => {
    const timestamp = getTimestamp();

    auth
      .currentUser!.updateEmail(email)
      .then(() => {
        const userUpdateData = {
          email,
          updated_at: timestamp,
        };

        usersRef
          .doc(uid)
          .set(userUpdateData, { merge: true })
          .then(() => {
            dispatch(
              signInAction({
                email,
              })
            );

            dispatch(push("/"));
          })
          .catch((error) => {
            throw new Error(error);
          });
      })
      .catch((error) => {
        throw new Error(error);
      });
  };
};

export const divideTask = (
  contents: string,
  taskId: string,
  smallTaskId: string | null,
  deadline: Date | null
) => {
  return async (dispatch: any, getState: any) => {
    const timestamp = getTimestamp();
    const uid = getState().users.uid as string;
    const tasks = getState().users.tasks as TaskState[];
    const task = tasks.find((ele) => ele.id === taskId)!;
    const smallTasksRef = getSmallTasksRef(uid, taskId);
    const id = smallTasksRef.doc().id;

    const setSmallTaskInitialData = (
      smallTaskInitialData: SmallTaskState,
      smallTask: SmallTaskState
    ) => {
      task.small_tasks.push(smallTask);

      smallTasksRef
        .doc(id)
        .set(smallTaskInitialData)
        .then(() => {
          dispatch(taskNonPayloadAction());
        })
        .catch((error) => {
          throw new Error(error);
        });
    };

    const saveSmallTaskData = (val: string | null) => {
      if (smallTaskId) {
        const smallTaskInitialData = {
          id,
          contents,
          deadline: val,
          checked: false,
          priority: 0,
          parentId: smallTaskId,
          created_at: timestamp,
          updated_at: timestamp,
        };

        const smallTask = {
          id,
          contents,
          deadline: val,
          checked: false,
          priority: 0,
          parentId: smallTaskId,
          updated_at: timestamp,
        };

        setSmallTaskInitialData(smallTaskInitialData, smallTask);
      } else {
        const smallTaskInitialData = {
          id,
          contents,
          deadline: val,
          checked: false,
          priority: 0,
          parentId: null,
          created_at: timestamp,
          updated_at: timestamp,
        };

        const smallTask = {
          id,
          contents,
          deadline: val,
          checked: false,
          priority: 0,
          parentId: null,
          updated_at: timestamp,
        };

        setSmallTaskInitialData(smallTaskInitialData, smallTask);
      }
    };

    if (deadline) {
      saveSmallTaskData(deadline.toString());
    } else {
      saveSmallTaskData(deadline);
    }
  };
};

export const updateTask = (
  contents: string,
  taskId: string,
  smallTaskId: string | null,
  deadline: Date | null
) => {
  return async (dispatch: any, getState: any) => {
    const timestamp = getTimestamp();
    const uid = getState().users.uid as string;
    const tasks = getState().users.tasks as TaskState[];
    const task = tasks.find((ele) => ele.id === taskId)!;

    const updateTaskData = (val: string | null) => {
      const taskData = {
        contents,
        deadline: val,
        updated_at: timestamp,
      };

      if (smallTaskId) {
        const smallTasksRef = getSmallTasksRef(uid, taskId);
        const smallTask = task.small_tasks.find(
          (ele) => ele.id === smallTaskId
        )!;

        smallTask.contents = contents;
        smallTask.updated_at = timestamp;
        smallTask.deadline = val;

        smallTasksRef
          .doc(smallTaskId)
          .set(taskData, { merge: true })
          .then(() => {
            dispatch(taskNonPayloadAction());
          })
          .catch((error) => {
            throw new Error(error);
          });
      } else {
        const tasksRef = getTasksRef(uid);

        task.contents = contents;
        task.updated_at = timestamp;
        task.deadline = val;

        tasksRef
          .doc(taskId)
          .set(taskData, { merge: true })
          .then(() => {
            dispatch(taskNonPayloadAction());
          })
          .catch((error) => {
            throw new Error(error);
          });
      }
    };

    if (deadline) {
      updateTaskData(deadline.toString());
    } else {
      updateTaskData(deadline);
    }
  };
};

export const deleteTask = (taskId: string, smallTaskId: string | null) => {
  return async (dispatch: any, getState: any) => {
    const uid = getState().users.uid as string;
    const tasks = getState().users.tasks as TaskState[];
    const tasksRef = getTasksRef(uid);

    if (smallTaskId) {
      const task = tasks.find((ele) => ele.id === taskId)!;
      const smallTasksRef = getSmallTasksRef(uid, taskId);

      task.small_tasks = task.small_tasks.filter(
        (smallTask) => smallTask.id !== smallTaskId
      );

      smallTasksRef
        .doc(smallTaskId)
        .delete()
        .then(() => {
          dispatch(taskNonPayloadAction());
        })
        .catch((error) => {
          throw new Error(error);
        });
    } else {
      getState().users.tasks = tasks.filter((task) => task.id !== taskId);

      tasksRef
        .doc(taskId)
        .delete()
        .then(() => {
          dispatch(taskNonPayloadAction());
          dispatch(push("/"));
        })
        .catch((error) => {
          throw new Error(error);
        });
    }
  };
};

export const toggleTaskCheck = (
  check: boolean,
  taskId: string,
  smallTaskId: string | null
) => {
  return async (dispatch: any, getState: any) => {
    const timestamp = getTimestamp();
    const uid = getState().users.uid as string;
    const tasks = getState().users.tasks as TaskState[];
    const task = tasks.find((ele) => ele.id === taskId)!;

    const taskData = {
      checked: check,
      updated_at: timestamp,
    };

    if (smallTaskId) {
      const smallTask = task.small_tasks.find((ele) => ele.id === smallTaskId)!;
      const smallTasksRef = getSmallTasksRef(uid, taskId);

      smallTask.checked = check;

      smallTasksRef
        .doc(smallTaskId)
        .set(taskData, { merge: true })
        .then(() => {
          dispatch(taskNonPayloadAction());
        })
        .catch((error) => {
          throw new Error(error);
        });
    } else {
      const tasksRef = getTasksRef(uid);

      task.checked = check;

      tasksRef
        .doc(taskId)
        .set(taskData, { merge: true })
        .then(() => {
          dispatch(taskNonPayloadAction());
        })
        .catch((error) => {
          throw new Error(error);
        });
    }
  };
};

export const toggleTheme = (theme: string) => {
  return async (dispatch: any, getState: any) => {
    const uid = getState().users.uid as string;

    const themeData = {
      theme,
    };

    if (uid) {
      usersRef
        .doc(uid)
        .set(themeData, { merge: true })
        .then(() => {
          dispatch(toggleThemeAction(themeData));
        })
        .catch((error) => {
          throw new Error(error);
        });
    } else {
      dispatch(toggleThemeAction(themeData));
    }
  };
};

export const setPriority = (
  taskId: string,
  smallTaskId: string | null,
  priority: number
) => {
  return async (dispatch: any, getState: any) => {
    const uid = getState().users.uid as string;
    const tasks = getState().users.tasks as TaskState[];
    const task = tasks.find((ele) => ele.id === taskId)!;

    const taskData = {
      priority,
    };

    if (smallTaskId) {
      const smallTask = task.small_tasks.find((ele) => ele.id === smallTaskId)!;
      const smallTasksRef = getSmallTasksRef(uid, taskId);

      smallTask.priority = priority;

      smallTasksRef
        .doc(smallTaskId)
        .set(taskData, { merge: true })
        .then(() => {
          dispatch(taskNonPayloadAction());
        })
        .catch((error) => {
          throw new Error(error);
        });
    } else {
      const tasksRef = getTasksRef(uid);

      task.priority = priority;

      tasksRef
        .doc(taskId)
        .set(taskData, { merge: true })
        .then(() => {
          dispatch(taskNonPayloadAction());
        })
        .catch((error) => {
          throw new Error(error);
        });
    }
  };
};

const fetchSomeTasks = (
  uid: string,
  start: number,
  end: number,
  dispatch: any,
  getState: any,
  checked: boolean | null | undefined,
  priority: number | null
) => {
  const tasks: TaskState[] = [];
  const tasksRef = getTasksRef(uid);
  const smallTasks: SmallTaskState[] = [];
  const array: any[] = [];
  let filteredTaskDocs: firebase.firestore.QueryDocumentSnapshot<
    firebase.firestore.DocumentData
  >[] = [];

  tasksRef
    .orderBy("created_at", "desc")
    .get()
    .then(async (snapshots) => {
      if (checked !== null) {
        switch (checked) {
          case true:
            filteredTaskDocs = snapshots.docs.filter(
              (snapshot) => snapshot.data().checked === true
            );
            break;
          case false:
            filteredTaskDocs = snapshots.docs.filter(
              (snapshot) => snapshot.data().checked === false
            );
        }
      }

      if (priority !== null) {
        switch (priority) {
          case 0:
            filteredTaskDocs = snapshots.docs.filter(
              (snapshot) => snapshot.data().priority === 0
            );
            break;
          case 1:
            filteredTaskDocs = snapshots.docs.filter(
              (snapshot) => snapshot.data().priority === 1
            );
            break;
          case 2:
            filteredTaskDocs = snapshots.docs.filter(
              (snapshot) => snapshot.data().priority === 2
            );
            break;
          case 3:
            filteredTaskDocs = snapshots.docs.filter(
              (snapshot) => snapshot.data().priority === 3
            );
        }
      }

      const taskDocsOnPageN =
        checked === null && priority === null
          ? snapshots.docs.slice(start, end)
          : filteredTaskDocs.slice(start, end);

      for (const snapshot of taskDocsOnPageN) {
        await snapshot.ref
          .collection("small_tasks")
          .orderBy("created_at", "asc")
          .get()
          .then((snapshots) => {
            if (snapshots.docs.length > 0) {
              snapshots.forEach((snapshot) => {
                const smallTaskData = snapshot.data();
                const smallTask = {
                  id: smallTaskData.id,
                  contents: smallTaskData.contents,
                  deadline: smallTaskData.deadline,
                  checked: smallTaskData.checked,
                  priority: smallTaskData.priority,
                  parentId: smallTaskData.parentId,
                  updated_at: smallTaskData.updated_at,
                } as SmallTaskState;
                smallTasks.push(smallTask);
              });
              const taskData = snapshot.data();
              const task = {
                id: taskData.id,
                contents: taskData.contents,
                small_tasks: array.concat(smallTasks),
                deadline: taskData.deadline,
                checked: taskData.checked,
                priority: taskData.priority,
                updated_at: taskData.updated_at,
              } as TaskState;
              tasks.push(task);
              smallTasks.splice(0);
            } else {
              const taskData = snapshot.data();
              const task = {
                id: taskData.id,
                contents: taskData.contents,
                small_tasks: [],
                deadline: taskData.deadline,
                checked: taskData.checked,
                priority: taskData.priority,
                updated_at: taskData.updated_at,
              } as TaskState;
              tasks.push(task);
            }
          })
          .catch((error) => {
            throw new Error(error);
          });
      }

      getState().users.tasks = tasks;
      dispatch(taskNonPayloadAction());
    })
    .catch((error) => {
      throw new Error(error);
    });
};

export const fetchTasksOnPageN = (
  uid: string,
  page: number,
  checked: boolean | null | undefined,
  priority: number | null
) => {
  return async (dispatch: any, getState: any) => {
    const firstTaskNum = page * 6 - 5;
    fetchSomeTasks(
      uid,
      firstTaskNum - 1,
      firstTaskNum + 5,
      dispatch,
      getState,
      checked,
      priority
    );
  };
};
