const getDB = require('../../../bbdd/db.js');
const { savePhoto } = require('../../../helpers.js');

const newEventPhoto = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { idEvent } = req.params;

		const [
			photos,
		] = await connection.query(
			'SELECT id FROM events_photos WHERE id_event=?;',
			[idEvent]
		);

		if (photos.length >= 4) {
			const error = new Error(`An event can't contain more than 4 photos.`);
			error.httpStatus = 403;
			throw error;
		}

		if (req.files && req.files.photo) {
			const savedPhoto = await savePhoto(req.files.photo);

			await connection.query(
				'INSERT INTO events_photos (photo, id_event) VALUES (?, ?);',
				[savedPhoto, idEvent]
			);
		}

		res.send({
			status: 'ok',
			message: 'New photo uploaded correctly!',
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = newEventPhoto;
