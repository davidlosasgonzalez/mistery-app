/*
 * ############
 * ## Events ##
 * ############
 */
const listEvents = require('./get/listEvents.js');
const getEvent = require('./get/getEvent.js');
const favEvents = require('./get/favEvents.js');
const newEvent = require('./post/newEvent.js');
const newEventPhoto = require('./post/newEventPhoto.js');
const editEvent = require('./put/editEvent.js');
const deleteEvent = require('./delete/deleteEvent.js');
const deleteEventPhoto = require('./delete/deleteEventPhoto.js');

/*
 * ##############
 * ## Comments ##
 * ##############
 */
const newComment = require('./post/newComment.js');
const editComment = require('./put/editComment.js');
const deleteComment = require('./delete/deleteComment.js');

/*
 * #############
 * ## Ratings ##
 * #############
 */
const newRating = require('./post/newRating.js');
const editRating = require('./put/editRating.js');
const deleteRating = require('./delete/deleteRating.js');

/*
 * #############
 * ## Exports ##
 * #############
 */
module.exports = {
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
};
