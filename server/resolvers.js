const Sequelize = require('sequelize');
const sequelize = new Sequelize('moviedb', 'cs3423', '', {
  host: "localhost",
  port: 3306,
  dialect: 'mysql',
});

const casual = require('casual');

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
      sequelize.query(`select * from review where mid=${mid} order by time desc`).then((results) => {
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
      sequelize.query(`select genre as name from moviegenre where mid=${mid}`).then((results) => {
        resolve(results[0])
      })
    })
  },
};

const mutationResolvers = {
  postReview: (parent, {name, mid, rating, comment}) => {
    return new Promise((resolve) => {
      const r = {
        name:name,
        rating:rating,
        comment:comment,
        mid:mid
      };
      sequelize.query(`insert into review value ("${name}", now(), ${mid}, ${rating}, "${comment}")`).then((results) => {
        resolve(r)
      })
    })
  },
  generateRandomReviews: () => {
    return new Promise((resolve, reject) => {
      // SELECT id FROM movie ORDER BY RAND() LIMIT 100
      let reviews = [];
      sequelize.query(`SELECT id FROM movie ORDER BY RAND() LIMIT 4000`).then((results) => {
        results[0].forEach((result) => {
          let r = {
            name: casual.full_name,
            time: casual.date(format = 'YYYY-MM-DD'),
            mid: result.id,
            rating: casual.integer(from = 0, to = 5),
            comment: casual.sentences(n = 3)
          };
          reviews.push(r);
          sequelize.query(`insert into review value("${r.name}", "${r.time}", ${r.mid},${r.rating}, "${r.comment}")`);
        });
      }).then(() => resolve(reviews));
    })
  }
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
    if (offset !== undefined && limit !== undefined) query += ` limit ${offset},${limit}`;
    return new Promise((resolve) => {
      sequelize.query(query).then((results) => {
        resolve(results[0])
      })
    })
  },
  genres: (parent, args) => {
    return new Promise((resolve) => {
      sequelize.query(`select distinct genre as name from moviegenre;`).then((results) => {
        resolve(results[0])
      })
    })
  },
  actors: (parent, {offset, limit}) => {
    return new Promise((resolve) => {
      let query = `select * from actor`;
      if (offset !== undefined && limit !== undefined) query += ` limit ${offset},${limit}`;
      sequelize.query(query).then((results) => {
        resolve(results[0])
      })
    })
  },
  genre: (parent, {name}) => {
    return new Promise((resolve) => {
      sequelize.query(`select distinct genre as name from moviegenre where genre like "${name}"`).then((results) => {
        resolve(results[0][0])
      })
    })
  },
  search:(parent, {search})=>{
    return new Promise((resolve) => {
      let allResults = [];
      sequelize.query(`select *, "Movie" as __typename from movie m where title like binary "%${search}%" or year like binary "%${search}%" or rating like binary "%${search}%" or company like binary "%${search}%";`).then((results) => {
        allResults.push(...results[0])
      }).then(()=>{
        sequelize.query(`select *, "Actor" as __typename from actor a where concat(first,' ',last) like "%${search}%" or dob like "%${search}%" or dod like "%${search}%";`).then((results)=>{
          allResults.push(...results[0]);
        }).then(()=>{
          resolve(allResults);
        });
      });
    })
  }
};

const resolvers = {
  Actor: actorResolvers,
  Genre: genreResolvers,
  Movie: movieResolvers,
  Query: queryResolvers,
  Mutation: mutationResolvers
};

module.exports = resolvers;
