const getDB = require('../../../bbdd/db.js');

const deleteRating = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { id: idUser } = req.userAuth;
    const { idRating, idEvent } = req.params;

    const [current] = await connection.query(`SELECT COUNT(id) FROM ratings WHERE id=? AND id_event=?`, [
      idRating,
      idEvent,
    ]);

    if (current.length === 0) {
      const error = new Error(`Rating doesn't exists!`);
      error.httpStatus = 404;
      throw error;
    }

    if (current[0].id_user === Number(idUser) && req.userAuth.role !== 'admin') {
      const error = new Error(`You have not permissions!`);
      error.httpStatus = 401;
      throw error;
    }

    await connection.query('DELETE FROM ratings WHERE id=? AND id_event=?;', [idRating, idEvent]);

    res.send({
      status: 'ok',
      message: 'Rating removed correctly!',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = deleteRating;
