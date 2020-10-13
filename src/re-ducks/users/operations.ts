import { push } from "connected-react-router";
import { signInAction, signOutAction, taskRegistrationAction } from "./actions";
import { auth, db, FirebaseTimestamp } from "../../firebase";
import { Task } from "../users/types";

const usersRef = db.collection("users");

const fetchSignInUserInfo = async (
  uid: string,
  tasks: Task[],
  dispatch: any
) => {
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
        .then((snapshots) => {
          snapshots.forEach((snapshot) => {
            const taskData = snapshot.data();
            const task = {
              id: taskData.id,
              contents: taskData.contents,
              updated_at: taskData.updated_at,
            } as Task;
            tasks.push(task);
          });
        })
        .catch((error) => {
          throw new Error(error);
        });

      dispatch(
        signInAction({
          uid,
          username: userData.username,
          email: userData.email,
          tasks: tasks,
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

        fetchSignInUserInfo(uid, tasks, dispatch);
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

        fetchSignInUserInfo(uid, tasks, dispatch);

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
