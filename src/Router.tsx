import React from "react";
import { Switch, Route } from "react-router";
import {
  CheckFilteredTaskList,
  PasswordReset,
  PriorityFilteredTaskList,
  SignIn,
  SignUp,
  SmallTaskDetail,
  TaskDetail,
  TaskList,
  TaskRegistration,
  UserEdit,
} from "./templates";
import Auth from "./Auth";

const Router: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/password/reset" component={PasswordReset} />
      <Route exact path="/signin" component={SignIn} />
      <Route exact path="/signup" component={SignUp} />
      <Auth>
        <Route
          exact
          path="/task/check/:val"
          component={CheckFilteredTaskList}
        />
        <Route
          exact
          path="/task/check/:val/page/:num"
          component={CheckFilteredTaskList}
        />
        <Route
          exact
          path="/task/priority/:val"
          component={PriorityFilteredTaskList}
        />
        <Route
          exact
          path="/task/priority/:val/page/:num"
          component={PriorityFilteredTaskList}
        />
        <Route
          exact
          path="/small-task/detail/:id/:id"
          component={SmallTaskDetail}
        />
        <Route exact path="/task/detail/:id" component={TaskDetail} />
        <Route exact path="/" component={TaskList} />
        <Route exact path="/page/:num" component={TaskList} />
        <Route exact path="/task/registration" component={TaskRegistration} />
        <Route exact path="/user/edit" component={UserEdit} />
      </Auth>
    </Switch>
  );
};

export default Router;
