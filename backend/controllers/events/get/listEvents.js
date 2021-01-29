const getDB = require('../../../bbdd/db.js');

const listEvents = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const [results] = await connection.query(`
			SELECT events.id, events.id_council, events.id_user, events.type, events.description, events.created_at, events.modified_at, AVG(IFNULL(ratings.score,0)) AS score 
			FROM events LEFT JOIN ratings ON (events.id = ratings.id_event) 
			GROUP BY events.id
			ORDER BY events.id;
		`);

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

module.exports = listEvents;
