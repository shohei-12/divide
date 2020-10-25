export type UserState = {
  isSignedIn: boolean;
  uid: string;
  email: string;
  tasks: TaskState[];
  theme: string;
};

export type TaskState = {
  id: string;
  contents: string;
  small_tasks: SmallTaskState[];
  deadline: string | null;
  checked: boolean;
  priority: number;
  updated_at: string;
};

export type SmallTaskState = {
  id: string;
  contents: string;
  deadline: string | null;
  checked: boolean;
  priority: number;
  parentId: string | null;
  updated_at: firebase.firestore.Timestamp;
  created_at?: firebase.firestore.Timestamp;
};

export type DispatchAction = {
  isSignedIn?: boolean;
  uid?: string;
  username?: string;
  email?: string;
  task?: TaskState;
  tasks?: TaskState[];
  theme?: string;
};

export type UserAction = {
  type: string;
  payload?: DispatchAction;
};
