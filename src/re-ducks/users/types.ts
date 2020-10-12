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
  small_tasks?: SmallTask[];
}

export interface SmallTask {
  id: string;
  contents: string;
}

export interface DispatchSignInAction {
  isSignedIn?: boolean;
  uid?: string;
  username?: string;
  email?: string;
  tasks?: Task[];
}

export interface UserAction {
  type: string;
  payload: DispatchSignInAction;
}
