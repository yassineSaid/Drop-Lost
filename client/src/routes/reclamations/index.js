import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import LocationPickerExample from "./AjouterReclamation/AjouterReclamation";
import MesreclamationsList from "./MesReclamations/ListMesReclamations";
import Reclamation from "./reclamation/index";





const Reclamations = ({ match }) => (
  <Switch>

    <Route path={`${match.url}/AjouterReclamation`} component={LocationPickerExample} />
    <Route path={`${match.url}/mesReclamations`} component={MesreclamationsList} />
    <Route path={`${match.url}/maReclamation`} component={Reclamation} />

  </Switch>
);

export default Reclamations;
