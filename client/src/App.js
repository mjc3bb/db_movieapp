import React from 'react';
import './App.css';
import 'react-activity/dist/react-activity.css';
import {ApolloProvider} from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import MovieListScreen from "./screens/MovieListScreen";
import MovieDetailScreen from "./screens/MovieDetailScreen";
import HomeScreen from "./screens/HomeScreen";
import ActorListScreen from "./screens/ActorListScreen";
import ActorDetailScreen from "./screens/ActorDetailScreen"

const client = new ApolloClient({
  uri: 'http://127.0.0.1:4000'
});

function App() {
  return (
    <div className="App">
      <Router>
          <Switch>
            <Route path='/movies'>
              <MovieListScreen/>
            </Route>
            <Route path='/movie/:id'>
              <MovieDetailScreen/>
            </Route>
            <Route path='/actors'>
              <ActorListScreen/>
            </Route>
            <Route path='/actor/:id'>
              <ActorDetailScreen/>
            </Route>
            <Route path='/'>
              <HomeScreen/>
            </Route>
          </Switch>
      </Router>
    </div>
  );
}

function WrappedApp() {
  return (
    <ApolloProvider client={client}>
      <App/>
    </ApolloProvider>
  );
}

export default WrappedApp;
