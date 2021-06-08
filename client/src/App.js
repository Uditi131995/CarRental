//import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { useState, useEffect } from 'react'
import { Navcontent } from './Component/Navcontent'
import { MainContent } from './Component/MainContent'
import { LoginForm } from './Component/LoginComponents';
import { Payment } from './Component/Payment'
import { AppTitle } from './Component/AppTitle'
import API from './API';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Switch, Redirect } from 'react-router-dom'
import { RentalForm } from './Component/RentalForm';
import {PastRental} from './Component/PastRental'
import {FutureRental} from './Component/FutureRental'
import {TodayRental} from './Component/TodayRental'

const filters = ["A", "B", "C", "D", "E", "Audi", "Kia", "Nissan", "Mercedes"];

function App() {

  const [list, setList] = useState([]);

  //const [filter, setFilter] = useState([]);

  // at the beginning, no user is logged in
  const [loggedIn, setLoggedIn] = useState(false);

  // Object state for the load of the user 
  const [user, setUser] = useState({ name: '' });

  const [message, setMessage] = useState('');

   // Boolean State variable to store the rental price of the car 
   const [rentalPrice, setRentalPrice] = useState(0)

  // Boolean State varibale to  show the rental price or the payment confirmation
  const [paymentStatus, setPaymentStatus] =useState(false)

  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // here you have the user info, if already logged in
        // get the user object from the session
        // API.getUserInfo returns the user object
        // if there is an user stored in the cookies of the session
        // otherwise returns {error: "errorMessage"}
        const user = await API.getUserInfo();
        if (user.error === "not authenticated") {
          setLoggedIn(false);
          setUser({ name: "" })
        }
        else {
          setLoggedIn(true);
          setUser(user);

        }
      } catch (err) {
        console.error(err.error);
      }
    };
    checkAuth();
  }, []);

  // Rehydrate the tasks at the mount time 
  useEffect(() => {
    try {
      API.loadAllCars().then(response => {
        setList(response);
      });
    }
    catch (err) {
      console.log(`Something went Wrong: ${err.message} `)
    }
  }, []);


  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setUser(user)
      setMessage({ msg: `Welcome, ${user.name}!`, type: 'success' });
      return true;
    } catch (err) {
      setMessage({ msg: err, type: 'danger' });
      return false;
    }
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    // clean up everything;

  }

 // const changeFilter = (filtername) => setFilter(oldfilter => { return (filtername) });

  return (
    <Router>
      <Switch>
        {/* Path 1 : I first browse the list  */}
        <Route exact path="/" render={() => {
          return (
            <>
              {/* <Navcontent /> */}
              <AppTitle />
              <MainContent
                list={list}                 // entire list 
                filters={filters}           // all the filters to show in the filter row  
                setList={setList}             
              />

            </>
          )
        }
        }
        />

        {/* Path 2 : If logged in , congifure page otherwise in login form  */}
        {/* Link to session is avaliable in the AppTilte */}
        <Route path="/sessions" render={() =>
         <>
         {loggedIn ? 
         <Redirect to="/configure"/> 
          : 
         <LoginForm login={doLogIn}/>}
          </>
        }
         />


        <Route path="/configure" render={() => {
          return (
            <>
              {loggedIn ?
                <>
                  <Navcontent doLogOut={doLogOut} message={message} loggedIn={loggedIn} />
                  <RentalForm user={user} loggedIn={loggedIn} rentalPrice={rentalPrice}  setRentalPrice={setRentalPrice} paymentStatus={paymentStatus}/>
                </>
                : 
                <Redirect to="/sessions" />}
            </>
          )
        }}
        />

        <Route path="/payment" render ={()=>{
          return(
            <>
            {loggedIn ?
            <Payment rentalPrice={rentalPrice} setPaymentStatus={setPaymentStatus} setRentalPrice={setRentalPrice} paymentStatus={paymentStatus}/>
            :
            <Redirect to="/sessions" /> 
            }
            </>
          )
        }
         
        }/>
         
    
         <Route path="/PastBooking" render={() => {
          return (
            <>
              {loggedIn ?
                <>
                  <PastRental loggedIn={loggedIn}/>
                </>
                : <Redirect to="/sessions" />}
            </>
          )
        }}
        />

        <Route path="/TodayBooking" render={() => {
          return (
            <>
              {loggedIn ?
                <>
                  <TodayRental loggedIn={loggedIn}/>
                </>
                : <Redirect to="/sessions" />}
            </>
          )
        }}
        />

        
         <Route path="/FutureBooking" render={() => {
          return (
            <>
              {loggedIn ?
                <>
                 <FutureRental loggedIn={loggedIn}/>
 
                </>
                : <Redirect to="/sessions" />}
            </>
          )
        }}
        />

      </Switch>
    </Router>
  );
}

export default App;


