import React, {Component} from 'react';
import {Row, Col,ButtonGroup,Button,Spinner,Nav,Image} from 'react-bootstrap';
import M from 'materialize-css';
import Axios from "axios";
import Error from '../AdminPanel/Error'
import Success from '../AdminPanel/Success'
import ProductItemsList from './ProductItemListCard';
import EditProduct from './EditProductItem';
import CustomerDetailCard from './CustomerDetailCard'
import { base_url } from '../../globalConstants';
import "./createorder.css";
import "./vieworder.css";


class ViewOrder extends Component{


constructor(props, context){
        super (props, context);
        console.log("construct ",this.props.productlist)
        this.state =({
            order:this.props.order,
            // current_date: date,
           
            productlist:new Array() ,
            productlisthtml:<div></div> ,
            product_name:"",product_price:"",product_quantity:"" ,
            product_category_options :<></>,
            product_category:"",ordernumber:"",
         customer_id:"",order_date:"",
        received_date:"",tracking_number:"",shiper_order_number:"",
        weight:"",height:"",fedex_charge:"",width:"",length:"",actual_charge:"",
          orderStatusSelected:"",
          paymentTypeSelected:"",showSpinner:false,
          customerinfo:{},
          error:"",
          selectItemDetails:{},
      
        
        })
    
    }

    newDate=()=>{
     
      var d = new Date()
      var month = '' + (d.getMonth() + 1)
    var   day = '' + d.getDate()
   var    year = d.getFullYear()

   if (month.length < 2) {
     month = '0' + month;
   }
    
   if (day.length < 2) {
     day = '0' + day;
   }
   

   return [year, month, day].join('-');
    }

    formatDate=(date)=> {
      var d = new Date(date)
         var month = '' + (d.getMonth() + 1)
       var   day = '' + d.getDate()
      var    year = d.getFullYear()
  
      if (month.length < 2) {
        month = '0' + month;
      }
       
      if (day.length < 2) {
        day = '0' + day;
      }
      
  
      return [year, month, day].join('-');
  }
   

