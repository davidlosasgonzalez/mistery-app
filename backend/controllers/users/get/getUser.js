const getDB = require('../../../bbdd/db.js');

const getUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idUser } = req.params;

    const [
      user,
    ] = await connection.query(
      'SELECT id, created_at, name, email, role, avatar FROM users WHERE id=? AND deleted=0;',
      [idUser]
    );

    const userInfo = {
      name: user[0].name,
      avatar: user[0].avatar,
    };

    if (user[0].id === req.userAuth.id || req.userAuth.role === 'admin') {
      userInfo.createdAt = user[0].created_at;
      userInfo.email = user[0].email;
      userInfo.role = user[0].role;
    }

    res.send({
      status: 'ok',
      data: userInfo,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = getUser;
