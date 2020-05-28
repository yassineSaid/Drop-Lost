import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";

import asyncComponent from "util/asyncComponent";


const InBuiltApps = ({match}) => (
  <Switch>
    <Redirect exact from={`${match.url}/`} to={`${match.url}/contacts`}/>
    <Route path={`${match.url}/contacts`} component={asyncComponent(() => import('./Contact'))}/>
    <Route path={`${match.url}/chat/:annonce?`} component={asyncComponent(() => import('./Chat/index'))}/>
    <Route path={`${match.url}/match/:match?`} component={asyncComponent(() => import('./Match/index'))}/>
    <Route path={`${match.url}/list/match`} component={asyncComponent(() => import('./Match/List/index'))}/>
    <Route path={`${match.url}/list/agent/match`} component={asyncComponent(() => import('./Match/Agent/index'))}/>
    <Route path={`${match.url}/mail`} component={asyncComponent(() => import('./Mail'))}/>
    <Route path={`${match.url}/todo`} component={asyncComponent(() => import('./Todo'))}/>
    <Route path={`${match.url}/notes`} component={asyncComponent(() => import('./Notes'))}/>
    <Route path={`${match.url}/firebase-crud`} component={asyncComponent(() => import('./FirebaseCRUD'))}/>
  </Switch>
);

export default InBuiltApps;
