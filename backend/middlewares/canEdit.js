const getDB = require('../bbdd/db.js');

const canEdit = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { idEvent } = req.params;
		const { id: idUser, role } = req.userAuth;

		const [
			current,
		] = await connection.query(`SELECT id_user FROM events WHERE id=?`, [
			idEvent,
		]);

		if (current[0].id_user !== idUser && role !== 'admin') {
			const error = new Error(`You have not permisions to make changes!`);
			error.httpStatus = 401;
			throw error;
		}

		next();
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = canEdit;
