import {Table , Container} from 'react-bootstrap'
import {useState , useEffect} from 'react'
import API from '../API';
function TodayRental(props) {
     // Array of object to load all the rentals 
     const [rentals, setRentals] = useState([])

     //***console.log("logged state", props.loggedIn)

     useEffect(() => {
        try {
            if (props.loggedIn)
                API.loadTodayRental().then(response => {
                     //console.log("api", response)
                    setRentals(response);
                });
        }
        catch (err) {
            console.log(`Something went Wrong: ${err.message} `)
        }
    }, [props.loggedIn]);

    return (
        <>
            <RentalTable rentals={rentals}/> 

        </>
    )
}

function RentalTable(props){
    //console.log("Past Rentals" , props.rentals)
    return(
         <>
         <br/>
        <Container>
            <h4 style ={{ color: '#17a2b8' }}>Today's  Booking </h4> <br/>
        <Table striped bordered>
      <thead>
        <tr>
          <th>Start Date </th>
          <th>End Date </th>
          <th>Category</th>
          <th>Distance</th>
          <th>Driver's Age</th>
          <th>Extra Driver</th>
          <th>Insurance</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
      {props.rentals.map((rental) => <RentalRow  key={rental.id} 
      rental={rental}
      />)
    }
      </tbody>
      </Table>
        </Container>
</>
    )
}


function RentalRow(props){
    return(
        <>
        <tr><RentalRowData {...props}/></tr>
        </>
    )
}


function RentalRowData(props){
    return(
        <>
        <td>{props.rental.start_date}</td>
        <td>{props.rental.end_date}</td>
        <td>{props.rental.category}</td>
        <td>{props.rental.miles}</td>
        <td>{props.rental.driver_age}</td>
        <td>{props.rental.extra_drivers}</td>
        <td>{props.rental.insurace}</td>
        <td>{props.rental.rental_price}</td>
        </>
    )
}

export {TodayRental}