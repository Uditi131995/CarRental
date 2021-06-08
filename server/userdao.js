'use strict';
/* Data Access Object (DAO) module for accessing tasks */

const sqlite = require('sqlite3');
const bcrypt = require('bcrypt');

// open the database 
const db = new sqlite.Database('rentals.sqlite', (err) => {
    if (err) throw err;
});

// DAO operations for validating users

exports.getUser = (email, password) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * from users where email =?`;
        db.get(sql, [email], (err, row) => {
            if (err)
                reject(err) // DB error 
            else if (row === undefined)
                resolve({error: 'User not found.'}) // No such user present
            else {
                bcrypt.compare(password, row.hash).then(result => {
                    if (result)
                        resolve({ id: row.id, username: row.email, name: row.name })
                    
                    else
                        resolve(false) // password don't match 

                })
            }

        })

    })
}

exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE id = ?';
        db.get(sql, [id], (err, row) => {
          if (err) 
            reject(err);
          else if (row === undefined)
            resolve({error: 'User not found.'});
          else {
            // by default, the local strategy looks for "username": not to create confusion in server.js, we can create an object with that property
            const user = {id: row.id, username: row.email, name: row.name}
            resolve(user);
          }
      });
    });
  };