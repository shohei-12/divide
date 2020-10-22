export type UserState = {
  isSignedIn: boolean;
  uid: string;
  email: string;
  tasks: Task[];
  theme: string;
};

export type Task = {
  id: string;
  contents: string;
  small_tasks: SmallTask[];
  deadline: firebase.firestore.Timestamp | null;
  checked: boolean;
  priority: number;
  updated_at: firebase.firestore.Timestamp;
};

export type SmallTask = {
  id: string;
  contents: string;
  deadline: firebase.firestore.Timestamp | null;
  checked: boolean;
  priority: number;
  updated_at: firebase.firestore.Timestamp;
};

export type DispatchAction = {
  isSignedIn?: boolean;
  uid?: string;
  username?: string;
  email?: string;
  task?: Task;
  tasks?: Task[];
  theme?: string;
};

export type UserAction = {
  type: string;
  payload?: DispatchAction;
};
