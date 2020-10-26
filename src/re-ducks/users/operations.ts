import { push } from "connected-react-router";
import {
  signInAction,
  signOutAction,
  taskNonPayloadAction,
  themeToggleAction,
} from "./actions";
import { auth, db, FirebaseTimestamp } from "../../firebase";
import { TaskState, SmallTaskState } from "../users/types";
import firebase from "firebase/app";

const usersRef = db.collection("users");

const getTasksRef = (uid: string) => usersRef.doc(uid).collection("tasks");

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
      .then(async (result) => {
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

export const signUp = (email: string, password: string) => {
  return async (dispatch: any, getState: any) => {
    const theme = getState().users.theme as string;

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        const user = result.user;

        if (user) {
          const uid = user.uid;
          const timestamp = FirebaseTimestamp.now();
          const userInitialData = {
            uid,
            email,
            theme,
            created_at: timestamp,
            updated_at: timestamp,
          };

          usersRef
            .doc(uid)
            .set(userInitialData)
            .then(() => {
              dispatch(
                signInAction({
                  uid,
                  email,
                })
              );

              dispatch(push("/"));
            })
            .catch((error) => {
              throw new Error(error);
            });
        }
      })
      .catch((error) => {
        throw new Error(error);
      });
  };
};

export const userUpdate = (uid: string, email: string) => {
  return async (dispatch: any) => {
    const timestamp = FirebaseTimestamp.now();

    auth
      .currentUser!.updateEmail(email)
      .then(() => {
        const data = {
          email,
          updated_at: timestamp,
        };

        usersRef
          .doc(uid)
          .set(data, { merge: true })
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

export const taskRegistration = (contents: string, deadline: Date | null) => {
  return async (dispatch: any, getState: any) => {
    const timestamp = FirebaseTimestamp.now().toDate().toString();
    const uid = getState().users.uid as string;
    const tasksRef = getTasksRef(uid);
    const id = tasksRef.doc().id;

    const saveTaskData = (val: string | null) => {
      const taskInitialData = {
        id,
        contents,
        deadline: val,
        checked: false,
        priority: 0,
        created_at: timestamp,
        updated_at: timestamp,
      };

      getState().users.tasks = {
        id,
        contents,
        small_tasks: [],
        deadline: val,
        checked: false,
        priority: 0,
        updated_at: timestamp,
      };

      tasksRef
        .doc(id)
        .set(taskInitialData)
        .then(() => {
          dispatch(taskNonPayloadAction);
          dispatch(push("/"));
        })
        .catch((error) => {
          throw new Error(error);
        });
    };

    if (deadline) {
      saveTaskData(deadline.toString());
    } else {
      saveTaskData(deadline);
    }
  };
};

export const taskDivision = (
  contents: string,
  taskId: string,
  smallTaskId: string | null,
  taskIndex: number,
  deadline: Date | null
) => {
  return async (dispatch: any, getState: any) => {
    const timestamp = FirebaseTimestamp.now();
    const uid = getState().users.uid as string;
    const tasks = getState().users.tasks as TaskState[];
    const smallTasksRef = usersRef
      .doc(uid)
      .collection("tasks")
      .doc(taskId)
      .collection("small_tasks");
    const id = smallTasksRef.doc().id;

    const setSmallTaskInitialData = (
      smallTaskInitialData: SmallTaskState,
      smallTask: SmallTaskState
    ) => {
      tasks[taskIndex].small_tasks.push(smallTask);

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

export const taskUpdate = (
  contents: string,
  taskId: string,
  deadline: Date | null
) => {
  return async (dispatch: any, getState: any) => {
    const timestamp = FirebaseTimestamp.now().toDate().toString();
    const uid = getState().users.uid as string;
    const tasks = getState().users.tasks as TaskState[];
    const task = tasks.find((ele) => ele.id === taskId)!;
    const tasksRef = getTasksRef(uid);

    task.contents = contents;
    task.updated_at = timestamp;

    const updateTaskData = (val: string | null) => {
      task.deadline = val;

      const taskData = {
        contents,
        deadline: val,
        updated_at: timestamp,
      };

      tasksRef
        .doc(taskId)
        .set(taskData, { merge: true })
        .then(() => {
          dispatch(taskNonPayloadAction());
          dispatch(push(`/task/detail/${taskId}`));
        })
        .catch((error) => {
          throw new Error(error);
        });
    };

    if (deadline) {
      updateTaskData(deadline.toString());
    } else {
      updateTaskData(deadline);
    }
  };
};

export const smallTaskUpdate = (
  contents: string,
  taskId: string,
  taskIndex: number,
  smallTaskId: string,
  smallTaskIndex: number,
  deadline: Date | null
) => {
  return async (dispatch: any, getState: any) => {
    const timestamp = FirebaseTimestamp.now();
    const uid = getState().users.uid as string;
    const task = getState().users.tasks[taskIndex] as TaskState;
    const smallTasksRef = usersRef
      .doc(uid)
      .collection("tasks")
      .doc(taskId)
      .collection("small_tasks");

    task.small_tasks[smallTaskIndex].contents = contents;
    task.small_tasks[smallTaskIndex].updated_at = timestamp;

    const updateSmallTaskData = (val: string | null) => {
      task.small_tasks[smallTaskIndex].deadline = val;

      const smallTaskData = {
        contents,
        deadline: val,
        updated_at: timestamp,
      };

      smallTasksRef
        .doc(smallTaskId)
        .set(smallTaskData, { merge: true })
        .then(() => {
          dispatch(taskNonPayloadAction());
          dispatch(push(`/task/detail/${taskId}`));
        })
        .catch((error) => {
          throw new Error(error);
        });
    };

    if (deadline) {
      updateSmallTaskData(deadline.toString());
    } else {
      updateSmallTaskData(deadline);
    }
  };
};

export const taskDelete = (taskId: string) => {
  return async (dispatch: any, getState: any) => {
    const uid = getState().users.uid as string;
    const tasks = getState().users.tasks as TaskState[];
    const tasksRef = usersRef.doc(uid).collection("tasks");

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
  };
};

export const smallTaskDelete = (taskId: string, smallTaskId: string) => {
  return async (dispatch: any, getState: any) => {
    const uid = getState().users.uid as string;
    const tasks = getState().users.tasks as TaskState[];
    const task = tasks.find((element) => element.id === taskId)!;
    const smallTasksRef = usersRef
      .doc(uid)
      .collection("tasks")
      .doc(taskId)
      .collection("small_tasks");

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
  };
};

export const taskCheckToggle = (
  check: boolean,
  taskId: string,
  smallTaskId: string | null
) => {
  return async (dispatch: any, getState: any) => {
    const timestamp = FirebaseTimestamp.now();
    const uid = getState().users.uid as string;
    const tasks = getState().users.tasks as TaskState[];
    const task = tasks.find((element) => element.id === taskId)!;

    const taskData = {
      checked: check,
      updated_at: timestamp,
    };

    if (smallTaskId) {
      const smallTask = task.small_tasks.find(
        (element) => element.id === smallTaskId
      )!;
      const smallTasksRef = usersRef
        .doc(uid)
        .collection("tasks")
        .doc(taskId)
        .collection("small_tasks");

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
      const tasksRef = usersRef.doc(uid).collection("tasks");

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

export const themeToggle = (theme: string) => {
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
          dispatch(themeToggleAction(themeData));
        })
        .catch((error) => {
          throw new Error(error);
        });
    } else {
      dispatch(themeToggleAction(themeData));
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
    const task = tasks.find((element) => element.id === taskId)!;

    const taskData = {
      priority,
    };

    if (smallTaskId) {
      const smallTask = task.small_tasks.find(
        (element) => element.id === smallTaskId
      )!;
      const smallTasksRef = usersRef
        .doc(uid)
        .collection("tasks")
        .doc(taskId)
        .collection("small_tasks");

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
      const tasksRef = usersRef.doc(uid).collection("tasks");

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
  getState: any
) => {
  const tasks: TaskState[] = [];

  usersRef
    .doc(uid)
    .collection("tasks")
    .orderBy("created_at", "desc")
    .get()
    .then((snapshots) => {
      const tasksOnPageN = snapshots.docs.slice(start, end);

      tasksOnPageN.forEach((snapshot) => {
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
      });
      getState().users.tasks = tasks;
      dispatch(taskNonPayloadAction());
    })
    .catch((error) => {
      throw new Error(error);
    });
};

export const fetchTasksOnPageN = (uid: string, value: number) => {
  return async (dispatch: any, getState: any) => {
    const firstTaskNum = value * 6 - 5;
    fetchSomeTasks(uid, firstTaskNum - 1, firstTaskNum + 5, dispatch, getState);
  };
};

export const fetchTasksOnPage1 = (uid: string) => {
  return async (dispatch: any, getState: any) => {
    fetchSomeTasks(uid, 0, 6, dispatch, getState);
  };
};
