import {useQuery} from "@apollo/react-hooks";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import gql from "graphql-tag";
import Button from "react-bootstrap/Button";

const movieQuery = gql`
  query movies($offset:Int, $limit:Int){
    movies(offset:$offset, limit:$limit){
      id
      title
      year
      company
      rating
    }
  }
`;

const MovieListScreen = () =>{
  const limit = 10;
  const [offset, setOffset] = useState(0);
  const {data, loading, error, refetch} = useQuery(movieQuery, {variables:{offset:offset,limit:limit}});
  const [movieList, setMovieList] = useState([]);

  if (error) alert(error);

  useEffect(()=>{
    if (data && data.movies)
      setMovieList(data.movies.map((movie)=>
        <div>
          <Link to={`/movie/${movie.id}`}>
            {movie.title}: <i>{movie.year}</i> ({movie.rating})
          </Link>
          <hr/>
        </div>
      ));
  },[loading, data]);

  return (
    <div>
      <Link to='/'>Home</Link>
      <p>Movies</p>
      {movieList}
      <Button onClick={()=>{
        if (offset>=limit){
          setOffset(offset-limit);
          refetch({offset:offset, limit:limit});
        }
      }}>Previous</Button>
      <Button onClick={()=>{
        setOffset(offset+limit);
        refetch({offset:offset, limit:limit});
      }}>Next</Button>
    </div>
  );
};

export default MovieListScreen;
