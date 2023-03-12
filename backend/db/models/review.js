'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(models.Spot, {
        foreignKey: 'userid',
         onDelete:"CASCADE"
      })
      Review.belongsTo(models.User, {
        foreignKey: 'spotid'
      })
      Review.hasMany(models.ReviewImage, {
        foreignKey: "reviewid"
      })
    }
  }
  Review.init({
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    spotid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    review: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
    {
      sequelize,
      modelName: 'Review',
    });
  return Review;
};