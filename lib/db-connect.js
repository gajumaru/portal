var config = require('config'),
    Sequelize = require('sequelize');

module.exports = function() {
  var createDBManager = function(sequelize) {
    return {
      loadEntity: function(entityName) {
        return sequelize.import(__dirname + '/../models/' + entityName);
      }
    };
  };
  return {
    connect: function(config) {
      var sequelize;
      if (config.dialect !== 'sqlite') {
        sequelize = new Sequelize(config.database, config.user, config.password, {
          dialect: config.dialect || 'mysql',
          host: config.host,
          port: config.port || 3306
        });
      } else {
        sequelize = new Sequelize('', '', '', {
          dialect: 'sqlite',
          storage: config.storage
        });
      }
      return createDBManager(sequelize);
    },
    connectRedmine: function() {
      return this.connect(config.redmineDatabase);
    }
  }
}();
