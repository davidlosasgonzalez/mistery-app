const sharp = require('sharp');
const path = require('path');
const uuid = require('uuid');
const { ensureDir } = require('fs-extra');

const savePhoto = async (photoData) => {
	const { UPLOADS_DIRECTORY } = process.env;

	const uploadsDir = path.join(__dirname, UPLOADS_DIRECTORY);

	await ensureDir(uploadsDir);

	const photo = sharp(photoData.data);

	const photoInfo = await photo.metadata();

	const PHOTO_MAX_WIDTH = 1000;

	if (photoInfo.width > PHOTO_MAX_WIDTH) photo.resize(PHOTO_MAX_WIDTH);

	const photoName = `${uuid.v4()}.jpg`;

	await photo.toFile(path.join(uploadsDir, photoName));

	return photoName;
};

module.exports = {
	savePhoto,
};
