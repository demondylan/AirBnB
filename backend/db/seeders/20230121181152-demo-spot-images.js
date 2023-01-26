'use strict';
const bcrypt = require("bcryptjs");
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        spotid: 1,
        url: "www.google.com",
        preview: true
      },
      {
        spotid: 1,
        url: "www.images.com",
        preview: false
      },
      {
        spotid: 2,
        url: "www.youtube.com",
        preview: true
      },
      {
        spotid: 2,
        url: "www.golf.com",
        preview: false
      },
      {
        spotid: 3,
        url: "www.lost.com",
        preview: false
      },
      {
        spotid: 3,
        url: "www.dogs.com",
        preview: true
      },
      
    ], {});
  },
    down: async (queryInterface, Sequelize) => {
      const Op = Sequelize.Op;
      return queryInterface.bulkDelete('SpotImages', null, {})
    }
  };