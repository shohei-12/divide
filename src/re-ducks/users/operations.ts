import { push } from "connected-react-router";
import { signInAction, signOutAction } from "./actions";
import { auth, db, FirebaseTimestamp } from "../../firebase";
import { Task } from "../users/types";

const usersRef = db.collection("users");

export const listenAuthState = () => {
  return async (dispatch: any) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const uid = user.uid;
        const list: Task[] = [];

        usersRef
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
                  } as Task;
                  list.push(task);
                });
              });

            dispatch(
              signInAction({
                uid,
                username: userData.username,
                email: userData.email,
                tasks: list,
              })
            );
          })
          .catch(() => {
            alert(
              "ユーザー情報を取得することができませんでした。通信環境の良い場所で再度お試しくださいませ。"
            );
          });
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
        const uid = result.user!.uid;
        const list: Task[] = [];

        usersRef
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
                  } as Task;
                  list.push(task);
                });
              });

            dispatch(
              signInAction({
                uid,
                username: userData.username,
                email: userData.email,
                tasks: list,
              })
            );

            dispatch(push("/"));
          })
          .catch(() => {
            alert(
              "ユーザー情報を取得することができませんでした。通信環境の良い場所で再度お試しくださいませ。"
            );
          });
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
      .catch(() => {
        alert(
          "ログアウトができませんでした。通信環境の良い場所で再度お試しくださいませ。"
        );
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
            .catch(() => {
              alert(
                "ユーザー情報を保存することができませんでした。通信環境の良い場所で再度お試しくださいませ。"
              );
            });
        }
      })
      .catch(() => {
        alert(
          "ユーザー登録ができませんでした。通信環境の良い場所で再度お試しくださいませ。"
        );
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
          .catch(() => {
            alert(
              "ユーザー情報の更新ができませんでした。通信環境の良い場所で再度お試しくださいませ。"
            );
          });
      })
      .catch(() => {
        alert(
          "メールアドレスの更新ができませんでした。通信環境の良い場所で再度お試しくださいませ。"
        );
      });
  };
};
