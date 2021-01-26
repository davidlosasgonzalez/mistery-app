const getDB = require('../bbdd/db');

const eventExists = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { idEvent } = req.params;

		const [result] = await connection.query(
			'SELECT id FROM events WHERE id=?;',
			[idEvent]
		);

		if (result.length === 0) {
			const error = new Error(`Place doesn't exist!`);
			error.httpStatus = 404;
			throw error;
		}
		next();
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = eventExists;
