import { Container, Row, Col, ListGroup, Form } from 'react-bootstrap'
import { useState } from 'react'
import API from '../API';


function MainContent(props) {
  
    // Object state variable to show the filtered data 
    const [filterData , setFilterData] =useState([])
    // Boolean state variable to decide whether to show the list or the filtered data 

    const [status, setStatus] =useState(false)
    return (
        <Container fluid className=" vheight-100 m-2">
            <Row>
                <Col xs={4}>
                    {props.filters.map((filter, idx) =>
                        <Filtergroup
                            key={filter}
                            category={filter}
                            setStatus={setStatus}
                            setFilterData={setFilterData}
                            filterData={filterData}

                        />
                    )}

                </Col>
                <Col xs={8}>
                    <CarList list={props.list}
                     setStatus={setStatus}
                     filterData={filterData}
                     status={status}/>
                </Col>
            </Row>
        </Container>
    )
}

function Filtergroup(props) {
    return (
        <>
            <ListGroup>
                <FilterRow {...props} />
            </ListGroup>
        </>
    )
}

function FilterRow(props) {
    const [checked, setChecked] = useState([])

    const handleChange = (event) => {
        let index;
        if (event.target.checked) {
            checked.push(event.target.name)
            setChecked(newChecked => checked) 
            API.filterList(checked).then(response => {
                //***console.log("response", response)  // Array of object 
                var clonedArray = JSON.parse(JSON.stringify(response))
                props.setFilterData((olddata) =>[...olddata , ...clonedArray]) 
                props.setStatus(true); 
                })    
         } 
         
          else  {
             index = checked.indexOf(event.target.name)
             checked.splice(index, 1)
             //console.log("index", index)
             //***console.log("filterdata" , props.filterData)
             props.setFilterData(props.filterData.filter((item)=>item.category!==event.target.name))
             props.setStatus(true); 
         }  
    
        if(event.target.name==='A')
        {
            props.setStatus(false);
        }
           
    }
    
    return (
        <>
            <ListGroup.Item>
                <Form.Check
                    type="checkbox"
                    label={props.category} 
                    name={props.category}
                    checked={checked[props.name]}
                    onChange={handleChange}
                >
                </Form.Check>
            </ListGroup.Item>


        </>
    )
}



function CarList(props) {
    //**console.log("status", props.status )
    //console.log("Filterdata" , props.filterData)
    return (
        <>
            <h2 style={{ color: '#17a2b8' }}>Avaliable Cars :</h2>
             {props.status ? props.filterData.map((car, idx) =>
                <CarRow
                    key={idx}
                    car={car}
                />
             )
                :
                props.list.map((car,idx)=>
                <CarRow
                key={idx}
                car={car}
            />
                )
            }
        </>
    )
}

function CarRow(props) {
    return (
        <>
            <Container>
                <Row className="d-flex justify-content-between border ">
                    {/* category */}
                    <Col> Category : {props.car.category} </Col>

                    {/* brand */}
                    <Col> Brand : {props.car.brand}</Col>

                    {/* Model */}
                    <Col> Model : {props.car.model}</Col>
                </Row>
            </Container>

        </>
    )
}


export { MainContent }
