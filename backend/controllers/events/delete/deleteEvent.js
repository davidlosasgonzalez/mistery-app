const getDB = require('../../../bbdd/db.js');
const { deletePhoto } = require('../../../helpers.js');

const deleteEvent = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { idEvent } = req.params;

		const [
			photos,
		] = await connection.query(
			'SELECT photo FROM events_photos WHERE id_event=?',
			[idEvent]
		);

		for (const photo of photos) {
			await deletePhoto(photo.photo);
		}

		await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
		await connection.query('DELETE FROM events_photos WHERE id_event=?;', [
			idEvent,
		]);
		await connection.query('DELETE FROM ratings WHERE id_event=?;', [idEvent]);
		await connection.query('DELETE FROM comments WHERE id_event=?;', [idEvent]);
		await connection.query('DELETE FROM events WHERE id=?;', [idEvent]);
		await connection.query('SET FOREIGN_KEY_CHECKS = 1;');

		res.send({
			status: 'ok',
			message: 'Place removed correctly!',
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = deleteEvent;
