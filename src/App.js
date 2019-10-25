import React, {useEffect, useState} from 'react';
import './App.css';
import {Spinner} from 'react-activity';
import 'react-activity/dist/react-activity.css';
import {ApolloProvider, useLazyQuery, useQuery} from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Collapse from "react-bootstrap/Collapse";
import Button from "react-bootstrap/Button";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
import MovieLink from "./components/link/MovieLink";


const client = new ApolloClient({
  uri: 'http://127.0.0.1:4000'
});

const movieQuery = gql`
  query{
    movies{
      id
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
    <div className="movieList" style={{
      marginLeft:'10%',
      marginRight:'10%'
    }}>
      {movies.map((movie)=><MovieCard movie={movie}/>)}
    </div>
  );
};

const Movies = () =>{
  const {data, loading, error} = useQuery(movieQuery);
  const [movieList, setMovieList] = useState([]);

  if (error) alert(error);

  useEffect(()=>{
    if (data && data.movies)
      setMovieList(data.movies.map((movie)=>
        <div>
          <Link to={`/movie/${movie.id}`}>
            <span>{movie.title} </span>
            <span>{movie.year}  </span>
            <span>({movie.rating})  </span>
          </Link>
        </div>
      ));
  },[loading, data]);

  return (
    <div>
      <p>Movies</p>
      <Link to='/'>Home</Link>
      {movieList}
    </div>
  );
};

const Movie = () =>{
  const {id} = useParams('id');
  const {loading, data,error} = useQuery(gql`
    query a($id:ID){
      movie(id:$id){
        title
        year
        genres{
          name
        }
        actors{
          first
          last
        }
        directors{
          first
          last
        }
        company
        reviews{
          name
          time
          rating
          comment
        }
      }
    }
  `,{variables:{id:id}});

  if (error) alert(error);

  if (!(data && data.movie)) return null;

  return (
    <div>
      <Link to='/movies'>Movies</Link>
      <p>{data.movie.title}</p>
      <p>{data.movie.year}</p>
      <p>{data.movie.company}</p>
      <p>{data.movie.rating}</p>
      <span>
        <div>Genres</div>
        <ul>
          {data.movie.genres.map((genre)=><li>{genre.name}</li>)}
        </ul>
      </span>
      <span>
        <div>Reviews</div>
        <ul>
          {data.movie.reviews.map((review)=><li>{review.name}</li>)}
          {data.movie.reviews.length===0 ? <div>No reviews yet!</div>:null}
        </ul>
      </span>
      <span>
        <div>Actors</div>
        <ul>
          {data.movie.actors.map((actor)=><li>{actor.first} {actor.last}</li>)}
        </ul>
      </span>
      <span>
        <div>Directors</div>
        <ul>
          {data.movie.directors.map((director)=><li>{director.first} {director.last}</li>)}
        </ul>
      </span>
    </div>
  );
};

const Home = () =>{
  return (
    <div>
      <p>Home</p>
      <Link to='/movies'>Movies</Link><br/>
    </div>
  );
};

function App() {
  const [execute, {loading, data}] = useLazyQuery(movieQuery);
  const [textState, setTextState] = useState('');
  const [isLoading, setLoading] = useState(false);


  // useEffect(()=>execute(),[]);

  const onChange = (event) => {
    setTextState(event.target.value)
  };

  useEffect(() => {
    setLoading(loading);
  }, [loading]);


  return (
    <div className="App">
      <Router>
          <Switch>
            <Route path='/movies'>
              <Movies/>
            </Route>
            <Route path='/movie/:id'>
              <Movie/>
            </Route>
            <Route path='/'>
              <Home/>
            </Route>
          </Switch>
      </Router>
    </div>
  );
}

// {data && data.movies ? <MovieList movies={data.movies}/>:null}
//               {isLoading?<Spinner/>:null}

function WrappedApp() {
  return (
    <ApolloProvider client={client}>
      <App/>
    </ApolloProvider>
  );
}

export default WrappedApp;
