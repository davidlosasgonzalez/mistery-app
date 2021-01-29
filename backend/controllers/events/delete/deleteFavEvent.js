const getDB = require('../../../bbdd/db.js');

const deleteFavEvent = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { id: idUser } = req.userAuth;
    const { idEvent } = req.params;

    const [favEvent] = await connection.query(`SELECT id FROM favourites WHERE id_event=? AND id_user=?;`, [
      idEvent,
      idUser,
    ]);

    if (favEvent.length === 0) {
      const error = new Error(`That place is not on your favourites list!`);
      error.httpStatus = 404;
      throw error;
    }

    await connection.query('DELETE FROM favourites WHERE id_event=? AND id_user=?;', [[idEvent, idUser]]);

    res.send({
      status: 'ok',
      message: 'Event removed from favouite list!',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = deleteFavEvent;
