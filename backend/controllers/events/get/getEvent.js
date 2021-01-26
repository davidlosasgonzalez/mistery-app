const getDB = require('../../../bbdd/db.js');

const getEvent = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { idEvent } = req.params;

		const [results] = await connection.query(
			`
				SELECT events.id, events.id_council, events.type, events.description, events.created_at, events.modified_at, AVG(IFNULL(ratings.score,0)) AS score FROM events 
				LEFT JOIN ratings ON (events.id = ratings.id_event) 
                WHERE events.id=?;
            `,
			[idEvent]
		);

		const [event] = results;

		const [
			photos,
		] = await connection.query(
			`SELECT id, photo, created_at FROM events_photos WHERE id_event=?`,
			[idEvent]
		);

		res.send({
			status: 'ok',
			data: {
				...event,
				photos,
			},
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = getEvent;
