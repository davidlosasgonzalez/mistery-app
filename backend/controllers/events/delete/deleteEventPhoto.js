const getDB = require('../../../bbdd/db.js');
const { deletePhoto } = require('../../../helpers.js');

const deleteEventPhoto = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idEvent, idPhoto } = req.params;

    const [current] = await connection.query('SELECT photo FROM events_photos WHERE id=? AND id_event=?', [
      idPhoto,
      idEvent,
    ]);

    if (current.length === 0) {
      const error = new Error(`Photo doesn't exist!`);
      error.httpStatus = 404;
      throw error;
    }

    await deletePhoto(current[0].photo);

    await connection.query('DELETE FROM events_photos WHERE id=? AND id_event=?', [idPhoto, idEvent]);

    res.send({
      status: 'ok',
      message: 'Photo deleted!',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = deleteEventPhoto;
