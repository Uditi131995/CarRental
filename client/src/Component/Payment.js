import { Form, Container, Button } from 'react-bootstrap'
import { useState } from 'react'
import { Redirect} from 'react-router-dom';
function Payment(props) {

   
    // Boolean state variable if submitted direct to the /configure page 
    const [submittedPayment, setsubmittedPayment] = useState(false)

    // Boolean state variable to check the status for form validation
    const [validated, setValidated] = useState(false);


    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
        if (validated) {
            props.setRentalPrice(0)
            setsubmittedPayment(true);
            props.setPaymentStatus(true);
            
        } 
    }
    console.log("Submit payment" , submittedPayment)
    return (
        <>
            {submittedPayment ? <Redirect to="/configure" /> : ""}
            <Container> <br />
                <h4 style={{ color: 'red' }}> Payment Form</h4>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group controlId='fullName'>
                        <Form.Label>Full Name </Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Please enter the your Full Name"
                            maxLength="30"
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId='AccountNumber '>
                        <Form.Label>Enter Your Account Number  </Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Please enter your Account Number"
                            maxLength="13"
                        >
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            Please provide a Account Number.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId='CVV '>
                        <Form.Label>Enter Your CVV  </Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Please enter your CVV"
                            maxLength="3"
                        >
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            Please provide your 3 digit CVV.
                        </Form.Control.Feedback>
                    </Form.Group>

                    
                    <Form.Group controlId='Rent Price '>
                        <Form.Label>Enter Your Rental Price  </Form.Label>
                        <Form.Control
                            readOnly
                            type="text"
                            value ={props.rentalPrice}   
                        >
                        </Form.Control>
                    </Form.Group> <br />

                    <Button variant="info" type="submit">Make Payment </Button>
                    </Form>
            </Container>




        </>
    )
}

export { Payment }
