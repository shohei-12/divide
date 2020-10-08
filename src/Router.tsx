import React from "react";
import { Switch, Route } from "react-router";
import { SignIn, SignUp } from "./templates";

const Router: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/signin" component={SignIn} />
      <Route exact path="/signup" component={SignUp} />
    </Switch>
  );
};

export default Router;
