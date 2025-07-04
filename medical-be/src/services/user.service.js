const db = require("../models");
const User = db.User;

const getAllUsers = async () => {
  return await User.findAll({
    attributes: { exclude: ["password"] },
    order: [["createdAt", "DESC"]],
  });
};

const updateUser = async (id, data) => {
  return await User.update(data, { where: { id } });
};

const deleteUser = async (id) => {
  return await User.destroy({ where: { id } });
};

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
};
