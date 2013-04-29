var dbm = require('db-migrate'),
    type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('users', {
    id: {type: 'int', notNull: true, primaryKey: true, autoIncrement: true},
    login: {type: 'string', length: 255, defaultValue: '', notNull: true},
    hashed_password: {type: 'string', length: 40, defaultValue: '', notNull: true},
    firstname: {type: 'string', length: 30, defaultValue: '', notNull: true},
    lastname: {type: 'string', length: 30, defaultValue: '', notNull: true},
    mail: {type: 'string', length: 60, defaultValue: '', notNull: true},
    status: {type: 'int', defaultValue: 1, notNull: true},
    last_login_on: 'datetime',
    created_on: 'datetime',
    updated_on: 'datetime',
    salt: {type: 'string', length: 64}
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('users', callback);
};
