const getDB = require('../../../bbdd/db.js');

const editRating = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { idRating, idEvent } = req.params;

		const [
			current,
		] = await connection.query(
			`SELECT COUNT(id) FROM ratings WHERE id=? AND id_event=?`,
			[idRating, idEvent]
		);

		if (current.length === 0) {
			const error = new Error(`Rating doesn't exists!`);
			error.httpStatus = 404;
			throw error;
		}

		const { score } = req.body;

		if (!score) {
			const error = new Error(`Field 'score' is missing!`);
			error.httpStatus = 400;
			throw error;
		}

		if (score < 0 || score > 5) {
			const error = new Error(
				`Input 'score' must be an integer value between 0 and 5!`
			);
			error.httpStatus = 400;
			throw error;
		}

		await connection.query(
			'UPDATE ratings SET score=?, modified_at=CURRENT_TIMESTAMP WHERE id=? AND id_event=?;',
			[score, idRating, idEvent]
		);

		res.send({
			status: 'ok',
			data: {
				id: idRating,
				score,
				modified_at: new Date(),
			},
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = editRating;
