const getDB = require('../bbdd/db');

const userExists = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idUser } = req.params;

    const [result] = await connection.query('SELECT id FROM users WHERE id=? AND deleted=0;', [idUser]);

    if (result.length === 0) {
      const error = new Error(`User not found!`);
      error.httpStatus = 404;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = userExists;
