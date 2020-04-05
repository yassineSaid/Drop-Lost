import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import Animal from "./animal";
import Objet from "./objet";
import Personne from "./personne";


const Ajouter = ({ match }) => (
  <Switch>
    <Redirect exact from={`${match.url}/`} to={`${match.url}/objet`} />
    <Route path={`${match.url}/animal`} component={Animal} />
    <Route path={`${match.url}/objet`} component={Objet} />
    <Route path={`${match.url}/personne`} component={Personne} />
  </Switch>
);

export default Ajouter;
