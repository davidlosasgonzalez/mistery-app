const getDB = require('../../../bbdd/db.js');
const { validate } = require('../../../helpers');
const { newCommentSchema } = require('../../../schemas');

const editComment = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    validate(newCommentSchema, req.body);

    const { text } = req.body;
    const { idEvent, idComment } = req.params;
    const { id: idUser } = req.userAuth;

    // ? Dado que la búsqueda la estamos haciendo por "id" no
    // ? tiene mucho sentido buscar también por "id_event".
    // ? Pendiente de revisar.
    const [current] = await connection.query(`SELECT id FROM comments WHERE id=? AND id_event=?`, [idComment, idEvent]);

    if (current.length === 0) {
      const error = new Error(`Comment doesn't exists!`);
      error.httpStatus = 404;
      throw error;
    }

    if (current[0].id_user !== Number(idUser) && req.userAuth.role !== 'admin') {
      const error = new Error(`You have not enough permissions!`);
      error.httpStatus = 401;
      throw error;
    }

    if (!text) {
      const error = new Error('Fields are missing!');
      error.httpStatus = 400;
      throw error;
    }

    await connection.query('UPDATE comments SET text=?, modified_at=CURRENT_TIMESTAMP WHERE id=? AND id_event=?;', [
      text,
      idComment,
      idEvent,
    ]);

    res.send({
      status: 'ok',
      data: {
        idComment,
        text,
        modified_at: new Date(),
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = editComment;
