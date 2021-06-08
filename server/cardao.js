'use strict';
/* Data Access Object (DAO) module for accessing tasks */

const sqlite = require('sqlite3');

const filters = ["A", "B", "C", "D", "E", "Audi", "Kia", "Nissan", "Mercedes"];

// open the database 
const db = new sqlite.Database('rentals.sqlite', (err) => {
  if (err) throw err;
});


//GET the list of the cars 

exports.listcars = () => {
  return new Promise((resolve, reject) => {

    const sql = 'SELECT * FROM cars';

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      // specify all the object you wanna return 
      const cars = rows.map((e) => {
        return ({
          id: e.id,
          category: e.category,
          brand: e.brand,
          model: e.model,
        });
      });
      resolve(cars);
    });

  });

};


// Filter the list of the tasks 
exports.filterCarList = (filter) => {
  return new Promise((resolve, reject) => {
    if (filters.find(item => item === filter) == undefined) {
      reject({ errorMessage: "Filter not available!" });
      return;
    }

    const sql = {

      "A": "SELECT * FROM cars WHERE category = 'A'",
      "B": "SELECT * FROM cars WHERE category = 'B'",
      "C": "SELECT * FROM cars WHERE category = 'C'",
      "D": "SELECT * FROM cars WHERE category = 'D'",
      "E": "SELECT * FROM cars WHERE category = 'E'",
      "Audi": `select * from cars WHERE brand ='AUDI'`,
      "Kia": "SELECT * FROM cars WHERE brand = 'KIA'",
      "Nissan": "SELECT * FROM cars WHERE brand = 'NISSAN'",
      "Mercedes": "SELECT * FROM cars WHERE brand = 'MERCEDES'",
    }

    db.all(sql[filter], [], (err, rows) => {

      if (err) {
        reject(err);
        return;
      }

      if (rows === undefined) {
        reject({ errorMessage: `Filter ${filter} not available` });
        return;
      }
      else {
        const cars = rows.map(e => {
          return ({
            id: e.id,
            category: e.category,
            brand: e.brand,
            model: e.model,
          });

        });
        resolve(cars);
      }

    });
  });
};



// exports.listcarsfilters = () => {
//   return new Promise((resolve, reject) => {

//     const sql = `select  id , category , brand from cars`;

//     db.all(sql, [], (err, rows) => {
//       if (err) {
//         reject(err);
//         return;
//       }
//       // specify all the object you wanna return 
//       const filters = rows.map((e) => {
//         return ({
//           id: e.id,
//           category: e.category,
//           brand: e.brand,
//         });
//       });
//       resolve(filters);
//     });

//   });

// };

// exports.listfilters = () => {
//   return new Promise((resolve, reject) => {

//     const sql = 'SELECT  * from filters ';

//     db.all(sql, [], (err, rows) => {
//       if (err) {
//         reject(err);
//         return;
//       }
//       // specify all the object you wanna return 
//       const filterlist = rows.map((e) => {
//         return ({
//           id: e.id,
//           filtertype : e.filtertype,
//         });
        

//       });
//       resolve(filterlist);
//     });

//   });

// };



