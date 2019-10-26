const fs = require('fs');
const path = require('path');

const {ApolloServer} = require('apollo-server');

const typeDefs = fs.readFileSync(path.join(__dirname, "typeDefs.graphql"), "utf8");
const resolvers = require('./resolvers');

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({url}) => {
  console.log(`🚀 Server ready at ${url}`);
});
