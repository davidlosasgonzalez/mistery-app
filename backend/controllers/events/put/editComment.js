const getDB = require('../../../bbdd/db.js');

const editComment = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { idEvent, idComment } = req.params;

		const [
			current,
		] = await connection.query(
			`SELECT COUNT(id) FROM comments WHERE id=? AND id_event=?`,
			[idComment, idEvent]
		);

		if (current.length === 0) {
			const error = new Error(`Comment doesn't exists!`);
			error.httpStatus = 404;
			throw error;
		}

		const { text } = req.body;

		if (!text) {
			const error = new Error('Fields are missing!');
			error.httpStatus = 400;
			throw error;
		}

		await connection.query(
			'UPDATE comments SET text=?, modified_at=CURRENT_TIMESTAMP WHERE id=? AND id_event=?;',
			[text, idComment, idEvent]
		);

		res.send({
			status: 'ok',
			data: {
				idComment,
				text,
				modified_at: new Date(),
			},
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = editComment;
