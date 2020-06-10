import React from "react";
import {Route, Switch} from "react-router-dom";

import CustomViews from "./customViews/index";
import ExtraComponents from "./extraComponents/index";
import InBuiltApps from "./inBuiltApps/index";
import SocialApps from "./socialApps/index";
import Documents from "./documents/index";
import SuperAdmin from "./superadmin/index"
import Annonces from "./annonces/index"
import admin from "./admin/index"
import agent from "./agent/index"
import Accueil from "./accueil";
import Reclamations from "./reclamations/index";


const App = ({match}) => (
  <div className="gx-main-content-wrapper">
    <Switch>
      <Route path={`${match.url}accueil`} component={Accueil}/>
      <Route path={`${match.url}custom-views`} component={CustomViews}/>
      <Route path={`${match.url}extra-components`} component={ExtraComponents}/>
      <Route path={`${match.url}in-built-apps`} component={InBuiltApps}/>
      <Route path={`${match.url}social-apps`} component={SocialApps}/>
      <Route path={`${match.url}documents`} component={Documents}/>
      <Route path={`${match.url}annonces`} component={Annonces}/>
      <Route path={`${match.url}reclamations`} component={Reclamations} />
      <Route path={`${match.url}superadmin`} component={SuperAdmin}/>
      <Route path={`${match.url}admin`} component={admin}/>
      <Route path={`${match.url}agent`} component={agent}/>

    </Switch>
  </div>
);

export default App;
