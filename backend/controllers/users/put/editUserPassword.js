const getDB = require('../../../bbdd/db');
const { validate } = require('../../../helpers.js');
const { editUserPasswordSchema } = require('../../../schemas');

const editUserPassword = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    validate(editUserPasswordSchema, req.body);

    const { idUser } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || newPassword.length < 8) {
      const error = new Error(`Missing or wrong inputs!`);
      error.httpStatus = 400;
      throw error;
    }

    if (req.userAuth.id !== Number(idUser)) {
      const error = new Error(`You don't have enough permissions!`);
      error.httpStatus = 403;
      throw error;
    }

    const [currentUser] = await connection.query(
      `
        SELECT id FROM users WHERE password=SHA2(?, 512);
      `,
      [oldPassword]
    );

    if (currentUser.length === 0) {
      const error = new Error(`Incorrect password!`);
      error.httpStatus = 401;
      throw error;
    }

    await connection.query(
      `
        UPDATE users 
        SET password=SHA2(?, 512), modified_at=CURRENT_TIMESTAMP
        WHERE id=?;
      `,
      [newPassword, idUser]
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

module.exports = editUserPassword;
