import {useMutation} from "@apollo/react-hooks";
import gql from "graphql-tag";
import React, {useReducer, useState} from "react";
import StarRatings from "react-star-ratings";
import ReviewItem from "./ReviewItem";


const NewReviewComponent = ({mid:id, OnSubmit}) =>{
    const [postReview, {data, error, loading}] = useMutation(gql`
      mutation post($name:String, $mid:ID, $rating:Int, $comment:String){
        postReview(name:$name,mid:$mid, rating:$rating,comment:$comment){
          name
          time
          mid
          rating
          comment
        }
      }
    `);

    const [formState, dispatch] = useReducer((state,action)=>{
      switch (action.type) {
        case 'name':
          return {...state, name:action.value};
        case 'comment':
          return {...state, comment:action.value};
        case 'rating':
          return {...state, rating:action.value};
        case 'clear':
          return { name:"", comment:"", rating:0 };
        default:
          return {...state};
      }},
      {
        name:"",
        comment:"",
        rating:0
      });


    const [isSubmitting, setSubmitting] = useState(false);
    if (!isSubmitting) return (
      <div>
        <button onClick={()=>setSubmitting(true)}>Add a review</button>
      </div>
    );

    if (data && data.postReview){
      return <ReviewItem review={data.postReview}/>;
    }

    return (
      <div>
        <div>
          <label>Name:</label><br/>
          <input type="text" value={formState.name} onChange={(event)=>dispatch({type:'name',value:event.target.value})}/>
        </div>
        <div>
          <StarRatings
            rating={formState.rating ? formState.rating : 0}
            changeRating={(newRating)=>dispatch({type:'rating', value:newRating})}
            starDimension="15px"
            starSpacing="2px"
            numberOfStars={5}
          />
        </div>
        <textarea onChange={(event)=>dispatch({type:'comment', value:event.target.value})} value={formState.comment}/>
        <div>
          <button onClick={()=>{
            postReview({variables:{ name:formState.name, mid:id, rating:formState.rating, comment:formState.comment }});
            dispatch({type:'clear'});
          }}>Submit</button>
          <button onClick={()=>{setSubmitting(false)}}>Cancel</button>
        </div>
      </div>
    );
  };

export default NewReviewComponent;
