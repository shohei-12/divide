import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { useForm } from "react-hook-form";
import { SecondaryButton } from "../components/UIkit";
import { TaskForm } from "../components/Tasks";
import { getUserId } from "../re-ducks/users/selectors";
import { State } from "../re-ducks/store/types";
import { db, FirebaseTimestamp } from "../firebase";

type Inputs = {
  contents: string;
};

const TaskRegistration: React.FC = () => {
  const { register, handleSubmit, errors } = useForm<Inputs>({
    defaultValues: {
      contents: "",
    },
  });

  const dispatch = useDispatch();
  const selector = useSelector((state: State) => state);
  const uid = getUserId(selector);

  const [contents, setContents] = useState("");
  const [deadline, setDeadline] = useState<Date | null>(null);

  const registerTask = (contents: string, deadline: Date | null) => {
    const timestamp = FirebaseTimestamp.now().toDate().toString();
    const tasksRef = db.collection("users").doc(uid).collection("tasks");
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

      tasksRef
        .doc(id)
        .set(taskInitialData)
        .then(() => {
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

  return (
    <div className="c-mw700">
      <h2>タスクの登録</h2>
      <TaskForm
        deadline={deadline}
        setContents={setContents}
        setDeadline={setDeadline}
        contentsErrors={errors.contents}
        contentsValidation={register({
          required: "入力必須です。",
          maxLength: {
            value: 50,
            message: "50文字以内で入力してください。",
          },
        })}
      />
      <div className="space-m"></div>
      <SecondaryButton
        text="登録する"
        disabled={contents ? false : true}
        onClick={handleSubmit(() => registerTask(contents, deadline))}
      />
    </div>
  );
};

export default TaskRegistration;
