import React from "react";
import { Switch, Route } from "react-router";
import { SignIn, SignUp, UserEdit } from "./templates";

const Router: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/signin" component={SignIn} />
      <Route exact path="/signup" component={SignUp} />
      <Route exact path="/user/edit" component={UserEdit} />
    </Switch>
  );
};

export default Router;
