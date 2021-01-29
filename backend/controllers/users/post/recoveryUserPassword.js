const getDB = require('../../../bbdd/db.js');
const { validate, randomString, sendMail } = require('../../../helpers.js');
const { recoveryUserPasswordSchema } = require('../../../schemas');

const recoveryUserPassword = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    validate(recoveryUserPasswordSchema, req.body);

    const { email } = req.body;

    console.log(email);

    if (!email) {
      const error = new Error('Missing email!');
      error.httpStatus = 400;
      throw error;
    }

    const [user] = await connection.query('SELECT id FROM users WHERE email=?;', [email]);

    if (user.length === 0) {
      const error = new Error('There is no user with the suggested email address!');
      error.httpStatus = 404;
      throw error;
    }

    const recoveryCode = randomString(40);

    await connection.query(
      `
      UPDATE users
      SET recovery_code=?
      WHERE email=?;
    `,
      [recoveryCode, email]
    );

    const emailBody = `
      Se ha solicitado un cambio de contraseña, por ese motivo te enviamos el siguiente código de reseteo: ${recoveryCode}

      Si no has sido tú ignora este email.
    `;

    await sendMail({
      to: email,
      subject: 'Recuperar contraseña - Misterio App',
      body: emailBody,
    });

    res.send({
      status: 'ok',
      message: 'A recovery URL was send to user email!',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = recoveryUserPassword;
