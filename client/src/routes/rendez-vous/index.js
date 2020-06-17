import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import AjouterRdv from "./AjouterRDV/AjouterRendezVous";





const RendezVous = ({ match }) => (
  <Switch>

    <Route path={`${match.url}/AjouterRendezVous`} component={AjouterRdv} />

  </Switch>
);

export default RendezVous;
