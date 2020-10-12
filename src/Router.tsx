import React from "react";
import { Switch, Route } from "react-router";
import {
  PasswordReset,
  SignIn,
  SignUp,
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
        <Route exact path="/task/registration" component={TaskRegistration} />
        <Route exact path="/user/edit" component={UserEdit} />
      </Auth>
    </Switch>
  );
};

export default Router;
