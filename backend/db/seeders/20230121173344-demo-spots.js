'use strict';
const bcrypt = require("bcryptjs");
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.bulkInsert('Spots', [{
      "id": 1,
      "ownerId": 1,
      "address": "123 Disney Lane",
      "city": "San Francisco",
      "state": "California",
      "country": "United States of America",
      "lat": 37.7645358,
      "lng": -122.4730327,
      "name": "App Academy",
      "description": "Place where web developers are created",
      "price": 123
      },
      {
        "id": 2,
        "ownerId": 2,
        "address": "123 coder ave",
        "city": "Detroit",
        "state": "Michigan",
        "country": "United States of America",
        "lat": 47.7645358,
        "lng": -134.4730327,
        "name": "Lost Lands",
        "description": "Place where the developers stay",
        "price": 250
      },
      {
        "id": 3,
        "ownerId": 3,
        "address": "235 lost dreams ave",
        "city": "Chicago",
        "state": "illinois",
        "country": "United States of America",
        "lat": 69.7645358,
        "lng": -156.4730327,
        "name": "Sweet Dreams",
        "description": "Place where dreams are made",
        "price": 350
      }

    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['App Academy', 'Lost Lands', 'Sweet Dreams'] }
    }, {});
  }
};
