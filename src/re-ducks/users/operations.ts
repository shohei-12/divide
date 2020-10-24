import { push } from "connected-react-router";
import {
  signInAction,
  signOutAction,
  taskRegistrationAction,
  taskNonPayloadAction,
  themeToggleAction,
} from "./actions";
import { auth, db, FirebaseTimestamp } from "../../firebase";
import { TaskState, SmallTaskState } from "../users/types";

const usersRef = db.collection("users");

const fetchSignInUserInfo = async (
  uid: string,
  tasks: TaskState[],
  smallTasks: SmallTaskState[],
  dispatch: any
) => {
  const array: SmallTaskState[] = [];

  await usersRef
    .doc(uid)
    .get()
    .then(async (snapshot) => {
      const userData = snapshot.data()!;

      await usersRef
        .doc(uid)
        .collection("tasks")
        .orderBy("updated_at", "desc")
        .get()
        .then(async (snapshots) => {
          for (const snapshot of snapshots.docs) {
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
                    array.push(smallTask);
                  });

                  const taskData = snapshot.data();
                  const task = {
                    id: taskData.id,
                    contents: taskData.contents,
                    small_tasks: smallTasks.concat(array),
                    deadline: taskData.deadline,
                    checked: taskData.checked,
                    priority: taskData.priority,
                    updated_at: taskData.updated_at,
                  } as TaskState;
                  tasks.push(task);
                  array.splice(0);
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
        })
        .catch((error) => {
          throw new Error(error);
        });

      dispatch(
        signInAction({
          uid,
          email: userData.email,
          tasks,
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
        const uid = user.uid;
        const tasks: TaskState[] = [];
        const smallTasks: SmallTaskState[] = [];

        fetchSignInUserInfo(uid, tasks, smallTasks, dispatch);
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
          const uid = user.uid;
          const tasks: TaskState[] = [];
          const smallTasks: SmallTaskState[] = [];

          fetchSignInUserInfo(uid, tasks, smallTasks, dispatch);

          dispatch(push("/"));
        }
      })
      .catch(() => {
        alert("入力されたメールアドレスまたはパスワードに誤りがあります。");
      });
  };
};

export const guestSignIn = () => {
  return async (dispatch: any) => {
    auth
      .signInWithEmailAndPassword("guest@example.com", "password")
      .then(async (result) => {
        const user = result.user;
        if (user) {
          const uid = user.uid;
          const tasks: TaskState[] = [];
          const smallTasks: SmallTaskState[] = [];

          fetchSignInUserInfo(uid, tasks, smallTasks, dispatch);

          dispatch(push("/"));
        }
      })
      .catch((error) => {
        throw new Error(error);
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
    const timestamp = FirebaseTimestamp.now();
    const uid = getState().users.uid;
    const tasksRef = usersRef.doc(uid).collection("tasks");
    const id = tasksRef.doc().id;

    const saveTaskData = (val: firebase.firestore.Timestamp | null) => {
      const taskInitialData = {
        id,
        contents,
        deadline: val,
        checked: false,
        priority: 0,
        created_at: timestamp,
        updated_at: timestamp,
      };

      const taskState = {
        task: {
          id,
          contents,
          small_tasks: [],
          deadline: val,
          checked: false,
          priority: 0,
          updated_at: timestamp,
        },
      };

      tasksRef
        .doc(id)
        .set(taskInitialData)
        .then(() => {
          dispatch(taskRegistrationAction(taskState));
          dispatch(push("/"));
        })
        .catch((error) => {
          throw new Error(error);
        });
    };

    if (deadline) {
      saveTaskData(FirebaseTimestamp.fromDate(deadline));
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

    const saveSmallTaskData = (val: firebase.firestore.Timestamp | null) => {
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
      saveSmallTaskData(FirebaseTimestamp.fromDate(deadline));
    } else {
      saveSmallTaskData(deadline);
    }
  };
};

export const taskUpdate = (
  contents: string,
  taskId: string,
  taskIndex: number,
  deadline: Date | null
) => {
  return async (dispatch: any, getState: any) => {
    const timestamp = FirebaseTimestamp.now();
    const uid = getState().users.uid as string;
    const task = getState().users.tasks[taskIndex] as TaskState;
    const tasksRef = usersRef.doc(uid).collection("tasks");

    task.contents = contents;
    task.updated_at = timestamp;

    const updateTaskData = (val: firebase.firestore.Timestamp | null) => {
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
      updateTaskData(FirebaseTimestamp.fromDate(deadline));
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

    const updateSmallTaskData = (val: firebase.firestore.Timestamp | null) => {
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
      updateSmallTaskData(FirebaseTimestamp.fromDate(deadline));
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

export const fetchTasks = (uid: string, value: number) => {
  return async (dispatch: any, getState: any) => {
    const firstTaskNum = value * 6 - 5;
    const tasks: TaskState[] = [];
    usersRef
      .doc(uid)
      .collection("tasks")
      .orderBy("created_at", "desc")
      .get()
      .then((snapshots) => {
        const taskOnPage = snapshots.docs.slice(
          firstTaskNum - 1,
          firstTaskNum + 5
        );
        taskOnPage.forEach((snapshot) => {
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
};
