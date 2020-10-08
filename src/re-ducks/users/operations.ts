import { auth, db, FirebaseTimestamp } from "../../firebase";
import { push } from "connected-react-router";

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
          .then(() => dispatch(push("/")));
      }
    });
  };
};
