'use strict';
const bcrypt = require("bcryptjs");
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkInsert(options, [
      {
        reviewid: 1,
        url: "blah1"
      },
      {
        reviewid: 2,
        url: "blah2"
      },
      {
        reviewid: 3,
        url: "blah3"
      }

    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    options.tableName = "ReviewImages"
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null, {})
  }
};