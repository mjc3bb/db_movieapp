import {useQuery} from "@apollo/react-hooks";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import gql from "graphql-tag";
import Button from "react-bootstrap/Button";

const actorQuery = gql`
  query actors($offset:Int, $limit:Int){
    actors(offset:$offset, limit:$limit){
      id
      first
      last
    }
  }
`;

const ActorListScreen = () =>{
  const limit = 10;
  const [offset, setOffset] = useState(0);
  const {data, loading, error, refetch} = useQuery(actorQuery, {variables:{offset:offset,limit:limit}});
  const [actorList, setActorList] = useState([]);

  if (error) alert(error);

  useEffect(()=>{
    if (data && data.actors)
      setActorList(data.actors.map((actor)=>
        <div>
          <Link to={`/actors/${actor.id}`}>
            {actor.first} {actor.last}
          </Link>
          <hr/>
        </div>
      ));
  },[loading, data]);

  return (
    <div>
      <Link to='/'>Home</Link>
      <p>Actors</p>
      {actorList}
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

export default ActorListScreen;
