var models = require('models'),
    persist = require('persist'),
    dbConnector = require('db-connect'),
    domain = require('domain'),
    async = require('async');

var transactionTemplate = function() {
  var connection,
      transaction,
      d = domain.create();

  d.on('error', function(err) {
    d.dispose();
    console.log(err);
    if (!transaction) {
      throw err;
    }
    transaction.rollback(function(rollbackErr) {
      if (rollbackErr) {
        throw rollbackErr;
      }
      if (!connection) {
        throw err;
      }
      connection.close();
    });
  });

  return {
    doInTransaction: function(callback) {
      d.run(function() {
        dbConnector.connect(d.intercept(function(conn) {
          connection = conn;
          conn.tx(d.intercept(function(tx) {
            transaction = tx;
            callback(conn, d.intercept(function(next) {
              tx.commit(d.intercept(function() {
                conn.close();
                if (next) {
                  next();
                }
              }));
            }));
          }));
        }));
      });
    },
    createDomain: function() {
      return d;
    }
  };
}();

var d = transactionTemplate.createDomain();

/////////////////////////////////////////////////////////////////////////////////////

async.series([
  // create default administrator account  
  function(next) {
    var User = models.requireModel('user');
    var adminUser = {
      login: 'admin',
      hashedPassword: '4b6e869fa529b2dbf61fef4368bd87aa26f4a4e2',
      firstname: 'Admin',
      lastname: 'Admin',
      mail: 'admin@example.jp',
      status: 1,
      salt: 'pkm34fj6ir7jndj2fe0'  
    };
    transactionTemplate.doInTransaction(function(conn, callback) {
      conn.chain({
        deleteAdmin:  User.where('login = ?', 'admin').deleteAll,
        maxId: User.max('id')
      },
      d.intercept(function(results) {
        conn.chain([
          persist.runSql('ALTER TABLE users AUTO_INCREMENT = ?', results.maxId ? results.maxId + 1 : 1),
          (new User(adminUser)).save
        ],
        function(err, results) {
          callback(err, next);
        });
      }));
    });
  }
],
d.intercept(function() {}));
