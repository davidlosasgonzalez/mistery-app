const getDB = require('../../../bbdd/db.js');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { email, password } = req.body;

		if (!email || !password) {
			const error = new Error('Missing inputs!');
			error.httpStatus = 400;
			throw error;
		}

		const [
			user,
		] = await connection.query(
			'SELECT id, role, active FROM users WHERE email=? AND password=SHA2(?, 512);',
			[email, password]
		);

		if (user.length === 0) {
			const error = new Error('Incorrect email or password!');
			error.httpStatus = 401;
			throw error;
		}

		if (!user[0].active) {
			const error = new Error('User exist but is not actived!');
			error.httpStatus = 401;
			throw error;
		}

		const tokenInfo = {
			id: user[0].id,
			role: user[0].role,
		};

		const token = jwt.sign(tokenInfo, process.env.SECRET, {
			expiresIn: '30d',
		});

		res.send({
			status: 'ok',
			data: {
				token,
			},
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = loginUser;
