const express = require('express');
const morgan = require('morgan'); // logging middleware
const passport = require('passport');
const passportLocal = require('passport-local');
const session = require('express-session'); // session middleware

const carDao = require('./cardao'); // module for accessing the DB
const userDao = require('./userdao'); // module for accessing the DB
const rentalDao =require('./rental_dao');

// initialize and configure passport
passport.use(new passportLocal.Strategy((username, password, done) => {
    // verification callback for authentication
    userDao.getUser(username, password).then(user => {
      //*****console.log("Login" , user)
      if (user)
        done(null, user);
      else
        done(null, false, { message: 'Username or password wrong' });
    }).catch(err => {
      done(err);
    });
  }));
  
  // serialize and de-serialize the user (user object <-> session)
  // we serialize the user id and we store it in the session: the session is very small in this way
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    userDao.getUserById(id)
      .then(user => {
        done(null, user); // this will be available in req.user
      }).catch(err => {
        done(err, null);
      });
  });

const PORT = 3001;
const app = new express();

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
      return next();
  
    return res.status(401).json({ error: 'not authenticated' });
  }
  
  // initialize and configure HTTP sessions
  app.use(session({
    secret: 'this and that and other',
    resave: false,
    saveUninitialized: false
  }));

// tell passport to use session cookies
app.use(passport.initialize());
app.use(passport.session());

//Defines routes and web pages all will contain the session as its registered as middleware

// POST /login 
// login
app.post('/api/sessions', function(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err)
        return next(err);
        if (!user) {
          // display wrong login messages
          return res.status(401).json(info);
        }
        // success, perform the login
        req.login(user, (err) => {
          if (err)
            return next(err);
          
          // req.user contains the authenticated user, we send all the user info back
          // this is coming from userDao.getUser()
          return res.json(req.user);
        });
    })(req, res, next);
  });
  // DELETE /sessions/current 
  // logout
  app.delete('/api/sessions/current', (req, res) => {
    req.logout();
    res.end();
  });
  
  // GET /sessions/current
  // check whether the user is logged in or not
  app.get('/api/sessions/current', (req, res) => {
    if(req.isAuthenticated()) {
      res.status(200).json(req.user);}
    else
      res.status(401).json({error: 'Unauthenticated user!'});;
  });

//-------Routes : Car_dao-------------------------------

// Get the list of cars 
app.get('/api/cars', async (req, res) => {
    try {
        const cars =  await carDao.listcars()
        res.json(cars)
    } catch (err) {
        res.status(500).end();
    }
})

// Filter the cars

//GET /cars/filter/:filter  
app.get('/api/cars/filter/:filter', async (req, res) => {
    const filter = req.params.filter
    //console.log(`${filter}`)
    try {
        const result = await carDao.filterCarList(filter);
        console.log("result" , result)
        if (result.error)
            res.status(404).json(result);
        else
            res.json(result);
    } catch (err) {
        res.status(500).end();
    }
})

//--------Routes: rental_dao------------------------
// To get all the category 
app.get('/api/categories', async (req, res) => {
  try {
      const categories =  await rentalDao.listCategories()
      res.json(categories)
  } catch (err) {
      res.status(500).end();
  }
})

// To get the avaliable car 
app.get('/api/avaliable/cars/:category', async (req, res) => {
  try {
      const car =  await rentalDao.getAvaliableCars(req.params.category)
      res.json(car)
  } catch (err) {
      res.status(500).end();
  }
})




//POST/api/addtask
app.post('/api/addrental', async (req, res) => {
  const rental ={
    userid: req.body.userid,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    category: req.body.category,
    miles: req.body.miles,
    driver_age: req.body.driver_age,
    extra_drivers: req.body.extra_drivers,
    insurance:req.body.insurance,
    rental_price:req.body.rental_price

  }
  try {

    console.log("Body" , rental)
    await rentalDao.createRental(rental)
    res.status(201).end();
  } catch (err) {
    res.status(503).json(err)
  }

})
// Get all the rentals of Today 
app.get('/api/TodayBooking', async (req, res) => {
  try {
      const rentals =  await rentalDao.listRentalsOfToday()
      res.json(rentals)
  } catch (err) {
      res.status(500).end();
  }
})

// Get the past rentals 
app.get('/api/PastBooking', async (req, res) => {
  try {
      const rentals =  await rentalDao.listRentalsOfPast()
      res.json(rentals)
      console.log(rentals)
  } catch (err) {
      res.status(500).end();
  }
})


app.get('/api/FutureBooking', async (req, res) => {
  try {
      const rentals =  await rentalDao.listRentalsOfFuture()
      res.json(rentals)
  } catch (err) {
      res.status(500).end();
  }
})

//Delete a future rentals 
// DELETE /api/deleterental/<id>
app.delete('/api/deleterental/:id',async (req, res) => {
  try {
    await rentalDao.deleteRental(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(503).json({ error: `Database error during the deletion of task ${req.params.id}.` });
  }
});


app.get('/api/customer/:userid', async (req, res) => {
  try {
      const customer =  await rentalDao.TotalRentalOfCustomer(req.params.userid)
      res.json(customer)
  } catch (err) {
      res.status(500).end();
  }
})

app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));