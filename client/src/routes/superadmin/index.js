import React from "react";
import { Route, Switch } from "react-router-dom";

import AddAdmin from "./AddAdmin";
import listAdmin from "./listAdmin";
import listUsers from "./listUsers";

const SuperAdmin = ({ match }) => (
  <Switch>
<Route path={`${match.url}/addadmin`} component={AddAdmin} />   
<Route path={`${match.url}/listadmin`} component={listAdmin} />   
<Route path={`${match.url}/listeusers`} component={listUsers} />   

  </Switch>
);

export default SuperAdmin;
