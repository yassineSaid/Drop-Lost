import React from "react";
import { Route, Switch } from "react-router-dom";

import AddAgent from "./addAgent";
import listAgent from "./listAgent";
import listUsers from "./listUsers";

const admin = ({ match }) => (
  <Switch>
<Route path={`${match.url}/addagent`} component={AddAgent} />   
<Route path={`${match.url}/listagent`} component={listAgent} />   
<Route path={`${match.url}/listeusers`} component={listUsers} />   

  </Switch>
);

export default admin;
