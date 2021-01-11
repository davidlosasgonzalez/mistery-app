require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');

const {
	listEvents,
	getEvent,
	favEvents,
	newEvent,
} = require('./controllers/index.js');

const { PORT } = process.env;

const app = express();

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
 * ###############
 * ## RUTAS API ##
 * ###############
 */

// Devuelve todos los eventos.
app.get('/events', listEvents);

// Devuelve un evento concreto.
app.get('/events/:idEvent', getEvent);

// Devuelve los eventos favoritos de un usuario.
app.get('/events/favourites/:idUser', favEvents);

// Creo un  nuevo evento.
app.post('/events', newEvent);

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
