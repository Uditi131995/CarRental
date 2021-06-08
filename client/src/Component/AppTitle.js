import { Navbar, Nav } from 'react-bootstrap'
import * as Icons from '../Icons.js'
import { Link } from 'react-router-dom'

function AppTitle() {
    return (
        <>
            <Navbar  className="d-flex justify-content-between" bg="info" expand="lg">
            <Nav.Item>
                &nbsp; &nbsp; {Icons.logo}
                &nbsp; <span style={{ color: 'white' }}>Car Rental</span>
                </Nav.Item>

                <Nav.Item>
                <h3 style={{ color: 'white' }}>Welcome ! Start Renting</h3>
                </Nav.Item>

                <Link to="/sessions">
                <Nav.Item> {Icons.User}</Nav.Item> 
                </Link>

            </Navbar>






        </>
    )
}

export { AppTitle }
