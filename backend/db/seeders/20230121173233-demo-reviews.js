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
        "id": 1,
        "userId": 1,
        "spotId": 1,
        "review": "This was an awesome spot!",
        "stars": 5,
      },
      {
        "id": 2,
        "userId": 2,
        "spotId": 2,
        "review": "Best Breakfast Around!",
        "stars": 5,
      },
      {
        "id": 3,
        "userId": 3,
        "spotId": 3,
        "review": "Terrible Never Go Here!",
        "stars": 1,
      }
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Reviews', null, {})
  }
};