import { Form, Button, Alert  , Container , Row , Col} from 'react-bootstrap';
import { useState } from 'react';
//import { Redirect } from 'react-router';

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('') ;
  //const [passwordError , setpasswordError] = useState('')
  
  const handleSubmit = async (event) => {
      event.preventDefault();
      setErrorMessage('');
      const credentials = { username, password };
      
      // SOME VALIDATION, ADD MORE!!!
      let valid = true;
      if(username === '' || password === '' )
      {
          valid = false;
          setErrorMessage('Username or Password not provided')
      }
      
     else if(password.length < 6)
      {
        valid =false
        setErrorMessage('Enter a password minimum of 6 characters')
      }

      if(valid)
      {
       let result= await props.login(credentials);
       //****console.log("Result" , result)
        if (!result) {
          setErrorMessage('Incorrect password and/or username.')
        }
        
      }
  };

  return (
    <Container>
      <br/>

      <Row className="justify-content-md-center">
          <Col className="border rounded-lg" md={4} sm={12}>
            <br />
    <Form>

    {errorMessage? <Alert variant='danger'>{errorMessage}</Alert> : ''} <br/>
      <h3  style={{ color: '#17a2b8' }}> Login Form </h3>
      <Form.Group  controlId='username'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control  type='email' placeholder="Enter email" value={username} onChange={ev => setUsername(ev.target.value)} />
          <Form.Text className="text-muted">
             Please , provide your right email! 
              </Form.Text><br/>
      </Form.Group>
      <Form.Group  controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control type='password' placeholder="Password"  value={password} onChange={ev => setPassword(ev.target.value)} /> <br/>
         
      </Form.Group>
      <Button  variant="info" onClick={handleSubmit}>Login</Button>
    </Form>
    <br />
          </Col>
        </Row>
    </Container>
    )
}


export { LoginForm};