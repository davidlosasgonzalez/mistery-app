const getDB = require('../../../bbdd/db.js');
const { validate } = require('../../../helpers.js');
const { resetUserPasswordSchema } = require('../../../schemas');

const resetUserPassword = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    validate(resetUserPasswordSchema, req.body);

    const { recoveryCode, newPassword } = req.body;

    if (!recoveryCode || !newPassword || newPassword.length < 8) {
      const error = new Error('Missing or wrong inputs!');
      error.httpStatus = 400;
      throw error;
    }

    const [user] = await connection.query('SELECT id FROM users WHERE recovery_code=?;', [recoveryCode]);

    if (user.length === 0) {
      const error = new Error('Wrong recovery code!');
      error.httpStatus = 404;
      throw error;
    }

    await connection.query(
      `
      UPDATE users
      SET password=SHA2(?, 512), recovery_code=NULL, modified_at=CURRENT_TIMESTAMP
      WHERE recovery_code=?;
    `,
      [newPassword, recoveryCode]
    );

    res.send({
      status: 'ok',
      message: 'Password updated!',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = resetUserPassword;
