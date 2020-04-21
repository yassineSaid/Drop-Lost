import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import AddUser from "./AddUser";
import listAdmin from "./listAdmin";
import listUsers from "./listUsers";
import asyncComponent from "../../util/asyncComponent"

const SuperAdmin = ({ match }) => (
  <Switch>
<Route path={`${match.url}/addadmin`} component={AddUser} />   
<Route path={`${match.url}/listadmin`} component={listAdmin} />   
<Route path={`${match.url}/listeusers`} component={listUsers} />   

  </Switch>
);

export default SuperAdmin;
