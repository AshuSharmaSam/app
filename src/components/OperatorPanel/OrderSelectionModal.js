import React from 'react';
import M from 'materialize-css';
import Axios from 'axios';
import { base_url } from '../../globalConstants';
import {Button,ButtonGroup,Row,Col,Image,Card,Accordion, Nav} from 'react-bootstrap';

// css of this is in createOrder.css

class OrderModal extends React.Component {

constructor(props, context){
    super (props, context);
    this.state =({showModel:true,
        orders:this.props.orders,
        orderSelectedlist:[],
        previouSelectedOrder:"",
        ordernumber:{},
        orderautoid:{},
        disableChangeStatus: false,
        context :context
    })

}

componentDidUpdate(prevProps) {


    if (this.props.orders !== prevProps.orders) {
        
        this.setState({orders:this.props.orders,
            
    
        })

     }


  }


componentDidMount(){
const context = this.state.context
   M.AutoInit();
}


openModal = ()=>{
    var elems = document.getElementById('orderselectionmodal');
    var instance = M.Modal.init(elems);
    instance.open()
    // orderselectionmodal
}
closeModal = ()=>{
    var elems = document.getElementById('orderselectionmodal');
    var instance = M.Modal.init(elems);
    instance.close()
}


onChangeSelectManifest = (event)=>{
    console.log(event.target.checked, event.target.value);
    console.log(event.target.name)
    if (this.state.previouSelectedOrder ==="" && event.target.name){
            console.log("first time " + event.target.name)
            this.state.orderSelectedlist.push(event.target.value)
                    
            this.setState({orderSelectedlist:this.state.orderSelectedlist})
            console.log("Selected "+this.state.orderSelectedlist)
            this.setState({previouSelectedOrder:event.target.name})
            this.setState({disableChangeStatus: false});
    }
    else{
        console.log("In else " + event.target.name)
        console.log("In else " + this.state.previouSelectedOrder)
        this.setState({disableChangeStatus: false})
        if (this.state.previouSelectedOrder === event.target.name ){
                // selected id code starts here

                if (event.target.checked){
                    this.state.orderSelectedlist.push(event.target.value)
                    
                    this.setState({orderSelectedlist:this.state.orderSelectedlist})
                    console.log("Selected "+this.state.orderSelectedlist)
                    this.setState({disableChangeStatus : false})
        
                // order_orderIdSelect
                            // this.state.order_orderIdSelect.push(event.target.value)
                                
                            // this.setState({order_orderIdSelect:this.state.order_orderIdSelect})
                            // console.log("Selected "+this.state.order_orderIdSelect)
                    }else{ 
                    let selectedlist = this.state.orderSelectedlist
                    //remove unselected
                    let removedUnselected = selectedlist.filter(function(item) { return  item != event.target.value; })
                    this.setState({orderSelectedlist:removedUnselected})
                    console.log("remainnng"+removedUnselected)
                    console.log("After unselecting "+this.state.orderSelectedlist)
                    this.setState({disableChangeStatus : false});
        
                    }

                    
        }else{
            if(event.target.checked && this.state.previouSelectedOrder !== event.target.name){
                M.toast({html: 'Select Products from SAME Order',classes:"white-text orange rounded"})
                this.setState({disableChangeStatus : true});
            }
            
        }
    }      

}

changeStatus= async()=>{
    // var orderssel = this.state.orderSelectedlist

// http://127.0.0.1:8000/api/v1/ezzytrace/boxes_received/order_100/
var orderDetails ={}
try{
    let token =localStorage.getItem("token")
    
    let config = {
        headers: { 'Content-Type': 'multipart/form-data' , 'Authorization':'Token '+token}
        
      };
  
    var url= base_url+`boxes_received/${this.state.previouSelectedOrder}/`

    let ordersresppnse = await Axios.get(url,config)
    // console.log(ordersresppnse.data)
    orderDetails = ordersresppnse.data
    // await this.setState({pendingOrders: this.state.pendingOrders.concat(orders.data)})
    // M.toast({html: 'Pending Ordersa fetched',classes:"white-text orange rounded"});
    // this.setState({error:""})
  }catch(error){
    console.log(`Failed to fetch selected order data ${error}`)
    // M.toast({html: 'Pending Ordersa cannot be fetched',classes:"white-text red rounded"});
    // this.setState({error:<Error/>})
  }

    // console.log("clicked")
    const productselectiondata = {
        order :this.state.previouSelectedOrder,
        orderdetails: orderDetails,
        orderid : this.state.orderautoid,
        perordersdata : this.state.ordernumber,
        selectedproductId : this.state.orderSelectedlist
    }
    this.props.onOrderSelection(productselectiondata)
    M.toast({html: 'selection done',classes:"white-text orange rounded"});
    // this.closeModal()
}

