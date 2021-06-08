import React, {Component,} from 'react';
import {Redirect, useHistory } from 'react-router-dom';
import {Card,Image,Row,Col} from 'react-bootstrap';


import "./createorder.css";


class CustomerDetailCard extends Component{

    constructor(props){
        super(props);
        
  this.state = ({title:"***",name:"********",
              email:"**********",address:"********",phone:"********"

              })

    }

    componentDidUpdate(prevProps) {

      if (this.props.info.ezz_id !== prevProps.info.ezz_id) {
        
         this.setState({title:this.props.info.title,name:this.props.info.name,
            email:this.props.info.email,address: this.props.info.address,phone:this.props.info.phone_number
        
        })

      }
    }


    render(){ 
        return(
            <Row>
            <Col>
            
            <Card className="" id="customerbasicdetailsCard">
        <Card.Body>
            <Card.Text>
                <Row>
                    <Col xs={8}>
        <h6 >Name:</h6><p className="inline">{this.state.title + " " + this.state.name}</p>
                    </Col>
                    <Col className="">
                    <Image src="assets/images/avatar-big.svg"/>
                    </Col>
                </Row>
                <Row>
                    <Col xs={8}>
                        <h6 >Address:</h6><p>{this.state.address}</p>
                    </Col>
                    <Col xs={4} className="right">
                    <h6 >Phone:</h6><p>{this.state.phone}</p>
                    </Col>
                    <Col className="">
                    <h6 >Email:</h6><p>{this.state.email}</p>
                    </Col>
                </Row>
               
            
            </Card.Text>
               


               </Card.Body> 
        </Card>
            </Col>
        </Row>

        )
    }
}

export default CustomerDetailCard;