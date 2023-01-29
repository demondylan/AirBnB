'use strict';
const bcrypt = require("bcryptjs");
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkInsert(options, [
      {
        id: 1,
   reviewid: 1,
   url: "blah1"
      },
      {
        id: 2,
        reviewid: 2,
        url: "blah2"
           },
           {
            id: 3,
            reviewid: 3,
            url: "blah3"
               }
      
    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null, {})
  }
};