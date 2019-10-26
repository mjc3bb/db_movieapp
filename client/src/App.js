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
  
  type Review {
    name: String
    time: String
    mid: ID
    rating: Int
    comment: String
  }

  type Movie{
    id: ID
    title: String
    year: Int
    rating: String
    company: String
    reviews: [Review]
    actors: [Actor]
    directors: [Director]
    genres: [Genre]
  }
  
  type Genre {
    name: String
    movies: [Movie]
  }
  
  type Actor {
    id: ID
    first: String
    last: String
    dob: String
    dod: String
    movies: [Movie]
  }
  
  type Director {
    id: ID
    first: String
    last: String
    dob: String
    dod: String
    movies: [Movie]
  }
  
  union Person = Actor | Director
  
  type Query {
    rawQuery(query:String): [Raw]
    movies(offset:Int, limit:Int): [Movie]
    movie(id:ID): Movie
    actors(offset:Int, limit:Int): [Actor]
    actor(id:ID): Actor
    genres: [Genre]
  }
  
  type Mutation {
    postReview(name: String, mid: ID, rating: Int, comment:String):Review
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Actor:{
    movies: ({id:aid})=>{
      return new Promise((resolve) => {
        sequelize.query(`select m.* from movieactor ma join movie m on m.id=ma.mid where ma.aid=${aid}`).then((results) => {
            resolve(results[0])
        })
      })
    }
  },
  Genre:{
    movies:({name}, args)=>{
      return new Promise((resolve) => {
        sequelize.query(`select m.* from moviegenre mg join movie m on mg.mid=m.id where genre like "${name}";`).then((results) => {
            resolve(results[0])
        })
      })
    },
  },
  Movie:{
    reviews: ({id:mid}, args)=>{
      return new Promise((resolve) => {
        sequelize.query(`select * from review where mid=${mid}`).then((results) => {
            resolve(results[0])
        })
      })
    },
    actors:({id:mid})=>{
      return new Promise((resolve) => {
        sequelize.query(`select a.* from movieactor ma join actor a on ma.aid=a.id where ma.mid=${mid}`).then((results) => {
            resolve(results[0])
        })
      })
    },
    directors:({id:mid})=>{
      return new Promise((resolve) => {
        sequelize.query(`select d.* from moviedirector md join director d on md.did=d.id where md.mid=${mid}`).then((results) => {
            resolve(results[0])
        })
      })
    },
    genres:({id:mid})=>{
      return new Promise((resolve) => {
        sequelize.query(`select * from moviegenre where mid=${mid}`).then((results) => {
          resolve(results[0].map(item=>{
            return {
              name:item['genre']
            }
          }))
        })
      })
    },
  },
  Query: {
    rawQuery: (parent, {query}) => {
      return new Promise((resolve, reject) => {
        sequelize.query(`${query}`).then((results) => {
          resolve(results[0].map((item) => {
            return {response: JSON.stringify(item)}
          }))
        }).catch((e)=>reject(e))
      })
    },
    movie: (parent, {id})=>{
      return new Promise((resolve) => {
        sequelize.query(`select * from movie where id=${id}`).then((results) => {
          resolve(results[0][0])
        })
      })
    },
    actor: (parent, {id})=>{
      return new Promise((resolve) => {
        sequelize.query(`select * from actor where id=${id}`).then((results) => {
          resolve(results[0][0])
        })
      })
    },
    movies: (parent, {offset, limit}) => {
      let query = `select * from movie`;
      if (offset!==null && limit!==null) query+=` limit ${offset},${limit}`;
      return new Promise((resolve) => {
        sequelize.query(query).then((results) => {
          resolve(results[0])
        })
      })
    },
    genres: (parent, args)=>{
      return new Promise((resolve) => {
        sequelize.query(`select distinct genre from moviegenre;`).then((results) => {
          resolve(results[0].map(item=>{
            return {
              name:item['genre']
            }
          }))
        })
      })
    },
    actors: (parent, {offset, limit}) => {
      return new Promise((resolve) => {
        let query = `select * from actor`;
        if (offset!==null && limit!==null) query+=` limit ${offset},${limit}`;
        sequelize.query(query).then((results) => {
          resolve(results[0])
        })
      })
    },
  },
  Mutation:{
    postReview:(parent, {name, mid, rating, comment})=>{
      return new Promise((resolve) => {
        sequelize.query(`insert into review value ("${name}", now(), ${mid}, ${rating}, "${comment}")`).then((results) => {
            resolve(results[0])
        })
      })
    },
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({url}) => {
  console.log(`🚀 Server ready at ${url}`);
});
