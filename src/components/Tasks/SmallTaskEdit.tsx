import React, { useState } from "react";
import { EditForm } from ".";
import { SmallTaskState } from "../../re-ducks/users/types";
import { updateTask } from "../../re-ducks/users/operations";

type Props = {
  smallTask: SmallTaskState;
  taskId: string;
  handleClose: () => void;
};

const SmallTaskEdit: React.FC<Props> = (props) => {
  const taskId = props.taskId;
  const smallTask = props.smallTask;

  const [contents, setContents] = useState(smallTask.contents);
  const [deadline, setDeadline] = useState(
    smallTask.deadline ? new Date(smallTask.deadline) : null
  );

  return (
    <EditForm
      task={smallTask}
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
