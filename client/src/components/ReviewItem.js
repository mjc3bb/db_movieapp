import StarRatings from "react-star-ratings";
import React from "react";


const ReviewItem = ({review}) => (
    <div style={{
      alignItems:'center'
    }}>
      <span style={{fontWeight:'bold', alignContent:'center'}}>{review.name}</span>
      <span style={{
        marginLeft:10
      }}>
        <StarRatings
          rating={review.rating}
          starDimension="15px"
          starSpacing="2px"
        />
      </span>
      <p>{review.comment}</p>
    </div>
  );


export default ReviewItem;
