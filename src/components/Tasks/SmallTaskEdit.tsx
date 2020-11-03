import React, { useState } from "react";
import { EditForm } from ".";
import { useSelector } from "react-redux";
import { getTasks } from "../../re-ducks/users/selectors";
import { SmallTaskState } from "../../re-ducks/users/types";
import { State } from "../../re-ducks/store/types";
import { updateTask } from "../../re-ducks/users/operations";

type Props = {
  smallTask: SmallTaskState;
  taskId: string;
  handleClose: () => void;
};

const SmallTaskEdit: React.FC<Props> = (props) => {
  const selector = useSelector((state: State) => state);
  const tasks = getTasks(selector);
  const taskId = props.taskId;
  const task = tasks.find((ele) => ele.id === taskId)!;
  const smallTask = props.smallTask;

  const [contents, setContents] = useState(smallTask.contents);
  const [deadline, setDeadline] = useState(
    smallTask.deadline ? new Date(smallTask.deadline) : null
  );

  return (
    <EditForm
      task={task}
      handleClose={props.handleClose}
      contents={contents}
      deadline={deadline}
      setContents={setContents}
      setDeadline={setDeadline}
      updateTask={updateTask(contents, taskId, smallTask.id, deadline)}
    />
  );
};

export default SmallTaskEdit;
