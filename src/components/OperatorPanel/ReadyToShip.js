import React, {Component,Fragment,useContext} from 'react';
import {Card,Button,Nav,Image,Row,Col,Container,Accordion} from 'react-bootstrap';
import M from "materialize-css";
// import CountryFrag from './Country';
 import './readytoship.css';


class ReadyShip extends Component{
    constructor(props){
        super (props);
        //  this.state=({country:<CountryFrag countrytable = {this.props.countrydata}/>})
      // this.fetchCountryData =  this.fetchCountryData.bind(this)
      console.log(this.props.orderdata);
      this.state=({
        orderslist: this.props.orderdata,
        ordershiplist:[],
        })

    }

    
    componentDidMount() {
      // Auto initialize all the things!
      M.AutoInit();
  }

  onChangeSelectManifest = (event)=>{
    console.log(event.target.checked, event.target.value);
    if (event.target.checked){
      let mani = this.state.ordershiplist.push(event.target.value)
      this.setState({ordershiplist:this.state.ordershiplist})
      console.log("Selected "+this.state.ordershiplist)
    }else{ 
      let selectedlist = this.state.ordershiplist
      //remove unselected
      let removedUnselected = selectedlist.filter(function(item) { return  item != event.target.value; })
      this.setState({ordershiplist:removedUnselected})
      console.log("remainnng"+removedUnselected)
      console.log("After unselecting "+this.state.ordershiplist)

    }

}

shipOrders= ()=>{
    // @TODO Update database and take all other necessary steps and Makethe ready to ship
    if(this.state.ordershiplist.length === 0){
      M.toast({html: 'No Order selected! Please select atleast one to Ship '+this.state.ordershiplist,classes:"white-text red rounded"})
    }else{
      M.toast({html: 'Pending for Implementation '+this.state.ordershiplist,classes:"white-text orange rounded"})
    }
   
  
  
  }
  

    render(){

         const orderCardList=  this.state.orderslist.map((order)=>{
           return(
              <Card key={order.id} className="orderItemdetailsCard">
               <Card.Header className="smallheader">
               <Row >
                      <Col>
                      <Card.Text>{order.ordernumber}</Card.Text>
                      </Col>
                      <Col>
                      <Card.Text>{order.customerid}</Card.Text>
                      </Col>
                      <Col>
                      <Card.Text>
                      {order.country}
                      </Card.Text>
                      </Col>
                      <Col>
                      <Card.Text>
                      {order.inboundnumber}
                      </Card.Text>
                      </Col>
                      <Col>
                      <Card.Text>
                      {order.outboundnumber}
                      </Card.Text>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                      {(()=>{
                        // Function to set icons with respect to order status
                        if (order.orderstatus === "Failed"){
                          return (<p className="red-text"><Image  className="ml-1" src="assets/images/wrong.svg"/> {order.orderstatus}</p>)
                        }else{
                          return (<p className="black-text"><Image  className="ml-1" src="assets/images/black-circle.svg"/> {order.orderstatus}</p>)
                        }
                      })()}
                      </Col>
                      <Col className=" ">

                        {/* @TODO loading for manifest must be implemented */}
                        {
                          (()=>{
                            // function to disable Select button if already shipped
                            if (order.orderstatus === "Ready To Shipped"){
                              return ( <>
                               <p className="right red-text">
      <label>
        <input type="checkbox" value={order.ordernumber}  onChange={this.onChangeSelectManifest} />
        <span className="red-text">Select to Ship</span>
      </label>
    </p>
                                                           </>)
                            }
                            else{
                                return( 
                                  <p className="right red-text">
                                  <label>
                                    <input type="checkbox" value={order.ordernumber} onChange={this.onChangeSelectManifest} />
                                    <span className="red-text">Select to Manifest</span>
                                  </label>
                                </p>
                               
                                
                                )
                            }
                          })()
                        }
                       
                  <Accordion.Toggle className="right inline alignmore_details" as={Nav.Link} variant="link" eventKey={order.id}>
        More Details<Image  className="ml-1 " src="assets/images/plus-circlesmall.svg"/>
      </Accordion.Toggle>
                      </Col>
                    </Row>
                 
                 </Card.Header> 
                
                
                <Card.Body>
                
               
                 
                    <Accordion.Collapse eventKey={order.id}>
      <Card.Body>Hello! I'm the body</Card.Body>
    </Accordion.Collapse>

                </Card.Body>

              </Card>
           );
         });

        return(
<Container>

<div className="row">
          <div className="col s4 l4 m4">
          <h4 className=" orange-text">Ready To Ship Orders </h4>
          </div>
          <div className="col s3 l3 offset-m7 offset-l7">
            {/* hide Manifest button because we not using selection things RN */}
          <Button variant="outline-primary " onClick={this.shipOrders}>Ship Orders</Button>
          </div>
</div>


<Row>
  <Col xs={12} lg={12}>
  <div>
        
        <div id="orderlistdiv" >
                  <Row id=" orderlistrow">
                      <Col>
                      <p> <Image className="mr-1" src="assets/images/down.svg"/>Order Number</p>
                      </Col>
                      <Col>
                      <p> <Image className="mr-1" src="assets/images/down.svg"/>Customer Id</p>
                      </Col>
                      <Col>
                      <p> <Image className="mr-1" src="assets/images/down.svg"/>Country</p>
                      </Col>
                      <Col>
                      <p> <Image className="mr-1" src="assets/images/down.svg"/>Inbound No.</p>
                      </Col>
                      <Col>
                      <p> <Image className="mr-1" src="assets/images/down.svg"/>Outbound No.</p>
                      </Col>

                  </Row>
                  <div className="divider"></div>
          </div>
          <Accordion>
            <form>
            { orderCardList}
            </form>
          
          </Accordion>
       

  </div>
  </Col>

 
</Row>

</Container>
        )
    }
}

export default ReadyShip;