import { push } from "connected-react-router";
import { signInAction } from "./actions";
import { auth, db, FirebaseTimestamp } from "../../firebase";

export const signIn = (email: string, password: string) => {
  return async (dispatch: any) => {
    auth.signInWithEmailAndPassword(email, password).then((result) => {
      const user = result.user;

      if (user) {
        const uid = user.uid;

        db.collection("users")
          .doc(uid)
          .get()
          .then((snapshot) => {
            const data = snapshot.data()!;

            dispatch(
              signInAction({
                uid,
                username: data.username,
                email: data.email,
              })
            );

            dispatch(push("/"));
          });
      }
    });
  };
};

export const signUp = (
  username: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  return async (dispatch: any) => {
    auth.createUserWithEmailAndPassword(email, password).then((result) => {
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

        db.collection("users")
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
          });

        dispatch(push("/"));
      }
    });
  };
};
