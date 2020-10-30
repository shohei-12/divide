import React, { useState } from "react";
import { EditForm } from ".";
import { TaskState } from "../../re-ducks/users/types";
import { updateTask } from "../../re-ducks/users/operations";

type Props = {
  task: TaskState;
  handleClose: () => void;
};

const TaskEdit: React.FC<Props> = (props) => {
  const task = props.task;

  const [contents, setContents] = useState(task.contents);
  const [deadline, setDeadline] = useState(
    task.deadline ? new Date(task.deadline) : null
  );

  return (
    <EditForm
      task={task}
      handleClose={props.handleClose}
      contents={contents}
      deadline={deadline}
      setContents={setContents}
      setDeadline={setDeadline}
      updateTask={updateTask(contents, task.id, null, deadline)}
    />
  );
};

export default TaskEdit;