    render(){

        // var orderslist =[{id:1,order_id:"12343",description:"Macbook",quantity:1,unit_price:"300"},
        // {id:2,order_id:"12343",description:"Macbook",quantity:1,unit_price:"300"}]
        var orderslist = this.state.orders
        var ordernumber = {}
        var orderautoid = {}
        // var uniquekey = 0

        var srNo = 0

        let previousid =0
        // console.log( 'CHECKING ORDER LIST',orderslist);
        const orderCardList=  orderslist.map((order)=>{
            
                let orderid =order.order_id
                
                if (!ordernumber[orderid]) { // Initial object property creation.
                    ordernumber[orderid] =[order]
                    this.state.ordernumber[orderid] = [order]; // Create an array for that property.
                } else { // Same occurrences found.
                     //if (previousid !== order.id){
                        this.state.ordernumber[orderid].push(order); // Fill the array.
                     //}
                   
                }
                // previousid = order.id
                this.state.orderautoid[order.id] =order 

                srNo = srNo + 1
                
            return(
               <Card key={order.id} className="orderItemCard">
                  <Card.Body className="cardheader">
                    <Row >
                      {/* <Col>
                        <Card.Text className="ml-5">{srNo}</Card.Text>
                      </Col> */}
                      <Col lg="3">
                        <Card.Text>{order.order_id}</Card.Text>
                      </Col>
                      <Col lg="4">
                        <Card.Text>
                          {/* <div 
                          style= {{  overflow: 'hidden', textOverflow: 'ellipsis', 
                            height: '30px', width: '100px', whiteSpace: 'nowrap' }} >  
                          {order.description}
                        </div > */}
                              {order.description}
                        </Card.Text>
                      </Col>
                      <Col lg="2">
                        <Card.Text className='text-center'>
                          {order.quantity}
                        </Card.Text>
                      </Col>
                      <Col lg="2">
                        <Card.Text className='text-center' >
                          {order.unit_price}
                        </Card.Text>
                      </Col>
                      <Col lg="1">
                        <p className="center red-text">
                          <label>
                            <input className='red-text' name={order.order_id} type="checkbox" value={order.id} onChange={this.onChangeSelectManifest} />
                            <span className="red-text">
                              {/* Select to change ChangeStatus */}
                            </span>
                          </label>
                        </p>

                      </Col>
                    </Row>
                  </Card.Body>
               
                 
            
 
               </Card>
            );
          });


        return (<>


  <div id="orderselectionmodal" className="modal orderpopmodel modal-fixed-footer">
    <div className="modal-content">
    <h4 className="center orange-text"> Pending Existing Orders </h4>
    <Row>
  <Col xs={12} lg={12}>
  <div>
        
        <div id="orderlistdiv" >
                  <Row id=" orderlistrow">
                      {/* <Col>
                      <p> <Image className="ml-5" src="assets/images/down.svg"/>Sr. No.</p>
                      </Col> */}
                      <Col lg="2">
                      {/* <p> <Image className="mr-1" src="assets/images/down.svg"/>Order Id.</p> */}
                      <p className='text-center'> <Image className="ml-3" src="assets/images/down.svg"/>Order Id.</p>
                      </Col>
                      <Col lg="4">
                      <p className='text-center'> <Image className="mr-1" src="assets/images/down.svg"/>Product Name</p>
                      </Col>
                      <Col lg="2">
                      <p className='text-center'> <Image className="mr-1" src="assets/images/down.svg"/>Quantity</p>
                      </Col>
                      <Col lg="2">
                      <p className='text-center'> <Image className="mr-1" src="assets/images/down.svg"/>Price</p>
                      </Col>
                      <Col lg="2"> Select Order(s)</Col>

                  </Row>
                  <div className="divider"></div>
          </div>

        
            { orderCardList}
         
       

  </div>
  </Col>

 
</Row>
    </div>
    <div className="modal-footer">
   
    <ButtonGroup className="mr-2" aria-label="First group">
    <Button id="closeOrderBtn" variant="outline-secondary" className="mr-4 btn modal-close "  >Close</Button> 
   {this.state.disableChangeStatus ? <Button disabled id ="addItemBtn" variant="outline-primary" className="mr-2 btn modal-close" onClick={this.changeStatus}> Change Status</Button> : <Button id ="addItemBtn" variant="outline-primary" className="mr-2 btn modal-close" onClick={this.changeStatus}> Change Status</Button> }

  </ButtonGroup>
    </div>
  </div>
      





        </>)
    }
}
export default OrderModal;