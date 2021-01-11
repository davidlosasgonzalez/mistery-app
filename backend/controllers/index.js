const listEvents = require('./events/get/listEvents.js');
const getEvent = require('./events/get/getEvent.js');
const favEvents = require('./events/get/favEvents.js');
const newEvent = require('./events/post/newEvent.js');

module.exports = {
	listEvents,
	getEvent,
	favEvents,
	newEvent,
};
