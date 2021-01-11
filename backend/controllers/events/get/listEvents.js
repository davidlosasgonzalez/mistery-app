const getDB = require('../../../bbdd/db.js');

const listEvents = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const [results] = await connection.query(`
			SELECT events.id, events.council.id, events.type, events.description, events.created_at, events.modified_at, avg(ratings.score) AS score 
			FROM events INNER JOIN ratings ON (events.id = ratings.id_event) 
			GROUP BY events.id;
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
