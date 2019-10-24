import React, {useEffect, useState} from 'react';
import './App.css';
import {Spinner} from 'react-activity';
import 'react-activity/dist/react-activity.css';
import {ApolloProvider, useLazyQuery} from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Collapse from "react-bootstrap/Collapse";
import Button from "react-bootstrap/Button";
const client = new ApolloClient({
  uri: 'http://127.0.0.1:4000'
});

const movieQuery = gql`
  query{
    movies{
      title
      year
      company
      rating
    }
  }
`;

const MovieCard = ({movie}) =>{
  const [collapsed, setCollapsed] = useState(true);
  return (
    <Card>
      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>

      </Card.Body>
      <Button onClick={()=>setCollapsed(!collapsed)}/>
      <Collapse in={!collapsed}>
        <Card.Text>
          <div>
            <p>{movie.year}</p>
            <p>{movie.company}</p>
            <p>{movie.rating}</p>
          </div>
        </Card.Text>
      </Collapse>
    </Card>
  );
};

const MovieList = ({movies}) =>{
  return (
    <div className="movieList">
      {movies.map((movie)=><MovieCard movie={movie}/>)}
    </div>
  );
};

function App() {
  const [execute, {loading, data}] = useLazyQuery(movieQuery);
  const [textState, setTextState] = useState('');
  const [isLoading, setLoading] = useState(false);


  useEffect(()=>execute(),[]);

  const onChange = (event) => {
    setTextState(event.target.value)
  };

  useEffect(() => {
    setLoading(loading);
  }, [loading]);


  return (
    <div className="App">
      <header className="App-header">
        {data && data.movies ? <MovieList movies={data.movies}/>:null}
        {isLoading?<Spinner/>:null}
      </header>
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
