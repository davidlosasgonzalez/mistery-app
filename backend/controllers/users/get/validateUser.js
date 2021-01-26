const getDB = require('../../../bbdd/db.js');

const validateUser = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { regCode } = req.params;

		const [
			user,
		] = await connection.query('SELECT id FROM users WHERE reg_code=?;', [
			regCode,
		]);

		if (user.length === 0) {
			const error = new Error(
				`There aren't users pending of validate with that code.`
			);
			error.httpStatus = 404;
			throw error;
		}

		await connection.query(
			'UPDATE users SET active=true, reg_code=NULL WHERE reg_code=?',
			[regCode]
		);

		res.send({
			status: 'ok',
			message: 'User actived!',
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = validateUser;
