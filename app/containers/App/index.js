/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from 'containers/Home/Loadable';
import PartOne from 'containers/PartOne/Loadable';
import PartTwo from 'containers/PartTwo/Loadable';

export default function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/filter" component={PartOne} />
        <Route exact path="/label" component={PartTwo} />
      </Switch>
    </div>
  );
}
