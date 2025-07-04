const db = require("../models");
const { slugify } = require("../utils/slugify");

const getAll = async () => {
  return await db.Post.findAll({
    include: "category",
    order: [["createdAt", "DESC"]],
  });
};

const getById = async (id) => {
  return await db.Post.findByPk(id, { include: "category" });
};

const create = async (data) => {
  return await db.Post.create({
    ...data,
    slug: slugify(data.title),
  });
};

const update = async (id, data) => {
  return await db.Post.update(
    { ...data, slug: slugify(data.title) },
    { where: { id } }
  );
};

const remove = async (id) => {
  return await db.Post.destroy({ where: { id } });
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
