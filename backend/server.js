require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const eventExists = require('./middlewares/eventExist');
const isUser = require('./middlewares/isUser'); // ? Desactivada la comprobación del token.
const canEdit = require('./middlewares/canEdit');
const userExists = require('./middlewares/userExists');

const {
  listEvents,
  getEvent,
  favEvents,
  newFavEvent,
  deleteFavEvent,
  newEvent,
  newEventPhoto,
  editEvent,
  deleteEvent,
  deleteEventPhoto,
  getComments,
  newComment,
  editComment,
  deleteComment,
  newRating,
  editRating,
  deleteRating,
} = require('./controllers/events/index.js');

const {
  newUser,
  validateUser,
  loginUser,
  getUser,
  deleteUser,
  editUser,
  editUserPassword,
  recoveryUserPassword,
  resetUserPassword,
} = require('./controllers/users');

const { PORT } = process.env;

const app = express();

/**
 * #################
 * ## MIDDLEWARES ##
 * #################
 */

// Middleware que indica la ruta a los archivos estáticos.
app.use(express.static(path.join(__dirname, 'static')));

// Soporte JSON-encoded bodies.
app.use(bodyParser.json());

// Soporte URL-encoded bodies.
app.use(bodyParser.urlencoded({ extended: true }));

// Body parser (multipart form data).
app.use(fileUpload());

// Middleware que nos da info sobre la petición.
app.use(morgan('dev'));

/**
 * ####################
 * ## RUTAS USUARIOS ##
 * ####################
 */

// Crear usuario.
app.post('/users', newUser);

// Validar usuario.
app.get('/users/validate/:regCode', validateUser);

//  Login usuario.
app.post('/users/login', loginUser);

//  Obtener info sobre usuario.
app.get('/users/:idUser', isUser, userExists, getUser);

//  Editar información de usuario.
app.put('/users/:idUser', isUser, userExists, editUser);

// TODO: Editar contraseña de usuario. Pendiente modificar "lastAuthUpdate".
app.put('/users/:idUser/password', isUser, userExists, editUserPassword);

// TODO: Desactivar usuario. Pendiente modificar la columna "name" del usuario.
app.delete('/users/:idUser', isUser, userExists, deleteUser);

// Enviar email para recuperar contraseña usuario.
app.post('/users/recovery', recoveryUserPassword);

// Recuperar contraseña usuario.
app.post('/users/reset', resetUserPassword);

/**
 * ###############
 * ## RUTAS API ##
 * ###############
 */

//  Crear nuevo evento.
app.post('/events', isUser, newEvent);

//  Agregar foto a evento.
app.post('/events/:idEvent/photos', isUser, eventExists, canEdit, newEventPhoto);

//  Devolver eventos.
app.get('/events', listEvents);

//  Devolver evento concreto.
app.get('/events/:idEvent', eventExists, getEvent);

//  Devolver eventos favoritos.
app.get('/events/favourites/list', isUser, favEvents);

//  Agregar un evento a la lista de favoritos.
app.post('/events/:idEvent/favourites', isUser, eventExists, newFavEvent);

//  Eliminar un evento de la lista de favoritos.
app.delete('/events/:idEvent/favourites', isUser, eventExists, canEdit, deleteFavEvent);

//  Editar evento.
app.put('/events/:idEvent', isUser, eventExists, canEdit, editEvent);

//  Eliminar evento.
app.delete('/events/:idEvent', isUser, eventExists, canEdit, deleteEvent);

//  Eliminar foto asignada a evento.
app.delete('/events/:idEvent/photos/:idPhoto', isUser, eventExists, canEdit, deleteEventPhoto);

// Listar comentarios de un evento.
app.get('/events/:idEvent/comments', getComments);

//  Crear comentario.
app.post('/events/:idEvent/comments', isUser, eventExists, newComment);

//  Editar comentario.
app.put('/events/:idEvent/comments/:idComment', isUser, eventExists, canEdit, editComment);

//  Eliminar comentario.
app.delete('/events/:idEvent/comments/:idComment', isUser, eventExists, deleteComment);

//  Valorar evento.
app.post('/events/:idEvent/ratings', isUser, eventExists, newRating);

//  Editar valoración.
app.put('/events/:idEvent/ratings/:idRating', isUser, eventExists, editRating);

//  Eliminar valoración.
app.delete('/events/:idEvent/ratings/:idRating', isUser, eventExists, deleteRating);

/**
 * ###########
 * ## ERROR ##
 * ###########
 */

// Middleware de error.
app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.httpStatus || 500).send({
    status: 'error',
    message: error.message,
  });
});

// Middleware de no encontrado.
app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    message: 'Not found',
  });
});

app.listen(PORT, () => {
  console.log(`Server working at port http://localhost:${PORT}`);
});
