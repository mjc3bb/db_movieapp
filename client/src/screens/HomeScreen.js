import {Link} from "react-router-dom";
import React from "react";


const HomeScreen = () =>{
  return (
    <div>
      <p>Home</p>
      <Link to='/movies'>Movies</Link><br/>
      <Link to='/actors'>Actors</Link><br/>
    </div>
  );
};

export default HomeScreen;
