export interface UserState {
  isSignedIn: boolean;
  uid: string;
  username: string;
  email: string;
  tasks: Task[];
}

export interface Task {
  id: string;
  contents: string;
  small_tasks: SmallTask[];
  updated_at: firebase.firestore.Timestamp;
}

export interface SmallTask {
  id: string;
  contents: string;
  updated_at: firebase.firestore.Timestamp;
}

export interface DispatchAction {
  isSignedIn?: boolean;
  uid?: string;
  username?: string;
  email?: string;
  task?: Task;
  tasks?: Task[];
}

export interface UserAction {
  type: string;
  payload: DispatchAction;
}
