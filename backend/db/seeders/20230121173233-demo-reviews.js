'use strict';
const bcrypt = require("bcryptjs");
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {
        userid: 1,
        spotid: 1,
        review: "This was an awesome spot!",
        stars: 5,
      },
      {
        userid: 2,
        spotid: 2,
        review: "Best Breakfast Around!",
        stars: 5,
      },
      {
        userid: 3,
        spotid: 2,
        review: "Delicious",
        stars: 5,
      }, {
        userid: 1,
        spotid: 2,
        review: "Best Breakfast Around!",
        stars: 5,
      }, {
        userid: 1,
        spotid: 3,
        review: "Best Breakfast Around!",
        stars: 5,
      },
      {
        userid: 3,
        spotid: 3,
        review: "Terrible Never Go Here!",
        stars: 1,
      }
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null, {})
  }
};