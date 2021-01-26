const getDB = require('../../../bbdd/db.js');

const editEvent = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { idEvent } = req.params;

		const { type, description } = req.body;

		if (!type || !description) {
			const error = new Error('Fields are missing!');
			error.httpStatus = 400;
			throw error;
		}

		await connection.query(
			'UPDATE events SET type=?, description=?, modified_at=CURRENT_TIMESTAMP WHERE id=?;',
			[type, description, idEvent]
		);

		res.send({
			status: 'ok',
			data: {
				idEvent,
				type,
				description,
				modified_at: new Date(),
			},
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = editEvent;
