// utils/slugify.js
const db = require("../models");

const slugify = (str) =>
  str
    .toLowerCase()
    .normalize("NFD") // chuyển tiếng Việt có dấu → không dấu
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

const generateUniqueSlug = async (name, model) => {
  let baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;

  while (await model.findOne({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  return slug;
};

module.exports = { slugify, generateUniqueSlug };
