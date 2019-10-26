const Sequelize = require('sequelize');
const sequelize = new Sequelize('moviedb', 'root', 'password', {
  host: "localhost",
  port: 3306,
  dialect: 'mysql',
});

const actorResolvers = {
  movies: ({id: aid}) => {
    return new Promise((resolve) => {
      sequelize.query(`select m.* from movieactor ma join movie m on m.id=ma.mid where ma.aid=${aid}`).then((results) => {
        resolve(results[0])
      })
    })
  }
};

const genreResolvers = {
  movies: ({name}, args) => {
    return new Promise((resolve) => {
      sequelize.query(`select m.* from moviegenre mg join movie m on mg.mid=m.id where genre like "${name}";`).then((results) => {
        resolve(results[0])
      })
    })
  },
};

const movieResolvers = {
  reviews: ({id: mid}, args) => {
    return new Promise((resolve) => {
      sequelize.query(`select * from review where mid=${mid}`).then((results) => {
        resolve(results[0])
      })
    })
  },
  actors: ({id: mid}) => {
    return new Promise((resolve) => {
      sequelize.query(`select a.* from movieactor ma join actor a on ma.aid=a.id where ma.mid=${mid}`).then((results) => {
        resolve(results[0])
      })
    })
  },
  directors: ({id: mid}) => {
    return new Promise((resolve) => {
      sequelize.query(`select d.* from moviedirector md join director d on md.did=d.id where md.mid=${mid}`).then((results) => {
        resolve(results[0])
      })
    })
  },
  genres: ({id: mid}) => {
    return new Promise((resolve) => {
      sequelize.query(`select * from moviegenre where mid=${mid}`).then((results) => {
        resolve(results[0].map(item => {
          return {
            name: item['genre']
          }
        }))
      })
    })
  },
};

const mutationResolvers = {
  postReview: (parent, {name, mid, rating, comment}) => {
    return new Promise((resolve) => {
      sequelize.query(`insert into review value ("${name}", now(), ${mid}, ${rating}, "${comment}")`).then((results) => {
        resolve(results[0])
      })
    })
  },
};

const queryResolvers = {
  rawQuery: (parent, {query}) => {
    return new Promise((resolve, reject) => {
      sequelize.query(`${query}`).then((results) => {
        resolve(results[0].map((item) => {
          return {response: JSON.stringify(item)}
        }))
      }).catch((e) => reject(e))
    })
  },
  movie: (parent, {id}) => {
    return new Promise((resolve) => {
      sequelize.query(`select * from movie where id=${id}`).then((results) => {
        resolve(results[0][0])
      })
    })
  },
  actor: (parent, {id}) => {
    return new Promise((resolve) => {
      sequelize.query(`select * from actor where id=${id}`).then((results) => {
        resolve(results[0][0])
      })
    })
  },
  movies: (parent, {offset, limit}) => {
    let query = `select * from movie`;
    if (offset && limit) query += ` limit ${offset},${limit}`;
    return new Promise((resolve) => {
      sequelize.query(query).then((results) => {
        resolve(results[0])
      })
    })
  },
  genres: (parent, args) => {
    return new Promise((resolve) => {
      sequelize.query(`select distinct genre from moviegenre;`).then((results) => {
        resolve(results[0].map(item => {
          return {
            name: item['genre']
          }
        }))
      })
    })
  },
  actors: (parent, {offset, limit}) => {
    return new Promise((resolve) => {
      let query = `select * from actor`;
      if (offset && limit) query += ` limit ${offset},${limit}`;
      sequelize.query(query).then((results) => {
        resolve(results[0])
      })
    })
  },
};

const resolvers = {
  Actor: actorResolvers,
  Genre: genreResolvers,
  Movie: movieResolvers,
  Query: queryResolvers,
  Mutation: mutationResolvers
};

module.exports = resolvers;
