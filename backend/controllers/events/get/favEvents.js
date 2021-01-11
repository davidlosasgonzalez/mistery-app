const getDB = require('../../../bbdd/db.js');

const favEvents = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { idUser } = req.params;

		const [results] = await connection.query(
			`
                SELECT events.id, events.id_council, events.type, events.description, events.created_at, events.modified_at, users.id AS id_user FROM events
                INNER JOIN ratings ON (events.id = ratings.id_event) 
                INNER JOIN users ON (users.id = ratings.id_user) 
                WHERE ratings.id_user = ?;
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
