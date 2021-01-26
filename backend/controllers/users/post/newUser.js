const getDB = require('../../../bbdd/db.js');
const { randomString, sendMail } = require('../../../helpers.js');

const newUser = async (req, res, next) => {
	let connection;

	try {
		connection = await getDB();

		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			const error = new Error('Missing inputs!');
			error.httpStatus = 400;
			throw error;
		}

		/**
		 * #######################
		 * ## ¿Existe el email? ##
		 * #######################
		 */

		const [
			existingEmail,
		] = await connection.query('SELECT id FROM users WHERE email=?;', [email]);

		if (existingEmail.length > 0) {
			const error = new Error('The email used belongs to an existing user!');
			error.httpStatus = 409;
			throw error;
		}

		/**
		 * ########################
		 * ## ¿Existe el nombre? ##
		 * ########################
		 */

		const [
			existingName,
		] = await connection.query('SELECT id FROM users WHERE name=?;', [name]);

		if (existingName.length > 0) {
			const error = new Error('The name used belongs to an existing user!');
			error.httpStatus = 409;
			throw error;
		}

		const regCode = randomString(40);

		const emailBody = `
			¡Bienvenido a Misterio App! 
			Vamos a pasarlo de miedo juntos, pero antes necesitamos que confirmes tu email haciendo clic en el siguiente enlace: ${process.env.PUBLIC_HOST}/users/validate/${regCode}
		`;

		await sendMail({
			to: email,
			subject: 'Activación de cuenta - Misterio App',
			body: emailBody,
		});

		await connection.query(
			'INSERT INTO users (name, email, password, reg_code) VALUES (?, ?, SHA2(?, 512), ?);',
			[name, email, password, regCode]
		);

		res.send({
			status: 'ok',
			message: 'Registered user, check your email to verify your account!',
		});
	} catch (error) {
		next(error);
	} finally {
		if (connection) connection.release();
	}
};

module.exports = newUser;
