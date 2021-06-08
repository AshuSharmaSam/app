import React, {Component,} from 'react';
import {Redirect, useHistory } from 'react-router-dom';
import {Card,Button,ButtonGroup,Nav,Image,Row,Col,Container,Spinner} from 'react-bootstrap';
import M from "materialize-css";
import Axios from "axios";
import Error from '../AdminPanel/Error'
import Success from '../AdminPanel/Success'
import ProductItemsList from './ProductItemListCard';
import OrderModal from './OrderSelectionModal';
import EditProduct from './EditProductItem';
import "./createorder.css";
import { base_url } from '../../globalConstants';
import { subject } from '../../service'


class CustomerDetailCard extends Component{

    constructor(props){
        super(props);
        
  this.state = ({title:"***",name:"********",
              email:"**********",address:"********",phone:"********",country:"********"

              })

    }

    componentDidUpdate(prevProps) {

      // DEFAULT WORKING EZZID
      // if (this.props.info.ezz_id !== prevProps.info.ezz_id) {
        
      //    this.setState({title:this.props.info.title,name:this.props.info.name,
      //       email:this.props.info.email,address: this.props.info.address,phone:this.props.info.phone_number
        
      //   })

      // }

      if (this.props.info.ezz_id !== prevProps.info.ezz_id || this.props.info.email !== prevProps.info.email ) {
        
         this.setState({title:this.props.info.title,name:this.props.info.name,
            email:this.props.info.email,address: this.props.info.address,phone:this.props.info.phone_number,country:this.props.info.country_name
        
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
                    <Col xs = {8} className="">
                    <h6 >Email:</h6><p>{this.state.email}</p>
                    </Col>
                    <Col xs = {4} className="right">
                      <h6>Country:</h6><p>{this.state.country}</p></Col>
                </Row>
               
            
            </Card.Text>
               


               </Card.Body> 
        </Card>
            </Col>
        </Row>

        )
    }
}



class CreateOrder extends Component{
    constructor(props){
        super(props);
     
        var today = new Date();
       

         
          var month = '' + (today.getMonth() + 1)
            var   day = '' + today.getDate()
           var    year = today.getFullYear()
        
           if (month.length < 2) {
             month = '0' + month;
           }
            
           if (day.length < 2) {
             day = '0' + day;
           }
           
        
           let date = [year, month, day].join('-');


        this.state = ({
          current_date: date,
            productlist:new Array() ,
            productlisthtml:<div></div> ,
            product_name:"",product_price:0,product_quantity:0 ,
            product_category_options :[],
            product_edit_category :[],
            product_category:"",ordernumber:"",
         customer_id:"",order_date:date,
        received_date:date,tracking_number:"",shiper_order_number:"",
        weight:0,height:0,fedex_charge:0,width:0,length:0,actual_charge:0,
        Weight_type:null,
          orderStatusSelected:"YTA",
          paymentTypeSelected:"card",showSpinner:false,
          customer_selected_data:{},
          pendingOrders:[],ordersSelectedInModal:[],
          createNewOrder:true,holdmergedorderstatus:"RTM",
          ordernumbermerge:"",
          error:"",
          rowNumber:"",
          selectItemDetails:{},
      
          generatedOrderId: "",
          isOrderUpdate: false,
          customer_email: "",
          serachInput: '',
          searchResult:''
      
          
          })

    }



    openOrderModel = ()=>{
      this.refs.ordermodel.openModal();
    }


    showSelectedModalOrders=(orderselected)=>{
      // console.log(`order selected ${orderselected}`)
      this.setState({ordersSelectedInModal:orderselected})
    }


    getCategories = async (countryid)=>{

      let token =localStorage.getItem("token")
      let header = {'Content-Type': 'multipart/form-data',
      'Authorization':'Token '+token,

      }

      var url= base_url+`categories/?country=${countryid}`
      var categories = await Axios.get(url,header)
      // console.log(categories.data)
      
     

      await this.setState({product_category_options:categories.data})
      await this.setState({product_edit_category:categories.data})

    }

getPendingOrder= async (customerid,orderstatus)=>{
try{
  let token =localStorage.getItem("token")
  let header = {'Content-Type': 'multipart/form-data',
  'Authorization':'Token '+token,

  }

  var url= base_url+`products/?ezz_id=${customerid}&status=${orderstatus}`
  let orders = await Axios.get(url,header)
  // console.log(orders.data)
  await this.setState({pendingOrders: this.state.pendingOrders.concat(orders.data)})
  // M.toast({html: 'Pending Ordersa fetched',classes:"white-text orange rounded"});
  this.setState({error:""})
}catch(error){
  console.log(error)
  M.toast({html: 'Pending Ordersa cannot be fetched',classes:"white-text red rounded"});
  this.setState({error:<Error/>})
}

}

handletableClick=(clickedrow)=>{
  //console.log(clickedrow)
 // M.toast({html: 'Clicked row '+clickedrow,classes:"white-text red rounded"});
 let productdetail = this.state.productlist[clickedrow]
 let countryoptions = this.state.product_category_options
 //console.log("handle cat",countryoptions)
 //console.log("handle cat",this.state.product_edit_category)
 this.setState({rowNumber:clickedrow})
 this.setState({selectItemDetails:productdetail})

 
   this.refs.editproduct.openModal(clickedrow,productdetail,countryoptions);
}

updateProduct=(rownumber,item)=>{
  console.log("updatig list",rownumber,item)
let productlist = this.state.productlist
productlist.splice(rownumber, 1, item)
this.setState({productlist:productlist})
// this.refs.editproduct.closeModal();
// M.toast({html: 'item updated at row ' +rownumber,classes:"white-text blue rounded"});

}

deleteProduct = () => {
  console.log('YEAH WE WILL WORK ON THIS');
}

    handleCustomerIDChange = async (ev)=>{       
      const target = ev.target;
      const name = target.name;

      let search_input = target.value
      var patt = /^EZ|ez\w{0,2}\d{0,4}/g;
      // var patt =  /^[EZez]\d{0,4}/g;
      var result = search_input.match(patt);

      this.setState({
        [name]: target.value,
        searchInput: search_input,
        searchResult: result
      })

    // }      
    // handleCustomerInfo = async e => {  
      // if(e.key !== 'Enter'){
      //   return
      // }

      try{
      
        let token =localStorage.getItem("token")
        let header = {'Content-Type': 'multipart/form-data',
        'Authorization':'Token '+token,

        }

        // Fetching user list on input change
        // var url= base_url+`customers/?ezz_id__icontains=${target.value}`
        // var url= base_url+`customers/?ezz_id=&ezz_id__icontains=${target.value}&email__icontains=${target.value}&phone_number=`

        var url
        var searchType

        if(this.state.searchResult){
          url= base_url+`customers/?ezz_id=&ezz_id__icontains=${this.state.searchInput}&email__icontains=&phone_number=`
          searchType = "ezzid"
        }        
        else{
          url= base_url+`customers/?ezz_id=&ezz_id__icontains=&email__icontains=${this.state.searchInput}&phone_number=`
          searchType = "email"
        }
        
        var customer_data = await Axios.get(url,header)
        // console.log(customer_data.data)
        let ezzidlist = {}
        let emaillist = {}
        let customerdataObject ={}
        
        document.getElementById("errCustomerNotAuthorized").style.display = "none"
        // DEFAULT WORKING EZZID
        // for (let customer of customer_data.data) {
        //   ezzidlist[customer.ezz_id] = customer.email;
        //   customerdataObject[customer.ezz_id] = customer;
        // }

        if (searchType === "ezzid") {
          for (let customer of customer_data.data.results) {
            ezzidlist[customer.ezz_id] = customer.email;
            customerdataObject[customer.ezz_id] = customer;
          }
        }
        // console.log();
        if (searchType === "email") {
          for (let customer of customer_data.data.results) {
            ezzidlist[customer.email] = customer.ezz_id;
            var tempEzId = ezzidlist[customer.email]
            customerdataObject[tempEzId] = customer;

          }
        }     

        // console.log(ezzidlist)
        // console.log(customerdataObject)
        this.setState({customer_data:customerdataObject})
        // Autoselect starts here
        var context = this;
        // /await context.setState({pendingOrders:[]})
        const elems_auto_customer = document.getElementById('customer_id');
        var options={
          data:ezzidlist,
          limit:20,
          onAutocomplete : async function(select_customer) {
            // context.setState({customer_id:select_customer})                // DEFAULT WORKING EZZID

            // context.setState({customer_email: select_customer})

            // console.log("select_customer",select_customer);

            var tempEzzId 
            if (searchType === "ezzid"){
              tempEzzId = select_customer
              context.setState({customer_id:select_customer})                
            }
            if (searchType === "email"){
              tempEzzId = ezzidlist[select_customer]
              context.setState({customer_id:tempEzzId})                
            }            
        
            // DEFAULT WORKING EZZID
            // context.setState({customer_selected_data:customerdataObject[select_customer]})
            // await context.setState({pendingOrders:[]})
           
            // context.getCategories(customerdataObject[select_customer].country)
            //       await context.getPendingOrder(select_customer,"IM")
            //        await context.getPendingOrder(select_customer,"YTA")





            context.setState({customer_selected_data:customerdataObject[tempEzzId]})
            await context.setState({pendingOrders:[]})
           
            context.getCategories(customerdataObject[tempEzzId].country)
                  await context.getPendingOrder(tempEzzId,"IM")
                   await context.getPendingOrder(tempEzzId,"YTA")
           
           







            //context.set
         
            // @TODO show model only when there is any orders pending 
            //like IM or BoX YET to arrive
            if (context.state.pendingOrders.length >0){
              context.openOrderModel();
            }
            // console.log("selected cust ID AUTH", customerdataObject[select_customer].card_authorize  )
           
            const checkCustomerAuth = customerdataObject[tempEzzId].card_authorize

            if(!checkCustomerAuth || checkCustomerAuth === "card details missing" )          
              document.getElementById("errCustomerNotAuthorized").style.display = "inline-grid"
            else  
              document.getElementById("errCustomerNotAuthorized").style.display = "none"
          },
        
          sortFunction:  function (a, b, inputString) {
            return a.indexOf(inputString) - b.indexOf(inputString);
          },
        }
        var instance = M.Autocomplete.init(elems_auto_customer,options)
        instance.open()
      }catch(err){

        M.toast({html: 'User data cannot be fetched',classes:"white-text red rounded"});
        
        console.log(err)
        this.setState({error:<Error/>})
      }

    }
   fillFormAutomatically=(data)=>{
    //  console.log(`fill auto maticaly ${data}`)
    this.setState({
      ordernumber: data.order_id,
      order_date: data.order_date,
      received_date: data.received_date,
      tracking_number: data.inbound_tracking_number,
      shiper_order_number : data.shipper_number,
      weight: data.weight,
      height: data.height,
      fedex_charge: data.freight_charge,
      width: data.breadth,
      length: data.length,
      actual_charge: data.actual_charge,
      orderStatusSelected: data.current_status,
      paymentTypeSelected: data.billing_type,

      
    });
    
  
  }

  getfedexActualRate = async (weight,height,length,breadth)=>{
    


    try{
  let token =localStorage.getItem("token")


  var config = {
    headers: { 
      'Content-Type': 'multipart/form-data' , 
      'Authorization':'Token '+token},
    
  };
  

  // Fetching user list on input change
  var url= base_url+`fedex_actual_rates/?weight=${weight}&height=${height}&breadth=${breadth}&length=${length}&ezz_id=${this.state.customer_id}`

  var response = await Axios.get(url,config)
  // console.log(response.data)
  return response.data
}catch(error){

  console.log(error.response.data)
  
   if (error.response.status ===503 ){
    M.toast({html: ""+error.response.data.error,classes:"white-text red rounded"});
   }
   if (error.response.status === 403 ){
    M.toast({html: ""+error.response.data.Error,classes:"white-text red rounded"});
   }
   
  
  // return response.data
  return error.response.data
}



  }

    handleFormChange= async (ev) =>{
     
      const target = ev.target
      const name = target.name
      // console.log(ev.target.name)
      // console.log(ev.target.value)
     
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
if(width <= 0 || height <=0 || weight <= 0 || length <=0 || this.state.actual_charge <0){
  M.toast({html: "Dimension values can not be 0/negative.",classes:"white-text red rounded"});
  return;
}

          if((width.toString()!=="" && width!==0) && (height.toString() !==""&& height!==0) && 
          (weight.toString() !==""&& weight!==0) &&( length.toString()!==""&& length !==0)){
            await this.setState({
              showSpinner:true
            })
            var response =  await this.getfedexActualRate(weight,height,length,width)
            console.log(response["freight_charges"] + response["actual_charges"])
              this.setState({
                fedex_charge:response["freight_charges"],
                actual_charge: response["actual_charges"],
                Weight_type:response["Weight_type"],
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
   

    componentDidMount(){
      
        M.AutoInit();





        console.log("is thissssssss working");
        

        // var elems_recieved = document.getElementById('received_date');
        var elems = document.querySelectorAll('.modal');
        let model_options = {
          dismissible:false,
        }
        var instances = M.Modal.init(elems, model_options);
        
        var elems_auto_customer = document.querySelectorAll('.autocomplete');

        var options_auto_customer={
      
          data: {}, 
          limit:20,
          onAutocomplete :function(select_customer) {
           
            // context.setState({ order_date: selecteddata});
            //  console.log("slect autocomplete",select_customer); 
          },
        
          sortFunction:  function (a, b, inputString) {
            return a.indexOf(inputString) - b.indexOf(inputString);
          },
        } 
        var instances_auto = M.Autocomplete.init(elems_auto_customer, options_auto_customer);
      

         
        var context = this;

       var newdate = this.newDate()
      //  console.log('new date',newdate)
        var elems_order = document.getElementById('order_date');
      
        var options_order={
            //selectMonths: true, // Enable Month Selection
            selectYears: 10, // Creates a dropdown of 10 years to control year
            format:'yyyy-mm-dd',
            autoClose :true,
            defaultDate:newdate,
            setDefaultDate :true,
            onSelect: function(date) {
              // console.log(context.formatDate(date))
               let selecteddata = context.formatDate(date)
              // console.log('selectedate',selecteddata)
              context.setState({ order_date: context.formatDate(selecteddata)})
              // console.log("order_date",selecteddata); // Selected date is logged
            },
          }
        var instances = M.Datepicker.init(elems_order, options_order);
        var elems_recieved = document.getElementById('received_date');
        var options_recieved={
            //selectMonths: true, // Enable Month Selection
            selectYears: 1, // Creates a dropdown of 10 years to control year
            format:'yyyy-mm-dd',
            autoClose :true,
            defaultDate:newdate,
            setDefaultDate :true,
            onSelect: function(date) {
              let selecteddata = context.formatDate(date)
              context.setState({ received_date: selecteddata.toString()});
              //  console.log("recived_datae"+ selecteddata); // Selected date is logged
            },
          }
        var instances = M.Datepicker.init(elems_recieved, options_recieved);
          instances.toString()
    
    
    }


// @TODO: handlechange for create order is pending Please implement it


     addProductTolist = ()=>{
      // console.log(this.state.productname + this.state.productprice +this.state.productquantity)
       var prodname =this.state.product_name
       var prodquant =this.state.product_quantity
       var prodcat =this.state.product_category
      //  console.log("prody")
      //  console.log(prodname + prodquant+prodcat )

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

        // console.log("Product List",this.state.productlist)
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

  
    cancelOrder = ()=>{
        // @TODO fucntionality not clear yet
        // M.toast({html: 'Pending for Implemention',classes:"white-text black rounded"})
        // return (<Redirect to="/Admin"/>
        window.location.reload();
   }


handleMergeCheckbox= (event)=>{
  // event.target.checked
  // console.log(this.state.holdmergedorderstatus)
  // console.log(event.target.checked)
  const name = event.target.name
  if (event.target.checked){
    this.setState({[name]:"WFC"})
  }else{
    this.setState({[name]:"RTM"})
  }
}

mergeOrder=()=>{
  
  // var elems = document.getElementById('merge_order_model');
  // var instance = M.Modal.init(elems);
  // instance.close();
  this.createOrderMerged();



}
mergerOrderCancel = ()=>{



  // var elems = document.getElementById('merge_order_model');
  // var instance = M.Modal.init(elems);
  // instance.close();
  this.createOrderNormal();







}


  createOrderMerged = async () => {
    let token = localStorage.getItem("token")
    const header = {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + token,

    }

    if (this.state.createNewOrder) {

      // new order creation
      console.log("Deleting previous orders if any")
      this.state.productlist.forEach(async (item) => {
        console.log("productlist Merged order-----")
        // console.log(item)
        try {

          let urlfordeletion = base_url+`products/${item.id}/`
          const response = await Axios.post(urlfordeletion,
            header)
          // console.log(`deletion response ${response.data}`)
          console.log("Product delete success")
          M.toast({ html: 'Product deletion Successful', classes: "white-text red rounded" });
        } catch (error) {
          M.toast({ html: 'No old products found', classes: "white-text green rounded" });
          console.log('error in deletion',error)
        }

      });



      const orderid = this.state.ordernumber
      const existing_order = this.state.ordernumbermerge
      // this.setState({ordernumber:orderid})

      var current_status = this.state.holdmergedorderstatus
      var Orderformdata = new FormData()
      console.log("orderid" + orderid)
      console.log(this.state.fedex_charge)
      console.log(this.state.actual_charge)
      Orderformdata.append("order_id", orderid.toString())
      Orderformdata.append("ezz_id", this.state.customer_id)
      Orderformdata.append("shipper_number", this.state.shiper_order_number)
      Orderformdata.append("billing_id", "2121")
      Orderformdata.append("billing_type", this.state.paymentTypeSelected)
      Orderformdata.append("order_date", this.state.order_date)
      Orderformdata.append("received_date", this.state.received_date)
      Orderformdata.append("inbound_tracking_number", this.state.tracking_number)
      Orderformdata.append("weight", this.state.weight)
      Orderformdata.append("length", this.state.length)
      Orderformdata.append("breadth", this.state.width)
      Orderformdata.append("height", this.state.height)
      Orderformdata.append("charge_type", "VAT")
      Orderformdata.append("freight_charge", this.state.fedex_charge)
      Orderformdata.append("actual_charge", this.state.actual_charge)
      Orderformdata.append("current_status", "DISC")
      Orderformdata.append("previous_status", "DISC")
      Orderformdata.append("status", "Deactive")
      Orderformdata.append("flag", "1")

      // console.log(JSON.stringify(Orderformdata))
      // console.log(JSON.stringify(this.state))

      const orderstatus_merged = {
        "remarks": "discarded after merging with order" + existing_order,
        "order_id": orderid,
        "status_id": "DISC"
      }

      const orderstatus_mergedwith = {
        "remarks": "",
        "order_id": existing_order,
        "status_id": current_status
      }

      // @Todo: APi to be called to save data for state

      try {

        const response = await Axios.post("http://localhost:8000/api/v1/ezzytrace/boxes_received/", Orderformdata,
          header)
        const response_newdiscrded = await Axios.post("http://localhost:8000/api/v1/ezzytrace/order_statuses/", orderstatus_merged,
          header)
        const response_existingupdated = await Axios.post("http://localhost:8000/api/v1/ezzytrace/order_statuses/", orderstatus_mergedwith,
          header)

        var existingOrderUpdateForm = new FormData()
        existingOrderUpdateForm.append("current_status", current_status)
        let urlforexistingOrderStatusUpdate = base_url+`boxes_received/${existing_order}/`
        await Axios.patch(urlforexistingOrderStatusUpdate, existingOrderUpdateForm, header)


        this.state.productlist.forEach(async (item) => {
          // console.log("productitemmerged")
          // console.log(item)
          try {
            var productformdata = new FormData()
            productformdata.append("order_id", existing_order)
            productformdata.append("description", item.productName)
            productformdata.append("quantity", item.productQuantity)
            productformdata.append("unit_price", item.productPrice)
            productformdata.append("inspection_status", "okay")
            productformdata.append("status", "Active")
            productformdata.append("category", item.productCategory)

            const response_products = await Axios.post(base_url+"products/", productformdata,
              header)

            console.log("Product added Successfully")
            this.setState({ error: <Success message=" Order Status Updated" /> })
            M.toast({ html: 'Product Addition Successfull', classes: "white-text blue rounded" });
          } catch (error) {
            M.toast({ html: 'Product Addition Failed', classes: "white-text red rounded" });
            console.log(error)
          }

        });


this.setState({error:<Success message=" New order for product items created"/>})
 M.toast({html: 'Order created successfully',classes:"white-text orange rounded"})
this.setState({error:""})    
}catch(err){
  
    M.toast({html: 'Please Try Again!',classes:"white-text red rounded"});
    
    console.log(err)
    this.setState({error:<Error/>})
        }




}else{


  try{
  
    var orderupdateForm = new FormData()
    orderupdateForm.append("shipper_number",this.state.shiper_order_number)
    // orderupdateForm.append("billing_id","2121")
    orderupdateForm.append("billing_type",this.state.paymentTypeSelected)
    orderupdateForm.append("order_date",this.state.order_date)
    orderupdateForm.append("received_date",this.state.received_date)
    orderupdateForm.append("inbound_tracking_number",this.state.tracking_number)
    orderupdateForm.append("weight",this.state.weight)
    orderupdateForm.append("length",this.state.length)
    orderupdateForm.append("breadth",this.state.width)
    orderupdateForm.append("height",this.state.height)
    // orderupdateForm.append("charge_type","VAT")
    orderupdateForm.append("freight_charge",this.state.fedex_charge)
    orderupdateForm.append("actual_charge",this.state.actual_charge)
    orderupdateForm.append("current_status",this.state.orderStatusSelected)
    let urlforOrderStatusUpdate = base_url+`boxes_received/${this.state.ordernumber}/`
    const response = await Axios.patch(urlforOrderStatusUpdate,orderupdateForm,
    header)

    console.log(`order status update succesfully ${response.data}`)
    this.setState({error:<Success message=" Order Status Updated"/>})
    M.toast({html: 'Updated SUccessfull',classes:"white-text orange rounded"});
  }catch(error){
     M.toast({html: 'Updation Failed',classes:"white-text red rounded"});
      console.log(error)
      this.setState({error:<Error/>})
  }

}
}





  createOrderNormal = async () => {

    
    // console.log('this.state.productlist', this.state.productlist);

    // const tempProductList = this.state.productlist
    
    const found = this.state.productlist.find(element => element["productPrice"]==0);

    console.log('found', found)

    if((this.state.width <= 0 || this.state.height <=0 || this.state.weight <= 0 || this.state.length <=0 || this.state.actual_charge <0)
      && this.state.orderStatusSelected !== 'YTA' ){
      M.toast({html: "Dimension values can not be 0/negative.",classes:"white-text red rounded"});
      return;
    }

    if(found && this.state.orderStatusSelected === 'RTM' ){
      M.toast({ html: 'Ready to Manifest not allowed for product price $0', classes: "white-text red rounded" });
      return
    }
    
    this.setState({isOrderUpdate: true})
    let token = localStorage.getItem("token")
    const header = {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + token,

    }

    console.log("create new order" + this.state.createNewOrder)

    if (this.state.createNewOrder) {

      // new order creation
      console.log("Deleting previous orders if any")
      this.state.productlist.forEach(async (item) => {
        console.log("productlist -----", item.id)
        console.log(item)
        try {

          let urlfordeletion = base_url+`products/${item.id}/`
          const response = await Axios.delete(urlfordeletion,
            header)
          console.log(`deletion response ${response.data}`)
          console.log("Product delete success")
          M.toast({ html: 'Product deletion Successful', classes: "white-text red rounded" });
        } catch (error) {
          M.toast({ html: 'No old products found', classes: "white-text green rounded" });
          console.log(error)
        }

      });



      // const orderid = Math.floor(1000 + Math.random() * 9000)
      // this.setState({ordernumber:orderid})







      var Orderformdata = new FormData()
      // console.log("orderid"+orderid)
      console.log(this.state.fedex_charge)
      console.log(this.state.actual_charge)
      // Orderformdata.append("order_id",orderid.toString())
      Orderformdata.append("ezz_id", this.state.customer_id)
      Orderformdata.append("shipper_number", this.state.shiper_order_number)
      Orderformdata.append("billing_id", "2121")
      Orderformdata.append("billing_type", this.state.paymentTypeSelected)
      Orderformdata.append("order_date", this.state.order_date)
      Orderformdata.append("received_date", this.state.received_date)
      Orderformdata.append("inbound_tracking_number", this.state.tracking_number)
      Orderformdata.append("weight", this.state.weight)
      Orderformdata.append("length", this.state.length)
      Orderformdata.append("breadth", this.state.width)
      Orderformdata.append("height", this.state.height)
      Orderformdata.append("charge_type", "VAT")
      Orderformdata.append("freight_charge", this.state.fedex_charge)
      Orderformdata.append("actual_charge", this.state.actual_charge)
      Orderformdata.append("current_status", this.state.orderStatusSelected)
      Orderformdata.append("previous_status", this.state.orderStatusSelected)
      Orderformdata.append("status", "Active")
      Orderformdata.append("flag", "1")

      // console.log(JSON.stringify(Orderformdata))
      // console.log("-------------------")
      // console.log(JSON.stringify(this.state))
      // console.log("-------------------")


      // @Todo: APi to be called to save data for state

      try {

        const response = await Axios.post(base_url+"boxes_received/", Orderformdata,
          header)

        const orderid = response.data.order_id
        console.log("orderid" + orderid)
        this.state.productlist.forEach(async (item) => {
          console.log("productitem")
          console.log(item)
          try {
            var productformdata = new FormData()
            productformdata.append("order_id", orderid.toString())
            productformdata.append("description", item.productName)
            productformdata.append("quantity", item.productQuantity)
            productformdata.append("unit_price", item.productPrice)
            productformdata.append("inspection_status", "okay")
            productformdata.append("status", "Active")
            productformdata.append("category", item.productCategory)

            const response_products = await Axios.post(base_url+"products/", productformdata,
              header)
            // alert(response.data)
            console.log("Product added Successfully")
            this.setState({ error: <Success message=" Order Status Updated" /> })
            M.toast({ html: 'Product Addition Successfull', classes: "white-text blue rounded" });
          } catch (error) {
            M.toast({ html: 'Product Addition Failed', classes: "white-text red rounded" });
            console.log(error)
          }

        });


        try {
          var email_subject = "invoice_missing"
          const status = this.state.orderStatusSelected
          switch (status) {
            case "IM":
              email_subject = "invoice_missing";
              break;
            case "WFC":
              email_subject = "consolidation";
              break;
          }
          if (status === "IM" || status === "WFC") {
            const emaildata = {
              "type": email_subject,
              "ezz_id": this.state.customer_id,
              "order_id": orderid
            }


            Axios({
              method: 'post',
              url: base_url+'status_printer',
              data: {
                "order_id": orderid
              }
            }).then(function (response) {
              console.log(response)
              console.log("printer APi success");
            }).catch(function (response) {
              console.log(response)
              console.log('printer API failed');
            })

            Axios({
              method: 'post',
              url: base_url+'whatsapp_templates',
              data: emaildata,
            }).then(
              function (response) {
                console.log(response)
                console.log("whatsapp sent done");
              }
            ).catch(
              function (response) {
                console.log(response)
                console.log("whatsapp sent Failure");
              }
            )

            const response = await Axios.post(base_url+"send_email/", emaildata,
              header)
            console.log(response)
            M.toast({ html: 'Email Sent to ' + response.data["Email to"], classes: "white-text red rounded" });
          }

        } catch (error) {

          M.toast({ html: 'Email Sending Failed to' + this.state.customer_id, classes: "white-text red rounded" });
        }



        this.setState({ error: <Success message=" New order foproduct items created" /> })
        M.toast({ html: 'Order created successfully', classes: "white-text orange rounded" })
        this.setState({ error: "" })
        this.setState({ generatedOrderId: orderid })
        console.log('generatedOrderId',this.state.generatedOrderId);
        document.getElementById("printLabel").disabled = false

        await this.getproducts(orderid)

      } catch (err) {

        M.toast({ html: 'Please Try Again!', classes: "white-text red rounded" });

        console.log(err)
        this.setState({ error: <Error /> })
      }




    } else {


      try {
        let token = localStorage.getItem("token")
        const header = {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + token,

        }
        var orderupdateForm = new FormData()
        orderupdateForm.append("shipper_number", this.state.shiper_order_number)
        // orderupdateForm.append("billing_id","2121")
        orderupdateForm.append("billing_type", this.state.paymentTypeSelected)
        orderupdateForm.append("order_date", this.state.order_date)
        orderupdateForm.append("received_date", this.state.received_date)
        orderupdateForm.append("inbound_tracking_number", this.state.tracking_number)
        orderupdateForm.append("weight", this.state.weight)
        orderupdateForm.append("length", this.state.length)
        orderupdateForm.append("breadth", this.state.width)
        orderupdateForm.append("height", this.state.height)
        // orderupdateForm.append("charge_type","VAT")
        orderupdateForm.append("freight_charge", this.state.fedex_charge)
        orderupdateForm.append("actual_charge", this.state.actual_charge)
        orderupdateForm.append("current_status", this.state.orderStatusSelected)
        let urlforOrderStatusUpdate = base_url+`boxes_received/${this.state.ordernumber}/`
        const response = await Axios.patch(urlforOrderStatusUpdate, orderupdateForm, header)

        console.log(`order status update succesfully ${response.data}`)
        this.setState({ error: <Success message=" Order Status Updated" /> })
        M.toast({ html: 'Updated SUccessfull', classes: "white-text orange rounded" });
      } catch (error) {
        M.toast({ html: 'Updation Failed', classes: "white-text red rounded" });
        console.log(error)
        this.setState({ error: <Error /> })
      }

    }
    
    document.getElementById('saveOrderBtn').disabled = true

  }
   addOrderToDB = async ()=>{
              let token =localStorage.getItem("token")
              const  header = {'Content-Type': 'application/json',
              'Authorization':'Token '+token,
            
              }
            
                  //@TODO: FOR FUTUREjust umcomment the code for merge ,discard and hold fucntionality 
     

              // check whether there is any order which is in state of WAITING FOR CONSOLIDATION
              // try {
              //   let url_wfc_check = base_url+`boxes_received/?ezz_id=${this.state.customer_id}&current_status=WFC`
              //   var  wfcResponse = await Axios.get(url_wfc_check,header)
              //   console.log(`WFC Response ${wfcResponse.data}`)
              //   if (wfcResponse.data.length >0){
              //     console.log(wfcResponse.data[0].order_id)
              //     this.setState({ordernumbermerge:wfcResponse.data[0].order_id})
              //     var elems = document.getElementById('merge_order_model');
              //     var instance = M.Modal.init(elems);
              //     instance.open()

              //     const orderid = Math.floor(1000 + Math.random() * 9000)
              //     this.setState({ordernumber:orderid})

              //   }else{
                  this.createOrderNormal()
                  var btn = document.getElementById('createorder')
                  btn.click()
                 // window.location.reload(false);
              // this.props.refresh();
              //   }
                
              // } catch (error) {
              //   console.log(error)
              // }



            


            



  }

  printLabelManually = () => {

    var order_id = this.state.generatedOrderId
    console.log("generatedOrderId:", order_id)

      Axios({
        method: 'post',
        url: base_url+'status_printer',
        data: {
          "order_id": order_id
        }
      }).then(function (response) {
        console.log(response)
        console.log("printer APi success");
        M.toast({
          html: `Print Label successful for orderId: ${order_id} `,
          classes: "center white-text green rounded"
        })
      }).catch(function (response) {
        console.log(response)
        console.log('printer API failed');
        M.toast({
          html: `Print Label unsuccessful`,
          classes: "white-text orange rounded"
        })
      })
      
  }

  //UPDATE ORDER START

  getproducts = async (orderid) => {
    // http://localhost:8000/api/v1/ezzytrace/products/?order_id=
    try {
      let token = localStorage.getItem("token")
      // let header = {'Content-Type': 'multipart/form-data',
      // 'Authorization':'Token '+token,

      // }

      var config = {
        headers: { 'Content-Type': 'multipart/form-data', 'Authorization': 'Token ' + token },

      };

      var url = base_url+`products/?order_id=${orderid}`
      let products = await Axios.get(url, config)
      // console.log("***orderlist-openmodel")
      // console.log(products.data)
      // await this.setState({productlisthtml:<ProductItemsList products={new Array()}/>})
      var items = new Array()
      products.data.forEach((product) => {
        let newitem = {
          id: product.id, productName: product.description,
          productPrice: product.unit_price, productQuantity: product.quantity,
          productCategory: product.category
        }
        items.push(newitem)
        // this.state.productlist.push(newitem)
      })

      M.toast({ html: 'Fetched products for selected order', classes: "white-text orange rounded" });
      // this.setState({error:<Success/>})


      await this.setState({ productlist: items })


      // await this.setState({ productlisthtml: <ProductItemsList orderid={orderid} products={items} rowclick={this.handletableClick} /> })


    } catch (error) {
      console.log(error)
      M.toast({ html: 'Failed to fetch products', classes: "white-text red rounded" });
      // this.setState({error:<Error/>})
    }
  }

  updateOrderDB= async(header)=>{
    const  orderid= this.state.generated_orderId

    const found = this.state.productlist.find(element => element["productPrice"]==0);

    console.log('found', found)
    // console.log('this.state.generated_orderId', this.state.generated_orderId)
    // console.log('orderid', orderid)

    if(found && this.state.orderStatusSelected === 'RTM' ){
      M.toast({ html: 'Ready to Manifest not allowed for product price $0', classes: "white-text red rounded" });
      return
    }

      try{
          
          var orderupdateForm = new FormData()
          // orderupdateForm.append("order_id",this.state.generated_orderId)
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
          // orderupdateForm.append("previous_status",this.props.orderdata.current_status)
          orderupdateForm.append("status","Deactive")
          orderupdateForm.append("flag","1")

          let urlforOrderStatusUpdate = base_url+`boxes_received/${this.state.generatedOrderId}/`
          const response = await Axios.patch(urlforOrderStatusUpdate,orderupdateForm, header)
    
          // console.log(`order status update succesfully ${response.data}`)
          this.setState({error:<Success message=" Order Updated"/>})
        
          M.toast({html: 'Order Updated Successfull',classes:"white-text orange rounded"});
  
  
          //Updating The Product 
  
          this.state.productlist.forEach(async(item)=>{
            // console.log("productitem")
            // console.log(item)
            // console.log(item.id, 'I AM THE ITEM GETTING UPDATED!!!!!!!!!!!!!!')
  
            
  
            try{
              var productformdata = new FormData()
              productformdata.append("order_id",this.state.generatedOrderId)
              productformdata.append("description",item.productName)
              productformdata.append("quantity",item.productQuantity)
              productformdata.append("unit_price",item.productPrice)
              productformdata.append("inspection_status","okay")
              productformdata.append("status","Active")
              productformdata.append("category",item.productCategory)
  
              console.log('ITEM-ID',item.id);

              if( typeof(item.id) === "number" && this.state.isOrderUpdate ){
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
          
  
  
  
       
          // try{
          //   var email_subject = "invoice_missing"
          //    const status = this.state.orderStatusSelected
          //    switch(status){
          //      case "IM":
          //       email_subject ="invoice_missing";
          //       break;
          //      case "WFC":
          //       email_subject ="consolidation";
          //       break;
        
        
                 
          //    }
          //   if (status===  "IM" || status === "WFC"){
          //     const  emaildata= {"type" : email_subject,
          //     "ezz_id" : this.state.customer_id,
          //     "order_id" : orderid}
  
  
          //     Axios({
          //       method:'post',
          //       url: base_url+'status_printer',
          //       data: {
          //         "order_id": orderid
          //       }
          //     }).then(function(response){
          //       console.log(response)
          //       console.log("printer APi success");
          //     }).catch(function(response){
          //       console.log(response)
          //       console.log('printer API failed');
          //     })
  
          //     Axios({
          //       method:'post',
          //       url: base_url+'whatsapp_templates',
          //       data: emaildata,
          //     }).then(
          //       function(response){ 
          //         console.log(response)
          //         console.log("whatsapp sent done");
          //       }
          //     ).catch(
          //       function(response){ 
          //         console.log(response)
          //         console.log("whatsapp sent Failure");
          //       }
          //     )
  

  
          //     const response = await Axios.post(base_url+"send_email/",emaildata,
          //   header)
          //   console.log(response)
          //   M.toast({html: 'Email Sent to '+response.data["Email to"],classes:"white-text red rounded"});
      
          //   }
           
          // }catch(error){
        
          //   M.toast({html: 'Email Sending Failed to'+ this.state.customer_id ,classes:"white-text red rounded"});
          // }
        
  
         await this.getproducts(this.state.generatedOrderId)
  
  
          // window.location.reload(false);
        }catch(error){
          M.toast({html: 'Order Updation Failed',classes:"white-text red rounded"});
            console.log(error)
            this.setState({error:<Error/>})
        }
  
  }
  
  updateOrder=()=>{
      let token =localStorage.getItem("token")
      const  header = {'Content-Type': 'application/json',
      'Authorization':'Token '+token,
      }
      this.updateOrderDB(header)
  
  
  }

  //--UPDATE ORDER END

render(){
  const opts={};
   opts['readOnly'] = 'readOnly';
  const catlist = this.state.product_category_options;
  if (catlist.length >0){
    var categoryList = catlist.map((item, i) => {
      return (
        <option className="black-text" key={i} value={item.category_id}>{item.category_name}</option>
      )
    }, this);
  }
  

    return(
        <Container>
{/* Edit product Table items */}
<EditProduct ref="editproduct" rowNumber={this.state.rowNumber}
productDetails={this.state.selectItemDetails}
 productcategory={this.state.product_edit_category}
 updateBtnClick={this.updateProduct} deleteBtnClick={this.deleteProduct}

 disablePrice= {this.state.orderStatusSelected ==="IM"} 
 />




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
                        <label htmlFor="product_quantity" className="black-text active">Quantity</label>
                        <span className="helper-text left" data-error="wrong" data-success="">Enter number of products items</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name="product_price" disabled={this.state.orderStatusSelected === "IM"} id="product_price" min="0" type="number" value={this.state.product_price} onChange={this.handleFormChange} className="" />
                        <label htmlFor="product_price" className="black-text active">Product Price</label>
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



            <ButtonGroup className="mr-2" aria-label="First group">
              <Button id="cancelItemAddBtn" variant="outline-secondary" className="mr-4 btn modal-close "  >Cancel</Button>
              <Button id="addItemBtn" variant="outline-primary" className="mr-2 btn" onClick={this.addProductTolist}> Add</Button>

            </ButtonGroup>

          </div>
        </div>

        {/* Model for adding produts ENDS here */}

      {/* Model for merge starts here */}
    <div id="merge_order_model" className="modal mergeordermodel modal-fixed-footer">
      <div className="modal-content">
        <br></br>
      <h5 className="center orange-text"> There is an order with status Waiting for Consolidation. 
                    <br></br>Do you want to merge this order with existing order?   </h5>
                    
                    <form>
                    <Row>
                      <Col>
                      <p className="center">
            <label>
                <input name="holdmergedorderstatus" value="WFC" type="checkbox" 
                checked={this.state.holdmergedorderstatus ==="WFC"} onChange={this.handleMergeCheckbox}/>
                <span className="red-text">Put it on Hold</span>
            </label>
            </p>
                      </Col>
                    </Row>
                    </form>
        
      </div>
      <div className="modal-footer" >
    
  <ButtonGroup className="mr-2" aria-label="Merge group">
    <Button id="cancelMergeAddBtn" variant="outline-secondary" onClick={this.mergerOrderCancel} className="mr-4 btn  modal-close "  >Don't Merge</Button> 
    <Button id ="MergeBtn" variant="outline-primary" onClick={this.mergeOrder} className="mr-2 btn  modal-close" > Merge</Button>

  </ButtonGroup>
 
    </div>
    </div>
        {/* Model for merge ends here */}

            {/* OrderModel code starts here */}
          
            <OrderModal ref="ordermodel" orders={this.state.pendingOrders}
             onOrderSelection={ v => {this.setState({ordersSelectedInModal: v})
              // console.log("hey world")  
              // console.log(v.order)
              // console.log(v.perordersdata[v.order])
              if (v.selectedproductId.length < v.perordersdata[v.order].length){
                 
                  
                  this.setState({createNewOrder:true})

              }else{
                this.setState({createNewOrder:false})
              }
              this.fillFormAutomatically(v.orderdetails) 
              for (let item in v.selectedproductId){
                // console.log(v.selectedproductId[item])
                let product = v.orderid[parseInt(v.selectedproductId[item])]
                console.log(`product orderid ${product}`)

                // let totalproducts = this.state.productlist.length + 1
        
                let newitem = {id:product.id,productName:product.description,
                productPrice:product.unit_price,productQuantity:product.quantity,
                productCategory:product.category
              }

              const producttemp = this.state.productlist;
              const isIDsame = (Productkey) => Productkey.id === product.id;
          let index  = producttemp.findIndex(isIDsame)
          if( this.state.productlist.length ===0 ){
              console.log('index is working-------')
            this.state.productlist.push(newitem)
                  this.setState({productlist: this.state.productlist})
                  
                      }else if(index === -1 &&  this.state.productlist.length > 0){
                        
                        this.state.productlist.push(newitem)
                  this.setState({productlist: this.state.productlist})
                      }else if(index !== -1){
                        M.toast({html: ' Product(s)  already in the table', classes:"white-text red rounded"})
                      }

                 // console.log("Product List",this.state.productlist)
                  

        
                  this.setState({productlisthtml:<ProductItemsList products={this.state.productlist}/>})
              }


              // console.log(v.selectedproductId)

             }}/>
            {/* {console.log(this.state.ordersSelectedInModal)} */}
            {/* OrderModel code ends here */}


<div className="row">
          <div className="col s3">
          <h4 className=" orange-text">Create Order</h4>
          </div>
       
</div>
                <Row>

                       <Col xs={12}md={7} lg={7}>
                    <div className="row">
    <form className="col s12" autocomplete="off">
      {this.state.error}
      <div className="row inputbox-height">
        <div className="input-field col s6">
          <input name="customer_id" id="customer_id" type="text" className="autocomplete"
            value={this.state.customer_id} 
            onChange={this.handleCustomerIDChange}
            onKeyDown={this.handleCustomerInfo}

          />
          <label htmlFor="customer_id">Enter Customer Id</label>
            <span id="errCustomerNotAuthorized" class="helper-text center yellow red-text " 
                  data-error="wrong" data-success="" 
                  style= {{ fontSize: "small", display: "none", fontWeight: "500" }} >Payment Method Not Added</span>
          <span className="helper-text" data-error="wrong" data-success="">Customer Ezzid ex: Ezz000000</span>
        </div>
      
      </div>
      <div className="row inputbox-height">
        <div className="input-field col s6">
        
          <input name="order_date" id="order_date" type="text"  className="datepicker" 
          value={this.state.order_date}
          //  onChange={this.handleFormChange}
          />
          
          <label htmlFor="order_date" style={{ marginLeft: '80%' }}><i className="material-icons right">date_range</i></label>
          <span className="helper-text" data-error="wrong" data-success="">Select the date Order Date </span>
        </div>
        <div className="input-field col s6">
          <input name="received_date" id="received_date" type="text" className="datepicker"
           value={this.state.received_date} 
          //  onChange={this.handleFormChange}
          />
          <label htmlFor="received_date" style={{ marginLeft: '80%' }}><i className="material-icons right">date_range</i> </label>
          <span className="helper-text" data-error="wrong" data-success="">Select date, the order arrived at warehouse</span>
        </div>
      </div>
      <div className="row inputbox-height">
        <div className="input-field col s6">
          <input name="tracking_number" id="tracking_number" type="text" className=""
           value={this.state.tracking_number} onChange={this.handleFormChange}
          />
          <label htmlFor="tracking_number">Enter Tracking Number</label>
          <span className="helper-text" data-error="wrong" data-success="">Enter Tracking inbound Number</span>

        </div>
        <div className="input-field col s6">
          <input name="shiper_order_number" id="shiper_order_number" type="text" className=""
           value={this.state.shiper_order_number} onChange={this.handleFormChange}
          />
          <label htmlFor="shiper_order_number">Enter Shipper Number</label>
          <span className="helper-text" data-error="wrong" >Enter Shipper Order Number</span>
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
          <input name="length"  id="length" min="0" type="number" className=""
           value={this.state.length} onChange={this.handleFormChange}
          />
          <label className="active" htmlFor="length">Length</label>
          <span className="helper-text" data-error="wrong" >Enter Length in inches</span>
        </div>
        <div className="input-field col s4">
          <input name="width" id="width" min="0" type="number" className=""
           value={this.state.width} onChange={this.handleFormChange}
          />
          <label className="active" htmlFor="width">Width</label>
          <span className="helper-text" data-error="wrong" >Enter Width in inches</span>
        </div>
        <div className="input-field col s4">
          <input name="height" id="height" min="0" type="number" className=""
           value={this.state.height} onChange={this.handleFormChange}
          />
          <label className="active" htmlFor="height">Height</label>
          <span className="helper-text" data-error="wrong" >Enter Height in inches</span>
        </div>
      </div> : null}
      {this.state.orderStatusSelected !=="YTA" ?
      <div className="row">
                <div className="input-field col s4">
          <input name="weight" id="weight" min="0" type="number" className=""
           value={this.state.weight} onChange={this.handleFormChange}
          />
          <label className="active" htmlFor="weight">Weight</label>
          <span className="helper-text" data-error="wrong" >Enter Weight in pounds</span>
        </div>       
        <div className="input-field col s4">
          <input name="fedex_charge" id="fedex_charge" min="0" type="number" className=""
           value={this.state.fedex_charge} onChange={this.handleFormChange} {...opts} 
          />
          <label className="active" htmlFor="fedex_charge">Fedex Charge </label>
          <span className="helper-text" data-error="wrong" >Auto generated</span>
        </div>
        <div className="input-field col s4">
          <input placeholder="" name="actual_charge" id="actual_charge" type="number"  className=""
          value={this.state.actual_charge} onChange={this.handleFormChange} min="0" 
          />
          <label className="active"htmlFor="actual_charge">Actual charges </label>
          <span className="helper-text" data-error="wrong" >Auto generated</span>
          <span className="helper-text green-text" >{this.state.Weight_type}</span>
        </div>
      </div> : null}
      <div className="row">
        <div className="col s12">
            {/* Order Status Radio Buttons */}
                <h4>Order Status</h4>
              
            <label>
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
            </label>
           
    
        </div>
    
      </div>
      <div className="row inputbox-height">
      <div className="col s6">
            {/* Payment Tyoe Radio Buttons */}
            <h4>Payment Type</h4>
             
            <label>
                <input name="paymentTypeSelected" value="cash" type="radio"  
                  checked={this.state.paymentTypeSelected ==="cash"} onChange={this.handleFormChange}
                />
                <span>Cash</span>
            </label>
           
            <label>
                <input name="paymentTypeSelected" value="card" type="radio" 
                  checked={this.state.paymentTypeSelected ==="card"} onChange={this.handleFormChange} />
                <span>Card</span>
            </label>
         
            {/* {this.state.orderStatusSelected} */}
            {/* {this.state.paymentTypeSelected} */}
            {/* {this.state.order_date} */}
            {/* {this.state.received_date} */}

        </div>
        </div>
    </form>
  
  </div>
                    </Col>
                    {/* right side column starts here */}
                    <Col xs={12}md={5} lg={5}>


                            <CustomerDetailCard 
                            info = {this.state.customer_selected_data}
                             />

                        <Row>
                        <Col>
                        <h5>Product Details</h5>
                        </Col>
                        <Col>
                        <Nav className="right">
            <Nav.Link className="red-text modal-trigger "  href="#addProductModal">
                Add<Image className="red-text ml-1" src="assets/images/plus-circle-red.svg"/></Nav.Link>
        </Nav>
                        </Col>
                    </Row>
                    {/* product card to be shown here */}
                    {/* <div className="productlistDiv ">{this.state.productlisthtml}</div> */}
                    <div className="productlistDiv "><ProductItemsList products={this.state.productlist} rowclick={this.handletableClick}/></div>
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
                      
                      {/* this.state.productlist */}
                       </div>
                    {/* <ButtonGroup aria-label="create order buttons" className="right">
                        <Button id="cancelOrderBtn"onClick={this.cancelOrder} variant="secondary"  className="mr-2 ">Cancel</Button>
                        <Button id="saveOrderBtn" onClick={this.addOrderToDB} variant="primary"  >Create Order</Button>
                        
                    </ButtonGroup> */}
                    </Col>

                    {/* right side columns ends here */}
      
                </Row> 

                <Row >
                  <Col>
                    <div className="left">
                        <h5 className="orange-text">Order Id: <span className="black-text" id='generated_orderId' >{this.state.generatedOrderId}</span></h5>
                    </div>
                  </Col>
                </Row>

          <Row>
            <Col>
              <div className="center">
                <ButtonGroup aria-label="create order buttons" className="">
                  <Button id="cancelOrderBtn"onClick={this.cancelOrder} variant="secondary"  className="">Cancel</Button>
                  <Button className="ml-5 " id="saveOrderBtn" onClick={this.addOrderToDB} variant="primary"  >Create Order</Button>
                  <Button className="ml-5 white-text" id="updateOrder" variant="success" onClick={this.updateOrder} >Update Order</Button>                        
                  <Button className="ml-5 white-text" id="printLabel" variant="warning"  onClick={this.printLabelManually}>Print Order</Button>                        
                </ButtonGroup>
              </div>
            </Col>
          </Row>
        </Container>


    )
}

}

export default CreateOrder;
