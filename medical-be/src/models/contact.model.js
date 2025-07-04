// models/contact.model.js
module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define("contact", {
    name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    message: { type: DataTypes.TEXT },
  });
  return Contact;
};
