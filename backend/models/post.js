const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Post = sequelize.define("Post", {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  img: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = Post;
