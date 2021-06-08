'use strict';
/* Data Access Object (DAO) module for accessing tasks */

const sqlite = require('sqlite3');
const dayjs = require("dayjs");

// open the database 
const db = new sqlite.Database('rentals.sqlite', (err) => {
  if (err) throw err;
});

//GET all categories 

exports.listCategories = () => {
  return new Promise((resolve, reject) => {

    const sql = `select * from pricing where item like '_'`;

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
  
      const categories = rows.map((e) => {
        return ({
          id: e.id,
          item: e.item,
          price: e.price,
        });
      });
      resolve(categories);
    });

  });

};

// Get the list of all the avaliable cars 
exports.getAvaliableCars = (category) => {
  return new Promise((resolve, reject) => {
    const sql = `select count(*) as 'Avaliable' from cars where category =?`;
    db.get(sql, [category], (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (row == undefined) {
        reject({ errorMessage: "Category  not found." });
      }
      else {
        const car =
        {
          Avaliable: row.Avaliable
        }

        return resolve(car);
      }
    });
  });
};


// add a new rental
exports.createRental = (rental) => {
  return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO rentals ( userid, start_date, end_date, category, miles, driver_age, extra_drivers, insurance, rental_price ) VALUES(?,?,?,?,?,?,?,?,?)';
      db.run(sql, [ rental.userid , rental.start_date, rental.end_date, rental.category, rental.miles, rental.driver_age, rental.extra_drivers, rental.insurance, rental.rental_price ],
          function (err) {
              if (err) {
                  reject(err);
                  return console.log(err);
              }
              //****console.log("lastid", this.lastID )
              resolve(this.lastID);
          });
  });
};

// get all the rentals of today 
exports.listRentalsOfToday = () => {
  return new Promise((resolve, reject) => {

    const sql =  `SELECT * FROM rentals WHERE start_date = "${dayjs().format("YYYY-MM-DD")}" AND end_date= "${dayjs().format("YYYY-MM-DD")}"`;

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
  
      const rentals = rows.map((e) => {
        return ({
          id: e.id,
          userid: e.userid,
          start_date: e.start_date,
          end_date: e.end_date,
          category: e.category,
          miles:e.miles,
          driver_age:e.driver_age,
          extra_drivers:e.extra_drivers,
          insurace:e.insurance,
          rental_price:e.rental_price
        });
      });
      resolve(rentals);
    });

  });

};

// get all the rentals of past 
exports.listRentalsOfPast = () => {
  return new Promise((resolve, reject) => {

    const sql =  `SELECT * FROM rentals WHERE start_date < "${dayjs().format("YYYY-MM-DD")}" AND end_date < "${dayjs().format("YYYY-MM-DD")}"`;

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
  
      const rentals = rows.map((e) => {
        return ({
          id: e.id,
          userid: e.userid,
          start_date: e.start_date,
          end_date: e.end_date,
          category: e.category,
          miles:e.miles,
          driver_age:e.driver_age,
          extra_drivers:e.extra_drivers,
          insurace:e.insurance,
          rental_price:e.rental_price
        });
      });
      resolve(rentals);
    });
  });
};


//get all the rentals of future 
exports.listRentalsOfFuture = () => {
  return new Promise((resolve, reject) => {

    const sql =  `SELECT * FROM rentals WHERE start_date > "${dayjs().format("YYYY-MM-DD")}" AND end_date > "${dayjs().format("YYYY-MM-DD")}"`;

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
  
      const rentals = rows.map((e) => {
        return ({
          id: e.id,
          userid: e.userid,
          start_date: e.start_date,
          end_date: e.end_date,
          category: e.category,
          miles:e.miles,
          driver_age:e.driver_age,
          extra_drivers:e.extra_drivers,
          insurace:e.insurance,
          rental_price:e.rental_price
        });
      });
      resolve(rentals);
    });
  });
};


// Delete a rental 
exports.deleteRental = (id) => {
  return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM rentals WHERE id = ?';
      db.run(sql, [id], (err) => {
          if (err) {
              reject(err);
              return;
          } else
              resolve(null);
      });
  });
}

// Get the list of all the avaliable cars 
exports.TotalRentalOfCustomer = (userid) => {
  return new Promise((resolve, reject) => {
    const sql = `select count(*) as 'Customer' from rentals where userid =?`;
    db.get(sql, [userid], (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (row == undefined) {
        reject({ errorMessage: "User Not found." });
      }
      else {
        const customer =
        {
          Customer: row.Customer
        }

         resolve(customer);
      }
    });
  });
};


