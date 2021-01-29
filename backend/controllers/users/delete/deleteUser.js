const getDB = require('../../../bbdd/db.js');

const deleteUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idUser } = req.params;

    if (Number(idUser) === '1') {
      const error = new Error(`Main admin can't be deactivated!`);
      error.httpStatus = 403;
      throw error;
    }

    if (Number(idUser) !== req.userAuth.id && req.userAuth.role !== 'admin') {
      const error = new Error(`You don't have enough permissions!`);
      error.httpStatus = 401;
      throw error;
    }

    await connection.query(
      `
        UPDATE users 
        SET email="[deleted]", password="[deleted]", name="[deleted]", avatar=NULL, active=0, deleted=1
        WHERE id=?;
      `,
      [idUser]
    );

    res.send({
      status: 'ok',
      message: 'User has been deactivated!',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = deleteUser;
