const getDB = require('../../../bbdd/db.js');
const { validate } = require('../../../helpers');
const { newRatingSchema } = require('../../../schemas');

const editRating = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    validate(newRatingSchema, req.body);

    const { id: idUser } = req.userAuth;
    const { idEvent, idRating } = req.params;
    const { score } = req.body;

    const [current] = await connection.query(`SELECT id FROM ratings WHERE id=? AND id_event=?;`, [idRating, idEvent]);

    if (current.length === 0) {
      const error = new Error(`User has not voted this event!`);
      error.httpStatus = 404;
      throw error;
    }

    if (current[0].id_user === Number(idUser) && req.userAuth.role !== 'admin') {
      const error = new Error(`You have not enough permissions!`);
      error.httpStatus = 401;
      throw error;
    }

    if (!score) {
      const error = new Error(`Field 'score' is missing!`);
      error.httpStatus = 400;
      throw error;
    }

    if (score < 0 || score > 5) {
      const error = new Error(`Input 'score' must be an integer value between 0 and 5!`);
      error.httpStatus = 400;
      throw error;
    }

    await connection.query('UPDATE ratings SET score=?, modified_at=CURRENT_TIMESTAMP WHERE id=? AND id_event=?;', [
      score,
      idRating,
      idEvent,
    ]);

    res.send({
      status: 'ok',
      message: 'Score has been updated!',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = editRating;
