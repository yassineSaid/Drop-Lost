import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import Ajouter from "./ajouter";
import MesAnnonces from "./mesAnnonces";
import AnnoncesPerdus from "./annoncesPerdus";
import Annonce from "./annonce";
import asyncComponent from "../../util/asyncComponent"

const Annonces = ({ match }) => (
  <Switch>
    <Redirect exact from={`${match.url}/`} to={`${match.url}/ajouter`}/>
    <Route path={`${match.url}/ajouter`} component={Ajouter} />
    <Route path={`${match.url}/mesAnnonces`} component={MesAnnonces} />
    <Route path={`${match.url}/annoncesPerdus`} component={AnnoncesPerdus} />
    <Route path={`${match.url}/annonce/:id`} component={asyncComponent(() => import('./annonce'))} />
  </Switch>
);

export default Annonces;
