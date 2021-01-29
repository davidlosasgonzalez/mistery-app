const getDB = require('../../../bbdd/db.js');

const newFavEvent = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { id: idUser } = req.userAuth;
    const { idEvent } = req.params;

    const [result] = await connection.query(`SELECT id FROM favourites WHERE id_event=? AND id_user=?;`, [
      idEvent,
      idUser,
    ]);

    if (result.length > 0) {
      const error = new Error('This event is already in favourites!');
      error.httpStatus = 403;
      throw error;
    }

    await connection.query(`INSERT INTO favourites (id_event, id_user) VALUES (?, ?);`, [idEvent, idUser]);

    res.send({
      status: 'ok',
      message: `Event added to favourites!`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = newFavEvent;
