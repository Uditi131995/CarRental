import { Navbar, Nav, Button } from 'react-bootstrap'
import {Link} from 'react-router-dom'
//import * as Icons from '../Icons.js'
function Navcontent(props) {
    return (
        <>
            <Navbar className="d-flex justify-content-between mb-2" bg="info" expand="lg">
                <Nav.Item className="d-flex justify-content-start">
                &nbsp; &nbsp; <Link to="/PastBooking" style={{color:'white'}}>Past Booking</Link>  &nbsp; &nbsp;  
                    <Link to="/TodayBooking" style={{color:'white'}}>Today Booking</Link> &nbsp; &nbsp; 
                    <Link to="/FutureBooking" style={{color:'white'}}>Future Booking</Link> &nbsp; &nbsp; 
                </Nav.Item>
        
                <Nav.Item className="d-flex justify-content-end">
                    {props.loggedIn ? <span style={{ color: 'white' }}>{props.message.msg}</span> :  ""}
                    <Button size="sm" style={{ margin: '3px' }} variant="outline-light" onClick={props.doLogOut}>
                        Logout
                    </Button>
                </Nav.Item>
            </Navbar>
        </>
    )
}

export { Navcontent }
