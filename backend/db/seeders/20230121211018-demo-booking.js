'use strict';
const bcrypt = require("bcryptjs");
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize)  {
    options.tableName = 'Bookings';
    await queryInterface.bulkInsert(options, [
      {
        spotid: 1,
        userid: 1,
        startDate: '1996-01-22',
        endDate: '1998-01-22'
      },
      {
        spotid: 2,
        userid: 2,
        startDate: '2001-05-22',
        endDate: '2001-05-30'
      },
      {
        spotid: 3,
        userid: 3,
        startDate: '2001-07-22',
        endDate: '2001-08-30'
      }

    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    options.tableName = "Bookings"
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null, {})
  }
};