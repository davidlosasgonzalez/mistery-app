const sharp = require('sharp');
const path = require('path');
const uuid = require('uuid');
const { ensureDir, unlink } = require('fs-extra');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');

const { UPLOADS_DIRECTORY } = process.env;
const uploadsDir = path.join(__dirname, UPLOADS_DIRECTORY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * ####################
 * ##  Guardar foto  ##
 * ####################
 */
const savePhoto = async (photoData) => {
  try {
    await ensureDir(uploadsDir);

    const photo = sharp(photoData.data);

    const photoInfo = await photo.metadata();

    const FORMAT = photoInfo.format;

    if (FORMAT !== 'png' && FORMAT !== 'jpg' && FORMAT !== 'jpeg') {
      throw new Error();
    }

    const PHOTO_MAX_WIDTH = 1000;

    if (photoInfo.width > PHOTO_MAX_WIDTH) photo.resize(PHOTO_MAX_WIDTH);

    const photoName = `${uuid.v4()}.jpg`;

    await photo.toFile(path.join(uploadsDir, photoName));

    return photoName;
  } catch (e) {
    const error = new Error('Wrong image format! Only .png and .jpg formats are supported.');
    error.httpStatus = 400;
    throw error;
  }
};

/**
 * ###################
 * ##  Borrar foto  ##
 * ###################
 */
const deletePhoto = async (photoName) => {
  const photoPath = path.join(uploadsDir, photoName);
  await unlink(photoPath);
};

/**
 * #####################
 * ##  Random String  ##
 * #####################
 */
const randomString = (length) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * ############
 * ##  Mail  ##
 * ############
 */
const sendMail = async ({ to, subject, body }) => {
  try {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM,
      subject,
      text: body,
      html: `
				<div>
					<h1>${subject}</h1>
					<p>${body}</p>
				</div>
			`,
    };
    await sgMail.send(msg);
  } catch (error) {
    throw new Error('There was an error sending confirmation email!');
  }
};

/**
 * ################
 * ##  Validate  ##
 * ################
 */
const validate = async (schema, data) => {
  try {
    await schema.validateAsync(data);
  } catch (e) {
    const error = new Error();
    error.httpStatus = 400;
    error.message = e.message;
    throw error;
  }
};

module.exports = {
  savePhoto,
  deletePhoto,
  randomString,
  sendMail,
  validate,
};
