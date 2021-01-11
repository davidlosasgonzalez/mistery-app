const getDB = require('../../../bbdd/db.js');
const { savePhoto } = require('../../../helpers.js');

const newEvent = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { type, description, id_council, id_user } = req.body;

		if (!type) {
			const error = new Error('Input "type" is required!');
			error.httpStatus = 400;
			throw error;
		}

		const [
			result,
		] = await connection.query(
			'INSERT INTO events (type, description, id_council, id_user) VALUES (?, ?, ?, ?);',
			[type, description, id_council, id_user]
		);

		const { insertId } = result;

		const photos = [];

		if (req.files && Object.keys(req.files).length > 0) {
			for (const photoData of Object.values(req.files).slice(0, 4)) {
				const photoFile = await savePhoto(photoData);

				photos.push(photoFile);

				await connection.query(
					`
					INSERT INTO events_photos (photo, id_event) VALUES (?, ?)
				`,
					[photoFile, insertId]
				);
			}
		}

		res.send({
			status: 'ok',
			data: {
				id: insertId,
				type: type,
				description: description,
				score: 0,
				photos: photos,
				id_council: id_council,
				id_user: id_user,
				created_at: new Date(),
				modified_at: null,
			},
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = newEvent;
