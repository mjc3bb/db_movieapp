const {ApolloServer, gql} = require('apollo-server');

const Sequelize = require('sequelize');

const sequelize = new Sequelize('moviedb', 'root', 'password', {
  host: "localhost",
  port: 3306,
  dialect: 'mysql',
});

const typeDefs = gql`
  type Raw {
    response: String
  }
  
  type Query {
    rawQuery(query:String): [Raw]
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    rawQuery: (parent, {query}) => {
      return new Promise((resolve, reject) => {
        sequelize.query(`${query}`).then((results) => {
          resolve(results[0].map((item) => {
            return {response: JSON.stringify(item)}
          }))
        }).catch((e)=>reject(e))
      })
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({url}) => {
  console.log(`🚀 Server ready at ${url}`);
});
