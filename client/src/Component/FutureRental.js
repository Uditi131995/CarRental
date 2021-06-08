import {Table , Container , Button} from 'react-bootstrap'
import {useState , useEffect} from 'react'
import API from '../API';
import * as Icons from '../Icons.js'
function FutureRental(props) {
     // Array of object to load all the rentals 
     const [rentals, setRentals] = useState([])
     const [deleteRentalStatus, setDeleteRentalStatus] =useState(false)

     const deleteRental = (id) => {
        setRentals(oldState => oldState.filter(rental => rental.id !== id))
        API.deleteRental(id).then(response => {
            setDeleteRentalStatus(true)
    
        }).catch((err) => {
          console.log(`Something went Wrong: ${err.message} `)
        });
      }

     useEffect(() => {
        try {
            if (props.loggedIn)
                API.loadFutureRental().then(response => {
                     //console.log("api", response)
                    setRentals(response);
                });
        }
        catch (err) {
            console.log(`Something went Wrong: ${err.message} `)
        }
    }, [props.loggedIn , deleteRentalStatus]);

    return (
        <>
            <RentalTable rentals={rentals} deleteRental={deleteRental}/> 

        </>
    )
}

function RentalTable(props){
    //console.log("Past Rentals" , props.rentals)
    return(
         <>
         <br/>
        <Container>
            <h4 style ={{ color: '#17a2b8' }}>Your Future Booking </h4> <br/>
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
          <th>Price(Euro)</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
      {props.rentals.map((rental) => <RentalRow  key={rental.id} 
      rental={rental}
      deleteRental={props.deleteRental}
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
        <tr>
          <RentalRowData {...props}/>
          <DeleteControl  deleteRental={props.deleteRental} rental={props.rental}/>
        
        </tr>

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

function DeleteControl(props){
    return(
        <td>
        <Button style={{ margin: '3px' }} variant="light" size="sm" onClick={()=>props.deleteRental(props.rental.id)}>{Icons.deleteTask}</Button>
        </td>
    )
}
export {FutureRental}
