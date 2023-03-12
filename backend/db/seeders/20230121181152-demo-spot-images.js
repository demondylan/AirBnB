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
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-28254684/original/99bd44d1-abca-4b1c-b5da-eb05eaac9193.jpeg",
        previewImage: true
      },
      {
        spotid: 2,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-21409981/original/a8fa243d-dac8-4238-93e5-f7aa33072ff8.jpeg",
        previewImage: true
      },
      {
        spotid: 3,
        url: "https://a0.muscache.com/im/pictures/82c577ee-3422-4fda-ae09-6716d76e8bef.jpg",
        previewImage: true
      },

    ], {});
  },
  down: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, null, {})
  }
};