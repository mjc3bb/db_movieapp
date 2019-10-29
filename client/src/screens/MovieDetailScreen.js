import {useQuery, QueryOptions} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {Link, useParams} from "react-router-dom";
import React, {useReducer, useState} from "react";
import NewReviewComponent from "../components/NewReviewComponent";
import ReviewItem from '../components/ReviewItem';

const MovieDetailScreen = () =>{
  const {id} = useParams('id');
  const {loading, data,error} = useQuery(gql`
    query movie($id:ID){
      movie(id:$id){
        title
        year
        rating
        genres{
          name
        }
        actors{
          id
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


  const TitleSection = () =>(
    <div>
      {data.movie.title}:  <i>{data.movie.year}</i> - {data.movie.company}  ({data.movie.rating})
    </div>
  );

  const GenreSection = () =>(
    <div>
      <h5>Genres</h5>
      <ul>
        {data.movie.genres.map((genre)=><li>{genre.name}</li>)}
      </ul>
    </div>
  );

  const DirectorSection = () =>(
    <div className="column">
      <h5>Directors</h5>
      <ul>
        {data.movie.directors.map((director)=><li>{director.first} {director.last}</li>)}
      </ul>
    </div>
  );

  const ActorSection = () => (
    <div className="column">
      <h5>Actors</h5>
      <ul>
        {data.movie.actors.map((actor)=><li><Link to={`/actors/${actor.id}`}>{actor.first} {actor.last}</Link></li>)}
      </ul>
    </div>
  );

  const ReviewsSection = () => (
    <span>
      <div>Reviews</div>
      <NewReviewComponent mid={id}/>
      <div>
        {data.movie.reviews.map((review)=><ReviewItem review={review}/>)}
        {data.movie.reviews.length===0 ? <div>No reviews yet!</div>:null}
      </div>
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
      <Link to='/movies'>Movies</Link>
      <TitleSection/>
      <hr/>
      <GenreSection/>
      <hr/>
      <ActorDirectorSection/>
      <hr/>
      <ReviewsSection/>
    </div>
  );
};

export default MovieDetailScreen;