  componentDidUpdate(prevProps) {


    if (this.props.orderdata.id !== prevProps.orderdata.id) {
      // console.log("Product error",this.props.productlist)
      // console.log("customerinfo",this.props.customerinfo)
      // console.log("catefory options",this.props.productCategory)
        this.setState({order:this.props.orderdata,
            //   current_date: this.props.orderdata.order_date,
            orderid :this.props.orderdata.id,
            customerinfo:this.props.customerinfo,
            productlist:this.props.productlist ,
            productlisthtml:this.props.productlisthtml ,
            product_name:"",product_price:"",product_quantity:"" ,
            product_category_options :this.props.productCategory,
            // showSpinner:false,
            product_category:"",ordernumber:this.props.orderdata.order_id,
         customer_id:this.props.orderdata.ezz_id,order_date:this.props.orderdata.order_date,
        received_date:this.props.orderdata.received_date,tracking_number:this.props.orderdata.inbound_tracking_number,
        shiper_order_number:this.props.orderdata.shipper_number,
        weight:this.props.orderdata.weight,height:this.props.orderdata.height,
        fedex_charge:this.props.orderdata.freight_charge, width:this.props.orderdata.breadth,
        length:this.props.orderdata.length,actual_charge:this.props.orderdata.actual_charge,
          orderStatusSelected:this.props.orderdata.current_status,
          orderStatusName:this.props.orderdata.current_status_name,
          paymentTypeSelected:this.props.orderdata.billing_type,

          error:"",


      
    
        })

        var elems_order = document.getElementById('order_date');
      var context = this
      var newdate = this.newDate()
        var options_order={
            //selectMonths: true, // Enable Month Selection
            selectYears: 10, // Creates a dropdown of 10 years to control year
            format:'yyyy-mm-dd',
            autoClose :true,
            defaultDate:newdate,
            setDefaultDate :true,
            onSelect: function(date) {
               let selecteddata =  context.formatDate(date)
              context.setState({ order_date: selecteddata});
              // console.log("order",selecteddata); // Selected date is logged
            },
          }
        var instances = M.Datepicker.init(elems_order, options_order);
        instances.toString()
        var elems_recieved = document.getElementById('received_date');
        var options_recieved={
            //selectMonths: true, // Enable Month Selection
            selectYears: 1, // Creates a dropdown of 10 years to control year
            format:'yyyy-mm-dd',
            autoClose :true,
            defaultDate:newdate,
            setDefaultDate :true,
            onSelect: function(date) {
              let selecteddata =  context.formatDate(date)
              context.setState({ received_date: selecteddata});
              //  console.log("recived"+ selecteddata); // Selected date is logged
            },
          }
        var instances = M.Datepicker.init(elems_recieved, options_recieved);
 
 instances.toString()

     }


  }



handletableClick=(clickedrow)=>{
  console.log(clickedrow)
  // M.toast({html: 'Clicked row '+clickedrow,classes:"white-text red rounded"});

}

updateProduct= async (rownumber,item)=>{
  console.log("UPDATING LIST HERE ",rownumber,item)
let productlist = this.state.productlist
productlist.splice(rownumber, 1, item)
await this.setState({productlist:productlist})
// this.refs.editproduct.closeModal();
// M.toast({html: 'item updated at row ' +rownumber,classes:"white-text blue rounded"});


}

deleteProduct= async (rownumber,item_id)=>{
  let tempItemId = item_id.toString()
  let updated_productlist = this.state.productlist
  console.log("DELETING ITEM HERE ",rownumber,item_id)

  if(!tempItemId.includes('item_')){
    await Axios({
      method: 'DELETE',
      url: base_url + `products/${item_id}/`
    }).then(function (response) {
      // console.log(`DELETED${tempProductId}`, response);
      M.toast({ html: `Product deleted successfully`, classes: "white-text blue rounded" })
    }).catch(function (response) {
      // console.log("NOT DELETED ERROR",response);
      M.toast({ html: `Product deletion failed`, classes: "white-text red rounded" })
    })
  }  

  updated_productlist.splice(rownumber, 1)
  await this.setState({productlist:updated_productlist})
  console.log(`ITEM ${item_id} DELETED AT ${rownumber}`)
  // this.refs.editproduct.closeModal();
  // M.toast({html: 'item deleted ' +rownumber,classes:"white-text blue rounded"});

}

// @TODO: updateOrderProdcts Method will used to update products in future
updateOrderProducts=async(header)=>{
    this.state.productlist.forEach(async(item)=>{
      // rowclick={this.handletableClick}
        console.log(item)
        try{
          var productformdata = new FormData()
          productformdata.append("id",item.id)
          productformdata.append("description",item.productName)
          productformdata.append("quantity",item.productQuantity)
          productformdata.append("unit_price",item.productPrice)
          productformdata.append("inspection_status","okay")
          productformdata.append("status","Active")
          productformdata.append("category",item.productCategory)
    
          const response_products = await Axios.patch(base_url+"products/",productformdata,
          header)
          // alert(response.data)
          console.log("Product added Successfully")
          this.setState({error:<Success message=" Order Status Updated"/>})
          M.toast({html: 'Product Addition Successfull',classes:"white-text blue rounded"});
        }catch(error){
          M.toast({html: 'Product Addition Failed',classes:"white-text red rounded"});
            console.log(error)
        }
       
      });
}

startRefresh=async()=>{
this.props.refreshpage();
}

updateOrder= async(header)=>{
  const  orderid= this.state.ordernumber

  const found = this.state.productlist.find(element => element["productPrice"]==0);

  console.log('found', found)

  if(found && this.state.orderStatusSelected === 'RTM' ){
    M.toast({ html: 'Ready to Manifest not allowed for product price $0', classes: "white-text red rounded" });
    return
  }

    try{
        
        var orderupdateForm = new FormData()
        orderupdateForm.append("order_id",this.state.ordernumber)
        orderupdateForm.append("ezz_id",this.state.customer_id)
        orderupdateForm.append("shipper_number",this.state.shiper_order_number)
        orderupdateForm.append("billing_id","2121")
        orderupdateForm.append("billing_type",this.state.paymentTypeSelected)
        orderupdateForm.append("order_date",this.state.order_date)
        orderupdateForm.append("received_date",this.state.received_date)
        orderupdateForm.append("inbound_tracking_number",this.state.tracking_number)
        orderupdateForm.append("weight",this.state.weight)
        orderupdateForm.append("length",this.state.length)
        orderupdateForm.append("breadth",this.state.width)
        orderupdateForm.append("height",this.state.height)
        orderupdateForm.append("charge_type","VAT")
        orderupdateForm.append("freight_charge",this.state.fedex_charge)
        orderupdateForm.append("actual_charge",this.state.actual_charge)
        orderupdateForm.append("current_status",this.state.orderStatusSelected)
        orderupdateForm.append("previous_status",this.props.orderdata.current_status)
        orderupdateForm.append("status","Deactive")
        orderupdateForm.append("flag","1")
        orderupdateForm.append("current_status",this.state.orderStatusSelected)
        let urlforOrderStatusUpdate = base_url+`boxes_received/${this.state.ordernumber}/`
        const response = await Axios.patch(urlforOrderStatusUpdate,orderupdateForm, header)
  
        console.log(`order status update succesfully ${response}`)
        this.setState({error:<Success message=" Order Updated"/>})
      
        M.toast({html: 'Order Updated Successfull',classes:"white-text orange rounded"});


        //Updating The Product 

        this.state.productlist.forEach(async(item)=>{
          console.log("productitem")
          console.log(item)
          console.log(item.id, 'I AM THE ITEM GETTING UPDATED!!!!!!!!!!!!!!')

          

          try{
            var productformdata = new FormData()
            productformdata.append("order_id",this.state.ordernumber)
            productformdata.append("description",item.productName)
            productformdata.append("quantity",item.productQuantity)
            productformdata.append("unit_price",item.productPrice)
            productformdata.append("inspection_status","okay")
            productformdata.append("status","Active")
            productformdata.append("category",item.productCategory)

            if( typeof(item.id) === "number"  ){
              const response_products = await Axios.patch(base_url+`products/${item.id}/`, productformdata,
                header)
              // alert(response.data)
              console.log("Product added Successfully")
              this.setState({ error: <Success message=" Order Status Updated" /> })
              M.toast({ html: 'Product Updation Successfull', classes: "white-text blue rounded" });
              
            }else{
              
              const response_addProduct = await Axios.post(base_url+`products/`, productformdata,
              header )

              M.toast({ html: 'Product Addition Successfull', classes: "white-text blue rounded" });
              
            }

            
            
          }catch(error){
            M.toast({html: 'Product Updation Failed',classes:"white-text red rounded"});
              console.log(error)
          }
         
        });
        



     
        try{
          var email_subject = "invoice_missing"
           const status = this.state.orderStatusSelected
           switch(status){
             case "IM":
              email_subject ="invoice_missing";
              break;
             case "WFC":
              email_subject ="consolidation";
              break;
      
      
               
           }
          if (status===  "IM" || status === "WFC"){
            const  emaildata= {"type" : email_subject,
            "ezz_id" : this.state.customer_id,
            "order_id" : orderid}


            Axios({
              method:'post',
              url: base_url+'status_printer',
              data: {
                "order_id": orderid
              }
            }).then(function(response){
              console.log(response)
              console.log("printer APi success");
            }).catch(function(response){
              console.log(response)
              console.log('printer API failed');
            })

            Axios({
              method:'post',
              url: base_url+'whatsapp_templates',
              data: emaildata,
            }).then(
              function(response){ 
                console.log(response)
                console.log("whatsapp sent done");
              }
            ).catch(
              function(response){ 
                console.log(response)
                console.log("whatsapp sent Failure");
              }
            )


            const response = await Axios.post(base_url+"send_email/",emaildata,
          header)
          console.log(response)
          M.toast({html: 'Email Sent to '+response.data["Email to"],classes:"white-text red rounded"});
    
          }
         
        }catch(error){
      
          M.toast({html: 'Email Sending Failed to'+ this.state.customer_id ,classes:"white-text red rounded"});
        }
      




        // window.location.reload(false);
      }catch(error){
        M.toast({html: 'Order Updation Failed',classes:"white-text red rounded"});
          console.log(error)
          this.setState({error:<Error/>})
      }

      this.startRefresh();
}

updateOrderDB=()=>{
    let token =localStorage.getItem("token")
    const  header = {'Content-Type': 'application/json',
    'Authorization':'Token '+token,
    }
    this.updateOrder(header)


}

getfedexActualRate = async (weight,height,length,breadth)=>{
    


  try{
let token =localStorage.getItem("token")
let config={ headers : {'Content-Type': 'multipart/form-data',
'Authorization':'Token '+token,
}
}

// Fetching user list on input change
var url= base_url+`fedex_actual_rates/?weight=${weight}&height=${height}&breadth=${breadth}&length=${length}&ezz_id=${this.state.customer_id}`
var response = await Axios.get(url,config)
console.log(response.data)
return response.data
}catch(error){



console.log(error.response.data)
  
if (error.response.status ===503 ){
 M.toast({html: ""+error.response.data.error,classes:"white-text red rounded"});
}

// return response.data
return error.response.data
}

}

handleFormChange= async (ev) =>{
  const target = ev.target
  const name = target.name
  console.log(ev.target.name)
  console.log(ev.target.value)
 
  // hide and show on YTA
  if (target.value === "YTA"){
    this.setState({
      [name]: target.value,
      weight: 0,
      height:0,
      fedex_charge:0,
      width:0,
      length:0,
      actual_charge:0
    });
  }else{

    if(target.name ==="weight" || 
    target.name ==="height" || target.name === "width"
  || target.name === "length"
    ){

    this.setState({
        [name]: target.value
      });

      var weight = this.state.weight
      var width = this.state.width
      var height = this.state.height
      var length = this.state.length
      var field = target.name;

      switch (field) {
        case "weight":
          weight = target.value;
          break;
        case "height" :
          height = target.value;
          break;
        case "width" :
          width = target.value;
          break;
        case "length" :
          length = target.value;
          break;
       
      }

      if(width < 0 || height <0 || weight < 0 || length <0 || this.state.actual_charge <0){
        M.toast({html: "values can not be negative",classes:"white-text red rounded"});
        return;
      }


      if((width!=="" && parseInt(width)!==0) && (height !=="" && parseInt(height) !==0) && (width !=="" && parseInt(width) !==0 ) && (length!=="" && parseInt(length)!==0)){
        await this.setState({
          showSpinner:true
        })
        var response =  await this.getfedexActualRate(weight,height,length,width)
        console.log(response["freight_charges"] + response["actual_charges"])
          this.setState({
            fedex_charge:response["freight_charges"],
            actual_charge: response["actual_charges"],
            showSpinner:false
          })
      }
     
    }else{
      this.setState({
        [name]: target.value
      });
    }

 
  }

 
}



addProductTolist = ()=>{
  console.log(this.state.productname + this.state.productprice +this.state.productquantity)
   var prodname =this.state.product_name
   var prodquant =this.state.product_quantity
   var prodcat =this.state.product_category
   console.log("prody")
   console.log(prodname + prodquant+prodcat )

   if(prodname === "" || prodquant === 0 || prodcat ===""){
    M.toast({html: 'Incorrect or Empty details',classes:"white-text red rounded"});
   }else{
    var elem = document.getElementById('addProductModal')
    var instance = M.Modal.getInstance(elem);
    instance.close();
    let totalproducts = this.state.productlist.length + 1
    
    let newitem = {id:'item_'+totalproducts,productName:this.state.product_name,
    productPrice:this.state.product_price ,
    productQuantity:this.state.product_quantity,
  productCategory:this.state.product_category
  }

    console.log("Product List",this.state.productlist)
   this.state.productlist.push(newitem)
    this.setState({productlist: this.state.productlist})
    
  try {
    // this.setState({productlisthtml:<ProductItemsList products={this.state.productlist}/>})
    this.setState({product_name:"",product_price:0,product_quantity:0 })
   M.toast({html: 'Added in list successfully',classes:"white-text orange rounded"})
  } catch (error) {
    M.toast({html: 'Couldnt be added',classes:"white-text orange rounded"})
  }
   

   }

}



