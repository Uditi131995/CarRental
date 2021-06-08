const url = 'http://localhost:3000';

//------------------LogIn a user---------------------------------
async function logIn(credentials) {
    let response = await fetch('/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if(response.ok) {
      const user = await response.json();
      return user;
    }
    else {
      try {
        const errDetail = await response.json();
        throw errDetail.message;
      }
      catch(err) {
        throw err;
      }
    }
  }
  //-----------------Logout a user ------------------------

  async function logOut() {
    await fetch('/api/sessions/current', { method: 'DELETE' });
  }
//------------------Get the current sessions -----------------------
  async function getUserInfo() {
    const response = await fetch( url + '/api/sessions/current');
    const userInfo = await response.json();
    if (response.ok) {
      return userInfo;
    } else {
      throw userInfo;  // an object with the error coming from the server
   
    }
  }

  //----- Load the list of cars 

async function loadAllCars() {
    try {
        const response = await fetch(url + '/api/cars').then(response => {
            //Always check if the response is ok or not 
            if (!response.ok)
                throw Error(response.status)
            return response;
        });
        const fetchedcars = await response.json();
        return fetchedcars;
    }
    catch (error) {
        console.log(error)
    }
}

// -------- Filter the list according to the check -----------------------------
async function filterList(checked) {
    try {
        const response = await fetch(url + '/api/cars/filter/' + checked).then(response => {
            //Always check if the response is ok or not 
            if (!response.ok)
                throw Error(response.status)
            return response;
        });
        const fetchedcars = await response.json();
        return fetchedcars;
    }
    catch (error) {
        console.log(error)
    }
}


async function loadAllCategories() {
  try {
      const response = await fetch(url + '/api/categories').then(response => {
          //Always check if the response is ok or not 
          if (!response.ok)
              throw Error(response.status)
          return response;
      });
      const fetchedcategories = await response.json();
      //***console.log("fetched",fetchedcategories)
      return fetchedcategories;

  }
  catch (error) {
      console.log(error)
  }
}

async function loadAllAvaliableCar(category) {
  try {
      const response = await fetch(url + '/api/avaliable/cars/' + category).then(response => {
          //Always check if the response is ok or not 
          if (!response.ok)
              throw Error(response.status)
          return response;
      });
      const avaliableCar = await response.json();
      //console.log("avaliable car ", avaliableCar)
      return avaliableCar ;

  }
  catch (error) {
      console.log(error)
  }
}


// Add a rental in the table 

// Receive a task as object with all the properties which needs to get added 
async function addRental(rental) {
  const response = await fetch(url + '/api/addrental',
      {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...rental })
      });
  if (response.ok) {
      return null;
  } else return { 'err': 'POST error' }

}


async function loadpastRental() {
  try {
      const response = await fetch(url + '/api/PastBooking').then(response => {
          //Always check if the response is ok or not 
          if (!response.ok)
              throw Error(response.status)
          return response;
      });
      const pastRentals = await response.json();
      // ****console.log("rentals", pastRentals)
      return pastRentals;

  }
  catch (error) {
      console.log(error)
  }
}

async function loadTodayRental() {
  try {
      const response = await fetch(url + '/api/TodayBooking').then(response => {
          //Always check if the response is ok or not 
          if (!response.ok)
              throw Error(response.status)
          return response;
      });
      const todayRentals = await response.json();
      //****console.log("today rentals",todayRentals )
      return todayRentals;

  }
  catch (error) {
      console.log(error)
  }
}

async function loadFutureRental() {
  try {
      const response = await fetch(url + '/api/FutureBooking').then(response => {
          //Always check if the response is ok or not 
          if (!response.ok)
              throw Error(response.status)
          return response;
      });
      const futureRentals = await response.json();
      // ****console.log("rentals", pastRentals)
      return futureRentals;

  }
  catch (error) {
      console.log(error)
  }
}

//-------------------Delete Task By id  ----------------------------------
async function deleteRental(id) {
  await fetch(url + '/api/deleterental/' + id , { method :"DELETE"})
}

async function loadCustomerRental(userid) {
  try {
      const response = await fetch(url + '/api/customer/' + userid).then(response => {
          //Always check if the response is ok or not 
          if (!response.ok)
              throw Error(response.status)
          return response;
      });
      const totalrental = await response.json();
      //****console.log("Total Rental ", totalrental)
      return totalrental ;

  }
  catch (error) {
      console.log(error)
  }
}





const API = { loadAllCars, filterList ,logIn,logOut, getUserInfo, loadAllCategories , loadAllAvaliableCar, addRental , loadpastRental , loadFutureRental , loadTodayRental , deleteRental , loadCustomerRental};
export default API;





