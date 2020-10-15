import { push } from "connected-react-router";
import {
  signInAction,
  signOutAction,
  taskRegistrationAction,
  taskDivisionAction,
  taskUpdateAction,
} from "./actions";
import { auth, db, FirebaseTimestamp } from "../../firebase";
import { Task, SmallTask } from "../users/types";

const usersRef = db.collection("users");

const fetchSignInUserInfo = async (
  uid: string,
  tasks: Task[],
  smallTasks: SmallTask[],
  dispatch: any
) => {
  const array: SmallTask[] = [];

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
                      updated_at: smallTaskData.updated_at,
                    } as SmallTask;
                    array.push(smallTask);
                  });

                  const taskData = snapshot.data();
                  const task = {
                    id: taskData.id,
                    contents: taskData.contents,
                    small_tasks: smallTasks.concat(array),
                    updated_at: taskData.updated_at,
                  } as Task;
                  tasks.push(task);
                  array.splice(0);
                } else {
                  const taskData = snapshot.data();
                  const task = {
                    id: taskData.id,
                    contents: taskData.contents,
                    small_tasks: [],
                    updated_at: taskData.updated_at,
                  } as Task;
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
          username: userData.username,
          email: userData.email,
          tasks,
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
        const tasks: Task[] = [];
        const smallTasks: SmallTask[] = [];

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
        const uid = result.user!.uid;
        const tasks: Task[] = [];
        const smallTasks: SmallTask[] = [];

        fetchSignInUserInfo(uid, tasks, smallTasks, dispatch);

        dispatch(push("/"));
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

export const signUp = (username: string, email: string, password: string) => {
  return async (dispatch: any) => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        const user = result.user;

        if (user) {
          const uid = user.uid;
          const timestamp = FirebaseTimestamp.now();
          const userInitialData = {
            uid,
            username,
            email,
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
                  username,
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

export const userUpdate = (uid: string, username: string, email: string) => {
  return async (dispatch: any) => {
    const timestamp = FirebaseTimestamp.now();

    auth
      .currentUser!.updateEmail(email)
      .then(() => {
        const data = {
          username,
          email,
          updated_at: timestamp,
        };

        usersRef
          .doc(uid)
          .set(data, { merge: true })
          .then(() => {
            dispatch(
              signInAction({
                username,
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

export const taskRegistration = (contents: string) => {
  return async (dispatch: any, getState: any) => {
    const timestamp = FirebaseTimestamp.now();
    const uid = getState().users.uid;
    const tasksRef = usersRef.doc(uid).collection("tasks");
    const id = tasksRef.doc().id;

    const taskInitialData = {
      id,
      contents,
      created_at: timestamp,
      updated_at: timestamp,
    };

    const taskState = {
      task: {
        id,
        contents,
        small_tasks: [],
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
};

export const taskDivision = (
  contents: string,
  taskId: string,
  taskIndex: number
) => {
  return async (dispatch: any, getState: any) => {
    const timestamp = FirebaseTimestamp.now();
    const uid = getState().users.uid as string;
    const tasks = getState().users.tasks as Task[];
    const smallTasksRef = usersRef
      .doc(uid)
      .collection("tasks")
      .doc(taskId)
      .collection("small_tasks");
    const id = smallTasksRef.doc().id;

    const smallTaskInitialData = {
      id,
      contents,
      created_at: timestamp,
      updated_at: timestamp,
    };

    const smallTask = {
      id,
      contents,
      updated_at: timestamp,
    };

    tasks[taskIndex].small_tasks.push(smallTask);

    smallTasksRef
      .doc(id)
      .set(smallTaskInitialData)
      .then(() => {
        dispatch(taskDivisionAction());
      })
      .catch((error) => {
        throw new Error(error);
      });
  };
};

export const taskUpdate = (
  contents: string,
  taskId: string,
  taskIndex: number
) => {
  return async (dispatch: any, getState: any) => {
    const timestamp = FirebaseTimestamp.now();
    const uid = getState().users.uid as string;
    const task = getState().users.tasks[taskIndex] as Task;
    const tasksRef = usersRef.doc(uid).collection("tasks");

    task.contents = contents;
    task.updated_at = timestamp;

    const taskData = {
      contents,
      updated_at: timestamp,
    };

    tasksRef
      .doc(taskId)
      .set(taskData, { merge: true })
      .then(() => {
        dispatch(taskUpdateAction());
        dispatch(push(`/task/detail/${taskId}`));
      })
      .catch((error) => {
        throw new Error(error);
      });
  };
};

export const smallTaskUpdate = (
  contents: string,
  taskId: string,
  taskIndex: number,
  smallTaskId: string,
  smallTaskIndex: number
) => {
  return async (dispatch: any, getState: any) => {
    const timestamp = FirebaseTimestamp.now();
    const uid = getState().users.uid as string;
    const task = getState().users.tasks[taskIndex] as Task;
    const smallTasksRef = usersRef
      .doc(uid)
      .collection("tasks")
      .doc(taskId)
      .collection("small_tasks");

    task.small_tasks[smallTaskIndex].contents = contents;
    task.small_tasks[smallTaskIndex].updated_at = timestamp;

    const smallTaskData = {
      contents,
      updated_at: timestamp,
    };

    smallTasksRef
      .doc(smallTaskId)
      .set(smallTaskData, { merge: true })
      .then(() => {
        dispatch(taskUpdateAction());
        dispatch(push(`/task/detail/${taskId}`));
      })
      .catch((error) => {
        throw new Error(error);
      });
  };
};