 componentDidMount(){
    M.AutoInit();
}

 openModal = (products,product_category)=>{
    //  console.log("inside editiordemodal");
    //  console.log(orderdata);
    var elems = document.getElementById("vieworderModel");
    var instance = M.Modal.init(elems);
    console.log("openmodel",products)
    this.setState({productlist:products,
      product_category_options:product_category})
   

    instance.open()
    // orderselectionmodal
}
closeModal = ()=>{
    var elems = document.getElementById("vieworderModel");
    var instance = M.Modal.init(elems);
    instance.close()
}

    render() {
        const opts={};
        opts['readOnly'] = 'readOnly';

      const catlist = this.state.product_category_options;
      if (catlist.length > 0) {
        var categoryList = catlist.map((item, i) => {
          return (
            <option className="black-text" key={i} value={item.category_id}>{item.category_name}</option>
          )
        }, this);
      }



        return(<>              {/* Edit product Table items */}
          <EditProduct ref="editproduct" rowNumber={this.state.rowNumber} status={this.state.orderStatusSelected}  orderId ={ this.state.orderid }
          productDetails={this.state.selectItemDetails}
           productcategory={this.state.product_category_options}
           updateBtnClick={this.updateProduct} deleteBtnClick={this.deleteProduct}
           />
            <div id="vieworderModel" className="modal vieworderModel modal-fixed-footer">
            <div className="modal-content">
              
            {/* <span><h4 className="center orange-text"> Edit Order </h4><h4>Order id: { this.state.ordernumber }</h4></span> */}
            <h4 className="center orange-text"> View Order </h4>
            <h4>Order id: <span className="orange-text">{this.state.ordernumber }</span> </h4>
            
            <Row>

<Col xs={12}md={7} lg={7}>
<div className="row">
<form className="col s12">
{this.state.error}
<div className="row inputbox-height">
<div className="input-field col s6">
<input name="customer_id" id="customer_id" type="text" className="autocomplete" 
value={this.state.customer_id} readOnly disabled
// onChange={this.handleCustomerIDChange}
/>

<span className="helper-text " data-error="wrong" data-success="">Customer Ezzid ex: Ezz000000</span>
</div>

</div>
<div className="row inputbox-height">
<div className="input-field col s6">

<input name="order_date" id="order_date" type="text"  className="datepicker" 
value={this.state.order_date} disabled
// onChange={this.handleFormChange}
/>


<span className="helper-text " data-error="wrong" data-success="">Order Date </span>
</div>
<div className="input-field col s6">
<input name="received_date" id="received_date" type="text" className="datepicker"
value={this.state.received_date} disabled
// onChange={this.handleFormChange}
/>

<span className="helper-text" data-error="wrong" data-success="">Received Date</span>
</div>
</div>
<div className="row inputbox-height">
<div className="input-field col s6">
<input name="tracking_number" id="tracking_number" type="text" className=""
value={this.state.tracking_number}  readOnly disabled
// onChange={this.handleFormChange}
/>

<span className="helper-text" data-error="wrong" data-success=""> Tracking inbound Number</span>

</div>
<div className="input-field col s6">
<input name="shiper_order_number" id="shiper_order_number" type="text" className=""
value={this.state.shiper_order_number} readOnly disabled
// onChange={this.handleFormChange}
/>

<span className="helper-text" data-error="wrong" > Shipper Order Number</span>
</div> 
</div>
{
          this.state.showSpinner
            ? < div className="center">
          
            <Spinner animation="grow" variant="primary" size="sm" />
            <Spinner animation="grow" variant="success" size="sm" />
            <Spinner animation="grow" variant="warning" size="sm" />
          </div>
            : null
        }

                      {this.state.orderStatusSelected !=="YTA" ?
                        <div className="row">
                          <div className="input-field col s4">
                            <input name="length" id="length" type="number" className=""
                              value={this.state.length} readOnly disabled
                              // onChange={this.handleFormChange}
                            />
                            <label className="active" htmlFor="length" style={{ marginLeft: '20%' }}>Length</label>
                            <span className="helper-text" data-error="wrong" >    Length in inches</span>
                          </div>
                          <div className="input-field col s4">
                            <input name="width" id="width" type="number" className=""
                              value={this.state.width} readOnly disabled
                              // onChange={this.handleFormChange}
                            />
                            <label className="active" htmlFor="width" style={{ marginLeft: '20%' }}>Width</label>
                            <span className="helper-text" data-error="wrong" >       Width in inches</span>
                          </div>                       
                          <div className="input-field col s4">
                            <input name="height" id="height" type="number" className=""
                              value={this.state.height} readOnly disabled
                              // onChange={this.handleFormChange}
                            />
                            <label className="active" htmlFor="height" style={{ marginLeft: '20%' }}>Height</label>
                            <span className="helper-text" data-error="wrong" >        Height in inches</span>
                          </div>                         
                        </div> : null}
                      {this.state.orderStatusSelected !== "YTA" ?
                        <div className="row">
                                                    <div className="input-field col s4">
                            <input name="weight" id="weight" type="number" className=""
                              value={this.state.weight} readOnly disabled
                              // onChange={this.handleFormChange}
                            />
                            <label className="active" htmlFor="weight" style={{ marginLeft: '20%' }}>Weight</label>
                            <span className="helper-text" data-error="wrong" >    Weight in pounds</span>
                          </div>
                          <div className="input-field col s4">
                            <input name="fedex_charge" id="fedex_charge" type="number" className=""
                              value={this.state.fedex_charge} readOnly disabled
                              // onChange={this.handleFormChange} 
                              {...opts}
                            />
                            <label className="active" htmlFor="fedex_charge" style={{ marginLeft: '20%' }}>           Fedex Charge </label>
                            <span className="helper-text" data-error="wrong" >Auto generated</span>
                          </div>
                          <div className="input-field col s4">
                            <input placeholder="" name="actual_charge" id="actual_charge" type="number" className=""
                              value={this.state.actual_charge} disabled={this.state.orderStatusSelected === 'IM'} 
                              readOnly disabled
                              // onChange={this.handleFormChange}
                            />
                            <label className="active" htmlFor="actual_charge" style={{ marginLeft: '20%' }}>           Actual charges </label>
                            <span className="helper-text" data-error="wrong" >Auto generated</span>
                          </div>
                        </div> : null}
<div className="row">
<div className="col s6">
{/* Order Status Radio Buttons */}
<h4>Order Status</h4>

<label>
<input name="orderStatusSelected" value={this.state.orderStatusSelected} type="radio" checked />
<span>{this.state.orderStatusName}</span>
</label>

{/* <label>
<input name="orderStatusSelected" value="IM" type="radio" 
checked={this.state.orderStatusSelected ==="IM"} onChange={this.handleFormChange}/>
<span>Invoice Missing</span>
</label>

<label>
<input name="orderStatusSelected" value="YTA" type="radio" 
checked={this.state.orderStatusSelected ==="YTA"} onChange={this.handleFormChange}/>
<span>Order Yet to Arrive</span>
</label>

<label>
<input name="orderStatusSelected" value ="RTM" type="radio" 
checked={this.state.orderStatusSelected ==="RTM"} onChange={this.handleFormChange}
/>
<span>Ready to Manifest</span>
</label>

            <label>
                <input name="orderStatusSelected" value ="WFC" type="radio" 
                 checked={this.state.orderStatusSelected ==="WFC"} onChange={this.handleFormChange}
                />
                <span>Wait for Consolidation</span>
            </label>
   
<label>
<input name="orderStatusSelected" value ="UID" type="radio" 
checked={this.state.orderStatusSelected ==="UID"} onChange={this.handleFormChange}
/>
<span>Box UnIdentified</span>
</label> */}

</div>

<div className="col s6">
{/* Payment Tyoe Radio Buttons */}
<h4>Payment Type</h4>
<p>
<label>
<input name="paymentTypeSelected" value={this.state.paymentTypeSelected} type="radio"  
checked
/>
<span style={{ textTransform: 'capitalize' }}>{this.state.paymentTypeSelected}</span>
</label>
</p>
</div>

</div>
{/* <div className="row">
<div className="col s6">
<h4>Payment Type</h4>
<p>
<label>
<input name="paymentTypeSelected" value="cash" type="radio"  
checked={this.state.paymentTypeSelected ==="cash"} 
// onChange={this.handleFormChange}
/>
<span>Cash</span>
</label>
</p>
<p>
<label>
<input name="paymentTypeSelected" value="card" type="radio" 
checked={this.state.paymentTypeSelected ==="card"} 
// onChange={this.handleFormChange}
/>
<span>Card</span>
</label>
</p>
</div>

</div> */}
</form>

</div>
</Col>
{/* right side column starts here */}
<Col xs={12}md={5} lg={5}>


     <CustomerDetailCard 
     info = {this.state.customerinfo}
      />

 <Row>
 <Col>
 <h4>Product Details</h4>
 </Col>
 {/* add product column for future use */}
 <Col>

{
  this.state.orderStatusSelected != 'SP' && this.state.orderStatusSelected != 'NEW' && this.state.orderStatusSelected != 'DISC'
  ? <Nav className="right">
      <Nav.Link className="red-text modal-trigger " href="#addProductModal">
        Add<Image className="red-text ml-1" src="assets/images/plus-circle-red.svg" /></Nav.Link>
    </Nav>  
  :""

}

 
 </Col>

</Row>
{/* product card to be shown here */}
{/* <div className="productlistEditOrderDiv">{this.state.productlisthtml}</div> */}
<div className="productlistDiv ">
  <ProductItemsList orderid={this.state.orderid} products={this.state.productlist} rowclick={this.handletableClick}
    order_status = {this.state.orderStatusSelected}
  />
  </div>
                    <div className="right"><b>Total Price: </b>$
                    {
                    ( ()=>{
                      var totalprice =0;
                      this.state.productlist.forEach(function(item){
                        totalprice = totalprice + (parseFloat(item.productPrice ).toFixed(2)) *parseInt(item.productQuantity ) 
                      })
                      return parseFloat(totalprice).toFixed(2)
                    })()
                      
                      }
</div>
</Col>

{/* right side columns ends here */}

</Row> 
        
         
     
            </div>
            <div className="modal-footer">
           
            <ButtonGroup className="mr-2" aria-label="First group">
            <Button id="closeEditOrderBtn" variant="outline-secondary" className="mr-4 btn modal-close "  >Close</Button> 
            {
              this.state.orderStatusSelected != 'SP' && this.state.orderStatusSelected != 'NEW' && this.state.orderStatusSelected != 'DISC'
              ?<Button id ="updateOrderBtn" variant="outline-primary" className="mr-2 btn modal-close" onClick={this.updateOrderDB}> Update</Button>
              :""
            }
            
        
          </ButtonGroup>
            </div>
          </div>



          {/* Model for adding products STARTS here */}
        {/* <!-- Modal Trigger --> */}
        <div id="addProductModal" className="modal modal-fixed-footer">
          <div className="modal-content">
            <h4 className="center orange-text"> Add Product </h4>
            <Row>
              <Col xs={12} >
                <form>
                  <Row>
                    <Col className=" rowdivPading " xs={12}>
                      <div className="input-field col s6 offset-s3 center">
                        <input name="product_name" id="product_name" type="text" value={this.state.product_name} onChange={this.handleFormChange} className="" />
                        <label htmlFor="product_name" className="black-text" >Product Name</label>
                        <span className="helper-text left" data-error="wrong" data-success="">Enter a valid Product Name</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name="product_quantity" id="product_quantity" min="0" type="number" value={this.state.product_quantity} onChange={this.handleFormChange} className="" />
                        <label htmlFor="product_quantity" className="black-text">Quantity</label>
                        <span className="helper-text left" data-error="wrong" data-success="">Enter number of products items</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name="product_price" disabled={this.state.orderStatusSelected === "IM"} id="product_price" min="0" type="number" value={this.state.product_price} onChange={this.handleFormChange} className="" />
                        <label htmlFor="product_price" className="black-text">Product Price</label>
                        <span className="helper-text left" data-error="wrong" data-success="">Enter numbers</span>
                      </div>
                    </Col>
                  </Row>


                  <Row>
                    <Col>

                      <div id="categroydiv" className="input-field col s6 offset-s3 center">
                        {/* <p>Select Category</p> */}
                        <select id='category_name_select' name="product_category" className="browser-default" onChange={this.handleFormChange}>
                          <option value="" disabled selected>Choose Category</option>

                          {categoryList}

                        </select>
                        {/* <label>Select Category</label> */}

                      </div>


                    </Col>

                  </Row>


                </form>
              </Col>
            </Row>
          </div>
          <div className="modal-footer" >
            {/* <a href="#!" className="modal-close waves-effect waves-green btn-flat">Agree</a> */}



            {/* <ButtonGroup className="mr-2" aria-label="First group">
              <Button id="cancelItemAddBtn" variant="outline-secondary" className="mr-4 btn modal-close "  >Cancel</Button>
              <Button id="addItemBtn" variant="outline-primary" className="mr-2 btn" onClick={this.addProductTolist}> Add</Button>

            </ButtonGroup> */}

          </div>
        </div>

        {/* Model for adding produts ENDS here */}            


              </>
        )
    }
}

export default ViewOrder;
