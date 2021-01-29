const getDB = require('../../../bbdd/db.js');

const favEvents = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { id: idUser } = req.userAuth;

    const [results] = await connection.query(
      `
        SELECT events.id, events.id_council, events.id_user, events.type, events.description, AVG(IFNULL(ratings.score,0)) AS score, events.created_at, events.modified_at
        FROM events
        INNER JOIN ratings ON (events.id = ratings.id_event)
        INNER JOIN favourites ON (events.id = favourites.id_event) 
        WHERE favourites.id_user = ?
        GROUP BY events.id
        ORDER BY events.id;
			`,
      [idUser]
    );

    res.send({
      status: 'ok',
      data: results,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = favEvents;
