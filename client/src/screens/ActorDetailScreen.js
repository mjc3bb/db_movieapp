import {useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {Link, useParams} from "react-router-dom";
import React from "react";

const ActorDetailScreen = () =>{
  const {id} = useParams('id');
  const {loading, data,error} = useQuery(gql`
    query a($id:ID){
      actor(id:$id){
        first
        last
        movies{
          id
          title
        }
      }
    }
  `,{variables:{id:id}});

  if (error) alert(error);

  if (!(data && data.actor)) return null;

  const TitleSection = () =>(
    <div>
      {data.actor.first} {data.actor.last}
    </div>
  );

  const MovieSection = () =>(
    <div>
      <h5>Movies</h5>
      <ul>
        {data.actor.movies.map((movie)=><li><Link to={`/movies/${movie.id}`}>{movie.title}</Link></li>)}
        {data.actor.movies.length===0 ? <div>No Movies!</div>:null}
      </ul>
    </div>
  );

  const DirectorSection = () =>(
    <div className="column">
      <div>Directors</div>
      <ul>
        {data.movie.directors.map((director)=><li>{director.first} {director.last}</li>)}
      </ul>
    </div>
  );

  const ActorSection = () => (
    <div className="column">
      <h5>Actors</h5>
      <ul>
        {data.movie.actors.map((actor)=><li>{actor.first} {actor.last}</li>)}
      </ul>
    </div>
  );

  const ReviewsSection = () => (
    <span>
      <div>Reviews</div>
      <ul>
        {data.movie.reviews.map((review)=><li>{review.name}</li>)}
        {data.movie.reviews.length===0 ? <div>No reviews yet!</div>:null}
      </ul>
    </span>
  );

  const ActorDirectorSection = () => (
    <div className="page-wrapper">
      <div className="row">
        <ActorSection/>
        <DirectorSection/>
      </div>
    </div>
  );

  return (
    <div >
      <Link to='/actors'>Actor</Link>
      <TitleSection/>
      <hr/>
      <MovieSection/>
      {/*<GenreSection/>*/}
      {/*<hr/>*/}
      {/*<ActorDirectorSection/>*/}
      {/*<hr/>*/}
      {/*<ReviewsSection/>*/}
    </div>
  );
};

export default ActorDetailScreen;
