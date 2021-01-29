const getDB = require('../../../bbdd/db.js');
const { validate } = require('../../../helpers');
const { newRatingSchema } = require('../../../schemas');

const newRating = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    validate(newRatingSchema, req.body);

    const { score } = req.body;
    const { id: idUser } = req.userAuth;
    const { idEvent } = req.params;

    if (!score) {
      const error = new Error('Input "score" is required!');
      error.httpStatus = 400;
      throw error;
    }

    if (score < 0 || score > 5) {
      const error = new Error('Input "score" must be an integer value between 0 and 5!');
      error.httpStatus = 400;
      throw error;
    }

    /**
     * #########################################
     * ## An user cannot twice the same event ##
     * #########################################
     */

    const [current] = await connection.query('SELECT id FROM ratings WHERE id_user=? AND id_event=?;', [
      idUser,
      idEvent,
    ]);

    if (current.length > 0) {
      const error = new Error('Same event cannot be scored twice or more!');
      error.httpStatus = 400;
      throw error;
    }

    /**
     * #################################
     * ## An user cannot vote himself ##
     * #################################
     */

    const [owner] = await connection.query('SELECT id FROM events WHERE id_user=?;', [idUser]);

    if (`${owner[0].id}` === idUser) {
      const error = new Error('An owner cannot vote for his own event!');
      error.httpStatus = 400;
      throw error;
    }

    await connection.query('INSERT INTO ratings (score, id_user, id_event) VALUES (?, ?, ?);', [
      score,
      idUser,
      idEvent,
    ]);

    res.send({
      status: 'ok',
      mesage: 'Event scored correctly!',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = newRating;
