require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const eventExists = require('./middlewares/eventExist');
const isUser = require('./middlewares/isUser');
const canEdit = require('./middlewares/canEdit');

const {
	listEvents,
	getEvent,
	favEvents,
	newEvent,
	newEventPhoto,
	editEvent,
	deleteEvent,
	deleteEventPhoto,
	newComment,
	editComment,
	deleteComment,
	newRating,
	editRating,
	deleteRating,
} = require('./controllers/events/index.js');

const { newUser, validateUser, loginUser } = require('./controllers/users');

const { PORT } = process.env;

const app = express();

/**
 * #################
 * ## MIDDLEWARES ##
 * #################
 */

// Middleware que indica la ruta a los archivos estáticos.
app.use(express.static(path.join(__dirname, 'static')));

// To support JSON-encoded bodies.
app.use(bodyParser.json());

// To support URL-encoded bodies.
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

// * Crear usuario.
app.post('/users', newUser);

// * Validar usuario.
app.get('/users/validate/:regCode', validateUser);

// * Login usuario.
app.post('/users/login', loginUser);

/**
 * ###############
 * ## RUTAS API ##
 * ###############
 */

// * Crear nuevo evento.
app.post('/events/:idUser', isUser, newEvent);

// ! Agregar foto a evento.
app.post('/events/:idEvent/photos', newEventPhoto);

// ! Devolver eventos.
app.get('/events', listEvents);

// ! Devolver evento concreto.
app.get('/events/:idEvent', eventExists, getEvent);

// ! Devolver eventos favoritos.
app.get('/events/:idUser/favourites', favEvents);

// * Editar evento.
app.put('/events/:idEvent', isUser, eventExists, canEdit, editEvent);

// * Eliminar evento.
app.delete('/events/:idEvent', isUser, eventExists, canEdit, deleteEvent);

// ! Eliminar foto asignada a evento.
app.delete('/events/:idEvent/photos/:idPhoto', eventExists, deleteEventPhoto);

// ! Crear comentario.
app.post('/events/:idEvent/comments/:idUser', eventExists, newComment);

// ! Editar comentario.
app.put('/events/:idEvent/comments/:idComment', editComment);

// ! Eliminar comentario.
app.delete('/events/:idEvent/comments/:idComment', deleteComment);

// ! Valorar evento.
app.post('/events/:idEvent/ratings/:idUser', eventExists, newRating);

// ! Editar valoración.
app.put('/events/:idEvent/ratings/:idRating', editRating);

// ! Eliminar valoración.
app.delete('/events/:idEvent/ratings/:idRating', deleteRating);

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
