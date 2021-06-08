import { Form, Col, Container, Button, Alert, Row } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import API from '../API';
import dayjs from 'dayjs'

function RentalForm(props) {

    const [startdate, setStartDate] = useState('')
    const [enddate, setEndDate] = useState('')
    const [category, setCategory] = useState('')
    const [miles, setMiles] = useState(0)
    const [age, setAge] = useState(0)
    const [extradriver, setExtraDriver] = useState(0)
    const [radio, setRadio] = useState('')


    // Array of object to load all the categories
    const [categories, setCategories] = useState([])

    //State variable to store the number of total avaliable cars 
    const [avaliableCar, setAvaliableCar] = useState(0)

    // Boolean state variable to check if the task is added or not
    const [addRentalStatus, setAddRentalStatus] = useState(false)

    // Boolean state variable to understand where the form is submitted or not 
    const [submitted, setSubmitted] = useState(false);

    // The total customer Rental
    const [customerCount, setCustomerCount] = useState({})

    // To check whether the date is valid or not 
    const [validDate, setValidDate] = useState(true);

    // Error Message for Date 
    const [dateErrorMessage, setdateErrorMessage] = useState("");


    useEffect(() => {
        try {
            if (props.loggedIn)
                API.loadAllCategories().then(response => {
                    //*** console.log("api", response)
                    setCategories(response);
                });
        }
        catch (err) {
            console.log(`Something went Wrong: ${err.message} `)
        }
    }, [props.loggedIn]);


    useEffect(() => {
        try {
            if (props.user)
                API.loadCustomerRental(props.user.id).then(response => {
                    //*** console.log("api", response)
                    setCustomerCount(response);
                });
        }
        catch (err) {
            console.log(`Something went Wrong: ${err.message} `)
        }
        // eslint-disable-next-line
    }, [props.user]);

    //start_date: dayjs(startdate).format('DD-MM-YYYY'),
    //end_date: dayjs(enddate).format('DD-MM-YYYY'),

    useEffect(() => {
        if (addRentalStatus) {
            API.addRental(
                ({
                    userid: props.user.id,
                    start_date:startdate,
                    end_date: enddate,
                    category: category,
                    miles: miles,
                    driver_age: age,
                    extra_drivers: extradriver,
                    insurance: radio,
                    rental_price: props.rentalPrice

                })
            )
            setAddRentalStatus(false)

            //setsubmitted(true) // As soon we submitted=true go back to the home page 

        }
        // eslint-disable-next-line
    }, [addRentalStatus]);

    const handleCheck = (event) => {
        event.preventDefault();
        let valid = true
        let category_price = 0;
        let miles_price = 0;
        let ages_price = 0;
        let drivers_price = 0;
        let insurance_price = 0;
        let lesscar_price = 0;
        let customer_price = 0;

        // START DATE VALIDATION

        if (startdate && dayjs(startdate).isBefore(dayjs(), 'date')) {
            valid = false;
            setValidDate(false);
            setdateErrorMessage("please choose a date for today or future...")
        }

        else {
            setValidDate(true);
        }

        // END DATE VALIDATION SIMILARLY

        //-----IF - Category 
        if (category === 'A') {
            valid = true
            category_price = 80

        }
        else if (category === 'B') {
            valid = true
            category_price = 70
        }

        else if (category === 'C') {
            valid = true
            category_price = 60

        }
        else if (category === 'D') {
            valid = true
            category_price = 50

        }

        else if (category === 'E') {
            valid = true
            category_price = 40

        }
        // ----- IF -MILES 
        if (miles < 50) {
            miles_price = -5 / 100 * category_price

        }
        else if (miles < 150) {
            miles_price = 0
        }

        else if (miles > 150) {
            miles_price = 5 / 100 * category_price
        }

        // ----- IF DRIVER  AGE

        if (age < 25) {
            ages_price = 5 / 100 * category_price
        }

        if (age > 65) {
            ages_price = 10 / 100 * category_price
        }

        // ----- IF EXTRA DRIVER AND ONLY ONE TIME FEE 
        if (extradriver !== 0 && customerCount === 1) {
            drivers_price = 15 / 100 * category_price
        }

        // -------IF INSURANCE 
        if (radio === 'Yes') {
            insurance_price = 20 / 100 * category_price
        }

        // ----------IF LESS THEN 10 PERCENT CAR IS AVALIABLE
        if (avaliableCar < 10 / 100 * category_price) {

            lesscar_price = 10 / 100 * category_price
        }

        if (customerCount > 3) {

            customer_price = -10 / 100 * category_price
        }

        //---- THE FINAL IF 
        if (valid) {
            let rental_price = category_price + miles_price + ages_price + drivers_price + insurance_price + lesscar_price + customer_price
            props.setRentalPrice(rental_price);
            //console.log("Total" , rental_price)
        }

    }

    const handlerental = (event) => {
        event.preventDefault();
        setAddRentalStatus(true);
        setSubmitted(true);

    }

    const handlereset =(event) =>{
        setStartDate('')
        setEndDate('')
        setCategory('')
        setMiles(0)
        setAge(0)
        setExtraDriver(0)
        setRadio('')
    }
    //***console.log("Category : " , category)
    //***console.log("In components avaliable" , avaliableCar)
    //****console.log("Customer Count" , customerCount)

    return (
        <>
            {submitted ? <Redirect to='/payment'></Redirect> : ""}
            <Container>

                <br />
                <Row className="justify-content-md-center">
                    <Col className="border rounded-lg" md={4} sm={12}>
                        <br />

                        {avaliableCar ? <Alert variant='success'>{'The number of avaliable cars for this category : ' + category + '=' + avaliableCar.Avaliable}</Alert> : ''}
                        {props.rentalPrice ? <Alert variant='success'>{'The total rental price :' + props.rentalPrice + ' Euro'}</Alert> : ''}
                        {props.paymentStatus ? <Alert variant='success'>{'Your Payment was Succesfull'}</Alert> : ''}

                        <br />
                        <h3 style={{ color: '#17a2b8' }}>Rental Form</h3>
                        <Form>
                            {/*  START DATE  */}
                            <Form.Row>
                                <Form.Group as={Col} controlId="startDate">
                                    <Form.Label>Start Day</Form.Label>
                                    <Form.Control
                                        type="date"
                                        placeholder="Select Start Day"
                                        value={startdate}
                                        onChange={(event) => { setStartDate(event.target.value) }}
                                    />
                                     <Form.Text id="selectextradriver" muted>
                                      Start Date is complusory 
                                     </Form.Text> 
                                     <br/>
                                    {validDate ? "" : <Form.Text className="pl-3 font-weight-bold text-monospace text-danger">{dateErrorMessage}</Form.Text>}
                                </Form.Group>

                                {/* END DATE */}
                                <Form.Group as={Col} controlId="endDate">
                                    <Form.Label>End Day</Form.Label>
                                    <Form.Control
                                        type="date"
                                        placeholder="Select End Day"
                                        value={enddate}
                                        onChange={(event) => { setEndDate(event.target.value) }}
                                    />
                                    <Form.Text id="selectextradriver" muted>
                                      End Date is complusory 
                                     </Form.Text> 
                                </Form.Group>
                            </Form.Row>

                            {/* CATEGORY */}
                            <Form.Group controlId='selectcategory'>
                                <Form.Label>Category</Form.Label>
                                <Form.Control as='select' value={category} onChange={(event) => {
                                    setCategory(event.target.value)
                                    API.loadAllAvaliableCar(event.target.value).then(response => {
                                        setAvaliableCar(response)
                                    })

                                }}>
                                    <option value='' hidden disabled>Select one Category</option>
                                    {categories.map(category =>
                                        <option key={category.id} value={category.item}>
                                            {category.item}
                                        </option>)}
                                </Form.Control>
                            </Form.Group>

                            {/* KILOMETER */}
                            <Form.Group controlId='selectkilometer'>
                                <Form.Label>Miles To Ride</Form.Label>
                                <Form.Control
                                    type='number'
                                    placeholder="Select the KM"
                                    min="1"
                                    value={miles}
                                    onChange={(event) => { setMiles(event.target.value) }}
                                />
                            </Form.Group>

                            {/* DRIVER AGE */}
                            <Form.Group controlId='selectage'>
                                <Form.Label>Driver Age</Form.Label>
                                <Form.Control
                                    type='number'
                                    min="18"
                                    max="70"
                                    placeholder="Select Age"
                                    value={age}
                                    onChange={(event) => { setAge(event.target.value) }}
                                >
                                </Form.Control>
                            </Form.Group>

                            {/* EXTRA DRIVER  */}

                            <Form.Group controlId='selectextradriver'>
                                <Form.Label>Extra Driver</Form.Label>
                                <Form.Control
                                    type='number'
                                    min="0"
                                    max="3"
                                    placeholder="Select Extra Driver"
                                    value={extradriver}
                                    onChange={(event) => { setExtraDriver(event.target.value) }}
                                >
                                </Form.Control>
                                <Form.Text id="selectextradriver" muted>
                                    One time fee for 1 or more extra driver
                                 </Form.Text>
                            </Form.Group>


                            {/* INSURANCE */}

                            <fieldset>
                                <Form.Group controlId='selectinsurance'>
                                    <Form.Label>Insurance&nbsp;</Form.Label>
                                    <Form.Check
                                        inline
                                        id="yes"
                                        type="radio"
                                        label="Yes"
                                        value="Yes"
                                        checked={radio === 'Yes'}
                                        onChange={(event) => { setRadio(event.target.value) }}
                                    />
                                    <Form.Check

                                        inline
                                        id="no"
                                        type="radio"
                                        label="No"
                                        value="No"
                                        checked={radio === 'No'}
                                        onChange={(event) => { setRadio(event.target.value) }}
                                    />
                                </Form.Group>
                            </fieldset>

                            <Button variant="link" onClick={handleCheck}>Check Avaliability</Button> &nbsp;

                            &nbsp;{props.rentalPrice ? <Button variant="danger" onClick={handlereset}>Reset</Button>:"" }&nbsp;
                            
                            &nbsp;{props.rentalPrice ? <Button variant="info" onClick={handlerental}>Rent Now !</Button>:""} &nbsp;
                        </Form>
                        <br />
                    </Col>
                </Row>
            </Container>
        </>

    )
}

export { RentalForm }

