import React, {useEffect, useState} from 'react';
import './App.css';
import {Spinner} from 'react-activity';
import 'react-activity/dist/react-activity.css';
import {ApolloProvider, useLazyQuery} from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
// import {createBrowserApp} from "@react-navigation/web";
// import {createSwitchNavigator} from '@react-navigation/core';
// import {useNavigation} from "react-navigation-hooks";


const client = new ApolloClient({
  uri: 'http://127.0.0.1:4000'
});

// const movieQuery = gql`
//   query{
//     movies{
//       title
//       year
//       company
//       rating
//     }
//   }
// `;

const rawQuery = gql`
  query($query:String){
    rawQuery(query:$query){
      response
    }
  }
`;


const ResponseRow = ({response}) => {
  let keys = Object.keys(response);
  return (
    <tr key={response.toString()}>
      {keys.map((key) => <td key={key.toString() + response.toString()}>{response[key]}</td>)}
    </tr>
  );
};

const ResponseTable = ({responses}) => {
  let newList = responses.map((response) => JSON.parse(response.response));
  let keys;
  if (newList.length > 0) keys = Object.keys(newList[0]);
  else keys = [];
  return (
    <table>
      <tbody>
      <tr>
        <th key='title'>Response</th>
      </tr>
      <tr key='fields'>
        {keys.map((key, index) => <td key={'fields' + index}>{key}</td>)}
      </tr>
      {newList.map((response, index) => (
        <ResponseRow key={'row' + index} response={response}/>
      ))}
      </tbody>
    </table>
  );
};

function App() {
  // const {navigate} = useNavigation();
  const [execute, {loading, data}] = useLazyQuery(rawQuery);
  const [textState, setTextState] = useState('');
  const [isLoading, setLoading] = useState(false);
  // if (!loading) alert(JSON.parse(data.rawQuery[0].response));

  const onSubmit = (event) => {
    event.preventDefault();
    execute({variables: {query: textState}})
  };

  const onChange = (event) => {
    setTextState(event.target.value)
  };

  useEffect(() => {
    setLoading(loading);
  }, [loading]);


  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={onSubmit}>
          <textarea value={textState} onChange={onChange}/><br/>
          <input type="submit" value="Submit"/>
          <button onClick={()=>{setTextState(''); execute({variables: {query: textState}})}}>Clear</button>
        </form>
        <ResponseTable responses={data && data.rawQuery ? data.rawQuery : []}/>
        {isLoading ? <Spinner/> : null}
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

// function Second() {
//   return (
//     <div>
//       <p>test</p>
//     </div>
//   );
// }

export default WrappedApp;
