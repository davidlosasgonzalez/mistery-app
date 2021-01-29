const getDB = require('../../../bbdd/db.js');

const getComments = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idEvent } = req.params;

    const [results] = await connection.query(
      `
        SELECT comments.id, comments.id_event, comments.id_user, comments.text, comments.created_at, comments.modified_at
        FROM comments
        INNER JOIN events ON (comments.id_event = events.id)
        WHERE comments.id_event = ?
        GROUP BY comments.id;
		  `,
      [idEvent]
    );

    res.send({
      status: 'ok',
      data: results,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = getComments;
