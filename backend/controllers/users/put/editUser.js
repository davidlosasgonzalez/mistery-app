const getDB = require('../../../bbdd/db.js');
const { validate, savePhoto, deletePhoto, randomString, sendMail } = require('../../../helpers.js');

const { editUserSchema } = require('../../../schemas');

const editUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    validate(editUserSchema, req.body);

    const { idUser } = req.params;

    const { name, email } = req.body;

    if (req.userAuth.id !== Number(idUser) && req.userAuth.role !== 'admin') {
      const error = new Error(`You don't have enough permissions!`);
      error.httpStatus = 403;
      throw error;
    }

    const [currentUser] = await connection.query('SELECT name, email, avatar FROM users WHERE id=?;', [idUser]);

    /**
     * ################
     * ## Check name ##
     * ################
     */

    let userName;

    if (name !== currentUser[0].name) {
      userName = name;
    } else {
      userName = currentUser[0].name;
    }

    /**
     * ##################
     * ## Check avatar ##
     * ##################
     */

    let userAvatar;

    if (req.files && req.files.avatar) {
      if (currentUser[0].avatar !== null) {
        await deletePhoto(currentUser[0].avatar);
      }

      userAvatar = await savePhoto(req.files.avatar);
    } else {
      userAvatar = currentUser[0].avatar;
    }

    /**
     * #################
     * ## Check email ##
     * #################
     */
    if (email && email !== currentUser[0].email) {
      const [existingEmail] = await connection.query('SELECT id FROM users WHERE email=?;', [email]);

      if (existingEmail.length > 0) {
        const error = new Error('Email already exists!');
        error.httpStatus = 409;
        throw error;
      }

      const regCode = randomString(40);

      const emailBody = `
        Acabas de solicitar una actualización de email, haz clic en el siguiente enlace para realizar la validación: ${process.env.PUBLIC_HOST}/users/validate/${regCode}
      `;

      await sendMail({
        to: email,
        subject: 'Actualización de email - Misterio App',
        body: emailBody,
      });

      // Update con cambio de email.
      await connection.query(
        `
          UPDATE users
          SET name=?, email=?, avatar=?, reg_code=?, active=0, modified_at=CURRENT_TIMESTAMP
          WHERE id=?;
        `,
        [userName, email, userAvatar, regCode, idUser]
      );

      res.send({
        status: 'ok',
        message: 'User updated correctly! Check your new email to verification.',
      });
    } else {
      // Update SIN cambio de email.
      await connection.query(
        `
          UPDATE users
          SET name=?, avatar=?
          WHERE id=?
        `,
        [userName, userAvatar, idUser]
      );

      res.send({
        status: 'ok',
        message: 'User updated correctly!',
      });
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = editUser;
