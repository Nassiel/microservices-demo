'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('users', [
        {id: 1, name: 'jane', email: 'jane.doe@example.com'},
        {id: 2, name: 'minnie', email: 'minnie@example.com'}
      ], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('users', null, {});
  }
};
