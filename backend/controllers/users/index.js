const newUser = require('./post/newUser');
const validateUser = require('./get/validateUser');
const loginUser = require('./post/loginUser');
const getUser = require('./get/getUser.js');
const deleteUser = require('./delete/deleteUser.js');
const editUser = require('./put/editUser.js');
const editUserPassword = require('./put/editUserPassword.js');
const recoveryUserPassword = require('./post/recoveryUserPassword.js');
const resetUserPassword = require('./post/resetUserPassword.js');

module.exports = {
  newUser,
  validateUser,
  loginUser,
  getUser,
  deleteUser,
  editUser,
  editUserPassword,
  recoveryUserPassword,
  resetUserPassword,
};
