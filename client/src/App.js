import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Search from "./Screens/Search";
import SongViewer from "./Screens/SongViewer";

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/song/:songId" component={SongViewer} />
      <Route path="/" component={Search} />
    </Switch>
  </BrowserRouter>
);

export default App;
