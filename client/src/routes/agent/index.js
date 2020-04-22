import React from "react";
import { Route, Switch } from "react-router-dom";

import AddStore from "./Addstore";
import listStore from "./listStore";
import getstore from "./getStore";

const agent = ({ match }) => (
  <Switch>
<Route path={`${match.url}/addstore`} component={AddStore} />   
<Route path={`${match.url}/liststore`} component={listStore} />   
<Route path={`${match.url}/getstore/:nom`} component={getstore} />   

  </Switch>
);

export default agent;
