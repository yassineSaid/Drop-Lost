import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import Ajouter from "./ajouter";

const Annonces = ({ match }) => (
  <Switch>
    <Redirect exact from={`${match.url}/`} to={`${match.url}/ajouter`}/>
    <Route path={`${match.url}/ajouter`} component={Ajouter} />
  </Switch>
);

export default Annonces;
