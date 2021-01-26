const getDB = require('../../../bbdd/db.js');

const newCommnet = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { text } = req.body;

		const { idEvent, idUser } = req.params;

		if (!text) {
			const error = new Error('Input "type" is required!');
			error.httpStatus = 400;
			throw error;
		}

		const [
			result,
		] = await connection.query(
			'INSERT INTO comments (text, id_event, id_user) VALUES (?, ?, ?);',
			[text, idEvent, idUser]
		);

		const { insertId } = result;

		res.send({
			status: 'ok',
			data: {
				id: insertId,
				text: text,
				id_event: idEvent,
				id_user: idUser,
				created_at: new Date(),
			},
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = newCommnet;
