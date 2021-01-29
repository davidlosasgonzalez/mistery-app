const getDB = require('../../../bbdd/db.js');
const { validate } = require('../../../helpers');
const { newCommentSchema } = require('../../../schemas');

const newCommnet = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    validate(newCommentSchema, req.body);

    const { text } = req.body;
    const { id: idUser } = req.userAuth;
    const { idEvent } = req.params;

    if (!text) {
      const error = new Error('Input "type" is required!');
      error.httpStatus = 400;
      throw error;
    }

    const [result] = await connection.query('INSERT INTO comments (text, id_event, id_user) VALUES (?, ?, ?);', [
      text,
      idEvent,
      idUser,
    ]);

    const { insertId } = result;

    res.send({
      status: 'ok',
      data: {
        id: insertId,
        id_event: idEvent,
        id_user: idUser,
        text: text,
        created_at: new Date(),
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = newCommnet;
