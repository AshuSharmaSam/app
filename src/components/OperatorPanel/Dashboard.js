import React,{Component} from 'react';
import {Row, Col,Card,Container} from 'react-bootstrap'

class Dashboard extends Component{
    constructor(props){
        super (props);

    }


    render(){
        return(
             <Container>
            <Row>
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Text className="center">
                      <h1>34</h1>
                      <p>Total Orders</p>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Text className="center">
                      <h1>24</h1>
                      <p>Ready to Ship</p>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Text className="center">
                      <h1>14</h1>
                      <p>Waiting for Consolidation</p>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Text className="center dashboardDummy">
                      <h4>Graph</h4>
                      <p></p>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Text className="center dashboardDummy">
                      <h4>Operator Status</h4>
                      
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
          
            </Row>
            </Container>
        )
    }
}

export default Dashboard;