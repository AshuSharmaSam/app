import React, { Component } from 'react';
import { Card, Button, ButtonGroup, Nav, Image, Row, Col, Container, Spinner, Accordion, InputGroup, FormControl } from 'react-bootstrap';
import Axios from "axios";
import M from "materialize-css";
import { EditOutlined, Search, Print, NavigateBefore, NavigateNext, Info, EmojiFlagsRounded, } from "@material-ui/icons";
import { ModalHeader, ModalBody, ModalFooter, Modal  } from 'reactstrap';
import EditOrder from './editOrder';
import ViewOrder from './viewOrder';
import ProductItemsList from './ProductItemListCard';
// import CountryFrag from './Country';
import Icon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { base_url } from '../../globalConstants';
import './orderlist.css';


class OrderList extends Component {
  constructor(props) {

    super(props);

    //  this.state=({country:<CountryFrag countrytable = {this.props.countrydata}/>})
    // this.fetchCountryData =  this.fetchCountryData.bind(this)
    // console.log(this.props.orderdata);
    // console.log('operatorId',this.props.operator_id);

    this.state = ({
      orderslist: this.props.orderdata,
      previouSelectedOrder: "",
      previousSelectedOrderMerge: "",
      productlistforMerge: [],
      orderweights: {},
      ordercustomer: {},
      orderproducts: {},
      totalweight: 0,
      manifestlist: [],
      mergelist: [],
      orderforedit: {},
      customerinfo: {},
      productlist: [],
      productlisthtml: <div></div>,
      parentOrderSelected: null,
      showSpinner: false,
      product_category_options: [],
      searchTerm: '',
      ManifestDisable: false,
      EditOrderDisabled: false,
      statusIDtoName: {},
      orderfilterString:"",

      tempOrderId: "",
      tempOrderId2: "",
      remarksTextValue: "",
      OnHoldValue: {},
      remarksOnHoldList: {},
      isCardAuth: {},

      tempCardAuth:"",
      tempBillingType:"",
      order_response: this.props.orderResponse,

      previousPageUrl: this.props.orderResponse.previous,
      nextPageUrl: this.props.orderResponse.next,
      currentPageNumber: 1,

      currentOrderListCount: this.props.orderdata.length,
      searchResultsCount: -1,
      totalOrderListCount: this.props.orderResponse.count,
      orderlistCopy: this.props.orderdata,

      fileUrl: '',
      modalFile: false,
      // isOpenFile: false

      // operatorId: this.props.operator_id

    })

    // console.log('typeoforderslist',typeof(this.state.orderslist));
    // console.log('operatorId',this.state.operatorId);

    this.handleChangeRemarksText = this.handleChangeRemarksText.bind(this);
    this.handleChangeRemarksTextEdit = this.handleChangeRemarksTextEdit.bind(this);

  }


  componentDidMount() {
    // Auto initialize all the things!
    // @TODO: fetch data from server to show list and update the state orderslist
    M.AutoInit();
  }


  //ON HOLD CHECK

  handleChangeRemarksText(event) {
    this.setState({ remarksTextValue: event.target.value });
  }
 
  handleChangeRemarksTextEdit(event) {
    this.setState({ remarksTextValue: event.target.value });
  }

  onChangeOnHoldCheckOne = (event) => {

    var e = event.target
    var isCard = this.state.isCardAuth[e.value]

    // (!order.card_authorize || order.card_authorize === "card details missing" ) && order.billing_type === "card")

    // alert(event.target.value)
    // console.log(event.target.value);

    // console.log(this.state.orderslist[6].billing_type);
    this.setState({
      tempOrderId: event.target.value
    })
    var checkOnHold = document.getElementById(`onHoldManifest${event.target.id}`)

    console.log('card_authorize',isCard);

    if (event.target.checked) {

      checkOnHold.disabled = true
      checkOnHold.className = "btnDisableColor"

      this.checkedOnHold(event.target.value, event.target.checked)

      M.toast({ html: 'Input remarks', classes: "white-text teal rounded" })

      var elems = document.getElementById("remarksForOnHold");
      var instance = M.Modal.init(elems);
      instance.open()
      return;
    } else {

      checkOnHold.disabled = false
      checkOnHold.className = "btnCustomColor"

      this.checkedOnHold(event.target.value, event.target.checked)

    }


  }


  onChangeOnHoldCheckTwo = (event) => {

    var e = event.target

    this.setState({
      tempOrderId: event.target.value
    })
    var checkOnHold = document.getElementById(`onHoldManifest${event.target.id}`)

    if (event.target.checked) {

      // checkOnHold.disabled = true
      // checkOnHold.className = "btnDisableColor"

      this.checkedOnHold(event.target.value, event.target.checked)

      M.toast({ html: 'Input remarks', classes: "white-text teal rounded" })

      var elems = document.getElementById("remarksForOnHold");
      var instance = M.Modal.init(elems);
      instance.open()
      return;
    } else {

      // checkOnHold.disabled = false
      // checkOnHold.className = "btnCustomColor"

      this.checkedOnHold(event.target.value, event.target.checked)

    }


  }


  onHoldRemarks = () => {

    // alert(this.state.tempOrderId)
    // console.log(this.state.tempOrderId);




    var temp_orderId = this.state.tempOrderId
    console.log(temp_orderId);
    this.statusOnHoldRemarks(temp_orderId)

  }


  statusOnHoldRemarks = async (tempId) => {

    console.log(tempId);

    // var inputValue = document.getElementById("remarksText").value;
    // alert(inputValue);

    let remarksData2 = this.state.remarksTextValue
    console.log(remarksData2);

    let token = localStorage.getItem("token")
    let header = {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Token ' + token,

    }
    var config = {
      headers: { 'Content-Type': 'multipart/form-data', 'Authorization': 'Token ' + token },

    };

    try {

      var remarksOnHold = new FormData()
      remarksOnHold.append("remarks", remarksData2)

      let remarksOnHoldurl = base_url+`boxes_received/${tempId}/`

      const remarksOnHold_response = await Axios.patch(remarksOnHoldurl, remarksOnHold, config)
      console.log(remarksOnHold_response.data.remarks)
      M.toast({
        html: 'Remarks added for OrderID: ' + tempId + '<br/> Please refresh' , classes: "white-text blue rounded"
      })

    } catch (error) {
      console.log(error)
      M.toast({ html: 'Failed to add remarks', classes: "white-text orange rounded" });
    }


  }

  checkedOnHold = async (tempId, checkedValue ) => {

    console.log(tempId);
    console.log(checkedValue);

    // var inputValue = document.getElementById("remarksText").value;
    // alert(inputValue);

    let token = localStorage.getItem("token")
    let header = {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Token ' + token,
    }
    var config = {
      headers: { 'Content-Type': 'multipart/form-data', 'Authorization': 'Token ' + token },

    };
    

    if( checkedValue ){


      try {

        var remarksOnHold = new FormData()
        // remarksOnHold.append("remarks", "")
        remarksOnHold.append("on_hold", "true")
  
        let remarksOnHoldurl = base_url+`boxes_received/${tempId}/`
  
        const remarksOnHold_response = await Axios.patch(remarksOnHoldurl, remarksOnHold, config)
        console.log(remarksOnHold_response.data.on_hold)
        M.toast({
          html: 'On Hold added for OrderID: ' + tempId + '<br/> Please refresh' , classes: "white-text blue rounded"
        })
  
      } catch (error) {
        console.log(error)
        M.toast({ html: 'Failed to add On Hold status', classes: "white-text orange rounded" });
      }
  

      

    }else{

      try {

        var remarksOnHold = new FormData()
        // remarksOnHold.append("remarks", "On Hold Removed")
        remarksOnHold.append("on_hold", "false")
  
        let remarksOnHoldurl = base_url+`boxes_received/${tempId}/`
  
        const remarksOnHold_response = await Axios.patch(remarksOnHoldurl, remarksOnHold, config)
        console.log(remarksOnHold_response.data.on_hold)
        M.toast({
          html: 'On Hold removed for OrderID: ' + tempId + '<br/> Please refresh', classes: "white-text orange rounded"
        })
  
      } catch (error) {
        console.log(error)
        M.toast({ html: 'Failed to remove On Hold status', classes: "white-text orange rounded" });
      }
  
    }


  }

  onHoldRemarksEdit = (orderIdTemp) => {


    console.log(this.state.remarksOnHoldList[orderIdTemp]);

    this.setState({
      tempOrderId2: orderIdTemp
    })

    var textField = document.getElementById("remarksTextEdit");
    textField.value = this.state.remarksOnHoldList[orderIdTemp]
    textField.name = orderIdTemp
    
    var elems = document.getElementById("updateRemarksOnHold");
    var instance = M.Modal.init(elems);
    instance.open()
    return;

  }

  updateOnHoldRemarks = async (tempId) => {

    console.log(tempId);

    // var inputValue = document.getElementById("remarksText").value;
    // alert(inputValue);

    let remarksData = this.state.remarksTextValue
    // console.log(remarksData);

    let token = localStorage.getItem("token")
    let header = {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Token ' + token,

    }
    var config = {
      headers: { 'Content-Type': 'multipart/form-data', 'Authorization': 'Token ' + token },

    };

    try {

      var remarksOnHold = new FormData()
      remarksOnHold.append("remarks", remarksData)

      let remarksOnHoldurl = base_url+`boxes_received/${tempId}/`

      const remarksOnHold_response = await Axios.patch(remarksOnHoldurl, remarksOnHold, config)
      console.log(remarksOnHold_response.data.remarks)
      M.toast({
        html: 'Update Remarks for OrderID: ' + tempId + '<br/> Please refresh' , classes: "white-text blue rounded"
      })

    } catch (error) {
      console.log(error)
      M.toast({ html: 'Failed to add remarks', classes: "white-text orange rounded" });
    }


  }  

  //ON HOLD CHECK

  //TEMP

  updateOrderList = async (updatedUrl, pg) => {

    var context = this
    var tempPageNumber = this.state.currentPageNumber


    this.setState({
      showSpinner: true,
    })

    // console.log('UPDATED URL',updatedUrl)

    let response_data = []
    var prevUrl 
    var nextUrl 

    await Axios({
      method: "GET",
      url: updatedUrl
    }).then(function(response){
      // console.log("response",response);
      // console.log("response.data.results",response.data.results);
      response_data = response.data.results
      // context.setState({ updatedOrdersList: response.data.results })
      // console.log("UPDATED ORDELIST",this.state.updatedOrdersList);      
      // console.log("UPDATED ORDELIST",response_data);   
      prevUrl = response.data.previous   
      nextUrl = response.data.next   

      // tempPageNumber = updatedUrl.toString().split('=')[1] ?? 1

      if(pg === '+')
        tempPageNumber = tempPageNumber + 1
      else if(pg === '-')
        tempPageNumber = tempPageNumber - 1
      else
        tempPageNumber = ''

      context.setState({
        showSpinner: false,
        currentPageNumber: tempPageNumber
      })
    }).catch(function(response){
      console.log("response",response);
      console.log("ERROR UPDATING ORDERLIST");
    })

    await this.setState({orderslist: response_data})
    this.setState({previousPageUrl: prevUrl})
    this.setState({nextPageUrl: nextUrl})

  }

  // previousPage = async () => {

  // }

  nextPageTemp = () => {
    // alert(`NEXT PAGE ${this.state.order_response.next}`)
    // this.props.orderList_url = this.state.order_response.next
    console.log("this.props.orderList_url",this.props.orderList_url);
    console.log("this.state.order_response.next", this.state.order_response.next);

    var tempUrl = this.state.order_response.next
    this.props.orderList_url(tempUrl)

  }

  //--TEMP

  onChangeSelectManifest = (event) => {
    // console.log(event.target.checked, event.target.value);
    // console.log(event.target.name)
    if (this.state.previouSelectedOrder === "" && event.target.name) {
      // console.log("first time " + event.target.name)
      this.state.manifestlist.push(event.target.value)

      this.setState({ manifestlist: this.state.manifestlist })
      // console.log("Selected " + this.state.manifestlist)
      // console.log(this.state.totalweight + parseFloat(this.state.orderweights[event.target.value]))
      this.setState({ totalweight: this.state.totalweight + parseFloat(this.state.orderweights[event.target.value]) })
      this.setState({ previouSelectedOrder: event.target.name })
      this.setState({ ManifestDisable: false })

    }
    else {
      console.log("In else " + event.target.name)
      console.log("In else " + this.state.previouSelectedOrder)
      this.setState({ ManifestDisable: false })
      if (this.state.previouSelectedOrder === event.target.name) {
        // selected id code starts here

        if (event.target.checked) {
          this.state.manifestlist.push(event.target.value)
          console.log(this.state.totalweight + parseFloat(this.state.orderweights[event.target.value]))
          this.setState({ totalweight: this.state.totalweight + parseFloat(this.state.orderweights[event.target.value]) })
          this.setState({ manifestlist: this.state.manifestlist })
          console.log("Selected " + this.state.manifestlist)
          this.setState({ ManifestDisable: false });
          //this.setState({ManifestDisable: })
          // order_orderIdSelect
          // this.state.order_orderIdSelect.push(event.target.value)

          // this.setState({order_orderIdSelect:this.state.order_orderIdSelect})
          // console.log("Selected "+this.state.order_orderIdSelect)
        } else {
          let selectedlist = this.state.manifestlist
          //remove unselected
          this.setState({ ManifestDisable: false })
          let removedUnselected = selectedlist.filter(function (item) { return item !== event.target.value; })
          this.setState({ manifestlist: removedUnselected })
          console.log("remainnng" + removedUnselected)
          console.log(this.state.totalweight - parseFloat(this.state.orderweights[event.target.value]))
          this.setState({ totalweight: this.state.totalweight - parseFloat(this.state.orderweights[event.target.value]) })
          console.log("After unselecting " + this.state.manifestlist)
          this.setState({ previouSelectedOrder: event.target.name })

        }

      } else {
        if (event.target.checked && this.state.previouSelectedOrder !== event.target.name) {
          M.toast({ html: 'Select Order for same country and customer', classes: "white-text red rounded" })
          this.setState({ ManifestDisable: true });
          //this.setState({ previouSelectedOrder: this.state.manifestlist[this.state.manifestlist.length-1] })

        }

      }
    }

  }

  onChangeSelectMerge = (event) => {

    if (this.state.previousSelectedOrderMerge === "" && event.target.name) {
      console.log("first time " + event.target.name)
      this.state.mergelist.push(event.target.value)

      this.setState({ mergelist: this.state.mergelist })
      console.log("Selected " + this.state.mergelist)


      this.setState({ previousSelectedOrderMerge: event.target.name })
    }
    else {

      // console.log("In else " + event.target.name)
      // console.log("In else " + this.state.previousSelectedOrderMerge)
      if (this.state.previousSelectedOrderMerge === event.target.name) {
        // selected id code starts here

        if (event.target.checked) {
          this.state.mergelist.push(event.target.value)

          this.setState({ mergelist: this.state.mergelist })
          console.log("Selected " + this.state.mergelist)
          console.log(`sorted - ${this.state.mergelist.sort()}`)

        } else {
          let selectedlist = this.state.mergelist
          //remove unselected

          let removedUnselected = selectedlist.filter(function (item) { return item !== event.target.value; })
          this.setState({ mergelist: removedUnselected })
          console.log("remainnng" + removedUnselected)

          console.log("After unselecting " + this.state.mergelist)
          this.setState({ previousSelectedOrderMerge: event.target.name })


        }

      } else {
        if (event.target.checked && this.state.previousSelectedOrderMerge !== event.target.name) {
          M.toast({ html: 'Select Order for same  customer', classes: "white-text red rounded" })
          this.setState({ previousSelectedOrderMerge: event.target.name })
        }

      }
    }

  }

  mergeOrders = async () => {


    // if(selectedOrders.length<2){
    //   M.toast({html: 'Select atleast two Orders ',classes:"white-text red rounded"})

    //   return;
    // }
    // let sortedlist = selectedOrders.sort()
    // let latestOrder = sortedlist[sortedlist.length-1]
    let parentOrder = this.state.parentOrderSelected
    console.log("latestes order", parentOrder)
    let orderlist = this.state.mergelist.slice()

    let context = this
    let productupdatelist = []
    this.state.mergelist.forEach(function (order) {
      productupdatelist = productupdatelist.concat(context.state.orderproducts[order])

    })


    let pos = orderlist.indexOf(parentOrder)
    console.log("postion", pos)

    orderlist.splice(pos, 1)
    console.log("remaing order", orderlist)


    let token = localStorage.getItem("token")
    let header = {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + token
    }



    let parentOrderUpdateData = { "current_status": "RTM" }

    let orderUpdateurl = base_url+`boxes_received/${parentOrder}/`
    await Axios({
      method: 'PATCH',
      url: orderUpdateurl,
      data: parentOrderUpdateData,
      headers: header
    }).then(async (response)=> {
      console.log(response.status)
      console.log("latest order" + parentOrder)
      M.toast({ html: 'Success status changed of Latest Orders ' + parentOrder, classes: "white-text blue rounded" })



     await productupdatelist.forEach(async (product) =>{
        console.log(product.id)
        let productUpdateurl = base_url+`products/${product.id}/`
        let productpatchdata = {
          "order_id": parentOrder,
          "quantity": product.quantity,
          "unit_price": product.unit_price,
          "category": product.category
        }
       await  Axios({
          method: 'PATCH',
          url: productUpdateurl,
          data: productpatchdata,
          headers: header
        }).then(async (reponse) =>{
          console.log(response.status)
          // .slice(2, 4)
          M.toast({ html: 'Successfully updated order number in products', classes: "white-text green rounded" })
          console.log("discarded orders", orderlist.length)
          orderlist.forEach(async (discOrdr) =>{
            let discOrderUpdateData = { "current_status": "DISC" }
            console.log("discarding order" + discOrdr)
            let discorderurl = base_url+`boxes_received/${discOrdr}/`
           await  Axios({
              method: 'PATCH',
              url: discorderurl,
              data: discOrderUpdateData,
              headers: header
            }).then(async (response) =>{
              console.log(response.status)
              M.toast({ html: 'Discarded ' + discOrdr, classes: "white-text yellow rounded" })
              await this.refreshpage();
            }).catch(async (response) =>{
              console.log(response.status)
              M.toast({ html: 'Failed to Discard ' + discOrdr, classes: "white-text red rounded" })
             
            })
          })

        }).catch(async (response)=> {
          console.log(response.status)
          M.toast({ html: 'failed to update order number in products', classes: "white-text red rounded" })
       
        })

      })

    }).catch(async (response) =>{
      M.toast({ html: 'Error Updating Orders', classes: "white-text red rounded" })
     
    })


  }

  /* handleSearchBoxChange=async e=>{
   Axios.get(base_url+`box_search/?ezz_id__ezz_id__icontains=${e.target.value}`)
   .then(function(response){
     console.log('search box wala response'+ response);
   })
   .catch(function(response){
     console.log(response);
   })
     
 } */

 handleKeyDownSearch=(eventKey)=>{
  //  console.log('orderfilterString',this.state.orderfilterString);
  
  var filterString = this.state.orderfilterString
  let context = this

   if(eventKey.key ==="Backspace"){
    //  this.setState({orderslist: this.state.orderlistCopy})    
    this.setState({currentPageNumber: 1})

    this.setState({
      showSpinner: true,
    })
     var orderCount
        var prevUrl    
        var nextUrl    
        var search_results
  
        let searchUrl = base_url+`boxes_received/`   
         Axios({
          method: 'GET',
          url: searchUrl
        }).then( async (response) =>{
          // console.log(response);
          // console.log(response.data.results);
          // console.log(response.data.count);
          // console.log(response.data.next);
          // console.log(response.data.previous);
          
          orderCount = response.data.count
          prevUrl = response.data.previous   
          nextUrl = response.data.next  
          search_results = response.data.results

          context.setState({currentPageNumber: 1})
  
          if(!response.data.results){
            this.setState({orderslist: []}) 
            this.setState({searchResultsCount: orderCount})
            this.setState({currentOrderListCount: response.data.results.length})
            return
          }
  
          this.setState({searchResultsCount: orderCount})
          this.setState({orderslist: search_results})
          this.setState({previousPageUrl: prevUrl})
          this.setState({nextPageUrl: nextUrl})
          this.setState({searchResultsCount: orderCount, showSpinner: false})
          
          console.log('orderlist.length', this.state.orderslist.length);
          this.setState({currentOrderListCount: response.data.results.length})
          
        }).catch(  (response) =>{
          console.log(response)
         this.setState({showSpinner:false})
        //  M.toast({ html: ""+response.Error, classes: "white-text red rounded" })
       
        })
   }
  if (eventKey.key ==="Enter"){
  // if (filterString.trim()===""){
  //   return
  // }
  this.setState({
    showSpinner: true,
    currentPageNumber: 1
  })

  var orderCount
  var prevUrl    
  var nextUrl    
  var search_results

  let searchUrl = base_url+`boxes_received/?search=${filterString}`   
  Axios({
    method: 'GET',
    url: searchUrl
  }).then( async (response) =>{
    // console.log(response);
    // console.log(response.data.results);
    // console.log(response.data.count);
    // console.log(response.data.next);
    // console.log(response.data.previous);
    
    orderCount = response.data.count
    prevUrl = response.data.previous   
    nextUrl = response.data.next  
    search_results = response.data.results

    context.setState({currentPageNumber: 1})

    if(!response.data.results){
      this.setState({orderslist: []}) 
      this.setState({searchResultsCount: orderCount})
      this.setState({currentOrderListCount: response.data.results.length})
      return
    }

    this.setState({searchResultsCount: orderCount})
    this.setState({orderslist: search_results})
    this.setState({previousPageUrl: prevUrl})
    this.setState({nextPageUrl: nextUrl})
    this.setState({searchResultsCount: orderCount, showSpinner: false})
    
    console.log('orderlist.length', this.state.orderslist.length);
    this.setState({currentOrderListCount: response.data.results.length})
    
  }).catch(  (response) =>{
    console.log(response)
    this.setState({showSpinner:false})
    // M.toast({ html: response.Error, classes: "white-text red rounded" })
   
  })
}
 }

  editSearchTerm = async (e) => {
      // console.log(e.target.value)
      
      let word = e.target.value
      let bucket = word.split(' ')
      
      // console.log(bucket)
      
      let searchString = bucket.reduce((prevVal, currVal)=>{ return prevVal+=currVal+' ' }, ' ')

      console.log('searchString',searchString);
      this.setState({
          orderfilterString:searchString
      })
      
    
      
      // console.log('URL', base_url+`boxes_received/?search=${searchString}`);
      
      // const response=await Axios.get(searchUrl)
      // const {data}=response.results;

      if(searchString ===""){
        this.setState({
          showSpinner: true,
        })
      
        var orderCount
        var prevUrl    
        var nextUrl    
        var search_results
  
        let searchUrl = base_url+`boxes_received/?search=${searchString}`   
        await  Axios({
          method: 'GET',
          url: searchUrl
        }).then( async (response) =>{
          // console.log(response);
          // console.log(response.data.results);
          // console.log(response.data.count);
          // console.log(response.data.next);
          // console.log(response.data.previous);
          
          orderCount = response.data.count
          prevUrl = response.data.previous   
          nextUrl = response.data.next  
          search_results = response.data.results
  
          if(!response.data.results){
            this.setState({orderslist: []}) 
            this.setState({searchResultsCount: orderCount})
            this.setState({currentOrderListCount: response.data.results.length})
            return
          }
  
          this.setState({searchResultsCount: orderCount})
          this.setState({orderslist: search_results})
          this.setState({previousPageUrl: prevUrl})
          this.setState({nextPageUrl: nextUrl})
          this.setState({searchResultsCount: orderCount, showSpinner: false})
          
          console.log('orderlist.length', this.state.orderslist.length);
          this.setState({currentOrderListCount: response.data.results.length})
          
        }).catch(  (response) =>{
          console.log(response)
         this.setState({showSpinner:false})
        //  M.toast({ html: ""+response.Error, classes: "white-text red rounded" })
       
        })
      }
  }

  refreshpage = async () => {
    let token = localStorage.getItem("token")
    let header = {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + token
    }
    let context = this
    this.setState({
      showSpinner: true,
      orderslist:[],
      mergelist: []
    })

    let url = base_url+`boxes_received/`
    await Axios({
      method: 'GET',
      url: url,
      headers: header
    }).then(function (response) {
      console.log(response.status)
      console.log(response)

      context.setState({
        orderslist: response.data.results,
        showSpinner: false,
        manifestlist: [],
        previouSelectedOrder: ""
      })
      
      context.setState({
        searchResultsCount: -1,
        currentOrderListCount: response.data.results.length,
        totalOrderListCount: response.data.count
      })
      
      M.toast({ html: 'Refreshed ', classes: "white-text green rounded" })
      
    }).catch(function (response) {
      console.log(response)
      M.toast({ html: "Failed to refresh", classes: "white-text red rounded" })
      context.setState({

        showSpinner: false
      })
    })
  }

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
      console.log("***orderlist-openmodel")
      console.log(products.data)
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


      await this.setState({ productlisthtml: <ProductItemsList orderid={orderid} products={items} rowclick={this.handletableClick} /> })


    } catch (error) {
      console.log(error)
      M.toast({ html: 'Failed to fetch products', classes: "white-text red rounded" });
      // this.setState({error:<Error/>})
    }
  }

  getcustomer = async (ezzid) => {
    // http://localhost:8000/api/v1/ezzytrace/products/?order_id=
    try {
      let token = localStorage.getItem("token")
      let header = {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Token ' + token,

      }

      var url = base_url+`customers/?ezz_id=${ezzid}`
      let customer = await Axios.get(url, header)
      console.log(customer.data.results)


      // M.toast({html: 'Pending Ordersa fetched',classes:"white-text orange rounded"});
      // this.setState({error:<Success/>})
      // this.setState({productlist: this.state.productlist})
      this.setState({ customerinfo: customer.data.results[0] })


    } catch (error) {
      console.log(error)
      M.toast({ html: 'Failed to fetch cutomer details', classes: "white-text red rounded" });
      // this.setState({error:<Error/>})
    }
  }
  getCategories = async (countryid) => {
    console.log('countries', countryid)
    let token = localStorage.getItem("token")
    let header = {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + token,

    }
    let context = this
    let url = base_url+`categories/?country=${countryid}`
    await Axios({
      method: 'get',
      url: url,
      headers: header
    }).then(function (response) {
      console.log(response.data)
      context.setState({ product_category_options: response.data })
      //  this.setState({product_edit_category:response.data})
    }).catch(function (response) {
      console.log("ERROR get categoies", response)
    })








  }

  click = () => {
    this.props.orderList();
  }
  handleParentOrderChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    this.setState({ [name]: value })
  }
  selectParentOrder = () => {
    // M.toast({html: 'Selected :-  '+this.state.boxselectedlist,classes:"white-text orange rounded"})

    let selectedOrders = this.state.mergelist
    if (selectedOrders.length < 2) {
      M.toast({ html: 'Select atleast two Orders ', classes: "white-text red rounded" })

      return;
    }
    var elems = document.getElementById("parentOrderModel");
    var instance = M.Modal.init(elems);
    instance.open()
  }

  openeditordermodal = async (order) => {


    await this.getproducts(order.order_id)
    await this.getcustomer(order.ezz_id)
    await this.setState({ orderforedit: order });

    let country = this.state.customerinfo.country
    await this.getCategories(country)

    let productcatgry = this.state.product_category_options
    let products = this.state.productlist
    console.log("orderlistopent", products)
    this.refs.editorder.openModal(products, productcatgry);
    // this.refs.editorder.openModal(order);

  }

  openviewordermodal = async (order) => {


    await this.getproducts(order.order_id)
    await this.getcustomer(order.ezz_id)
    await this.setState({ orderforedit: order });

    let country = this.state.customerinfo.country
    await this.getCategories(country)

    let productcatgry = this.state.product_category_options
    let products = this.state.productlist
    console.log("orderlistopent", products)
    this.refs.vieworder.openModal(products, productcatgry);

  }

  printLabelManually = (order) => {

    Axios({
      method: 'post',
      url: base_url+'status_printer',
      data: {
        "order_id": order.order_id
      }
    }).then(function (response) {
      console.log(response)
      console.log("printer APi success");
      M.toast({
        html: `Print Label successful for orderId: ${order.order_id} `,
        classes: "center white-text green rounded"
      })
    }).catch(function (response) {
      console.log(response)
      console.log('printer API failed');
      M.toast({
        html: `Print Label not allowed for order status ${order.current_status_name} `,
        classes: "white-text orange rounded"
      })
    })

  }

  manifestOrders = async () => {
    // @TODO Update database and take all other necessary steps
    var ezz_id = this.state.ordercustomer[this.state.manifestlist[0]];
    var box_id;
    // console.log("ezyid:-" + ezz_id)
    // console.log("manifestList0:", this.state.manifestlist[0])
    // console.log("ordercustomer:", this.state.ordercustomer)

    // console.log(this.state.orderweights)
    if (this.state.manifestlist.length === 0) {
      M.toast({ html: 'No Order selected! Please select atleast one ' + this.state.manifestlist, classes: "white-text red rounded" })
    } else {
      // M.toast({html: 'Pending for Implementation '+this.state.manifestlist,classes:"white-text orange rounded"})

      let token = localStorage.getItem("token")
      let operator_id = sessionStorage.getItem("user_id")   
      console.log('USER OPERATOR ID', operator_id );            
      let header = {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Token ' + token,

      }
      var config = {
        headers: { 'Content-Type': 'multipart/form-data', 'Authorization': 'Token ' + token },

      };

      try {


        //@TODO: get operator id saved in cookies.        
        // var operator_id = this.state.operatorId               

        var createboxform = new FormData()
        createboxform.append("box_weight", this.state.totalweight.toString())
        createboxform.append("box_status", "NEW")
        // createboxform.append("ezz_id",ezz_id) 
        createboxform.append("shipped_by", operator_id)
        let urlboxoutbound = base_url+`boxes_out/`
        const boxout_response = await Axios.post(urlboxoutbound, createboxform, config)
        box_id = boxout_response.data.box_id
        // console.log(boxout_response)
        // updating boxid and status column in selected orders
        this.state.manifestlist.forEach(async function (item, index) {
          var orderupdateForm = new FormData()

          // orderupdateForm.append("current_status",this.state.orderStatusSelected)
          orderupdateForm.append("current_status", "NEW")
          orderupdateForm.append("box_id", box_id)

          let urlforOrderStatusUpdate = base_url+`boxes_received/${item}/`
          const response = await Axios.patch(urlforOrderStatusUpdate, orderupdateForm, config)


          console.log(response.data)
          console.log(response.data.ezz_id)
          ezz_id = response.data.ezz_id
          M.toast({ html: 'Updated box_id in order ' + item, classes: "white-text green rounded" })
        })


        // @TODO- send mail for shipment notification.
        // try {
          var email_subject = "shipment_notification"
          //  const status = this.state.orderStatusSelected


          const emaildata = {
            "type": email_subject,
            "ezz_id": ezz_id,
            "box_id": box_id
          }

          console.log(email_subject);
          // console.log(ezz_id);
          // console.log(box_id);
          
          setTimeout(()=>{
            
            // UNCOMMENT START ---- FOR PROD BACKEND TESTING
            Axios({
              method: 'post',
              url: base_url+'whatsapp_templates',
              data: emaildata,
            }).then(
              function (response) {
              // console.log(response)
              console.log("whatsapp sent done");
              M.toast({ html: 'Whatsapp sent', classes: "white-text red rounded" });
            }).catch(
              function (response) {
              // console.log(response)
              console.log("whatsapp sent Failure");
              M.toast({ html: 'Whatsapp sending failed to' + this.state.customer_id, classes: "white-text red rounded" });
            })        
            
            Axios({
              method: 'post',
              url: base_url+'send_email/',
              data: emaildata,
            }).then(
              function (response){
                console.log('email sent')
                M.toast({ html: 'Email Sent to ' + response.data["Email to"], classes: "white-text red rounded" });
              }).catch(
                function (response){
                console.log('email send fail')
                M.toast({ html: 'Email Sending Failed to' + this.state.customer_id, classes: "white-text red rounded" });
            })
            //UNCOMMENT END

            this.refreshpage()

          }, 2000)          




          // const response = await Axios.post(base_url+"send_email/", emaildata,
          //   header)
          // console.log(response)
          // M.toast({ html: 'Email Sent to ' + response.data["Email to"], classes: "white-text red rounded" });

          this.setState({ manifestlist: [], previouSelectedOrder: "" })
          this.setState({ totalweight: 0 })



        // } catch (error) {

          // M.toast({ html: 'Email Sending Failed to' + this.state.customer_id, classes: "white-text red rounded" });
        // }


        M.toast({ html: 'Box created successfully ' + this.state.manifestlist, classes: "white-text orange rounded" })
            // await this.refreshpage();

      } catch (error) {
        console.log(error)
        M.toast({ html: 'Failed to manifest', classes: "white-text red rounded" });
        // this.setState({error:<Error/>})
      }



    }



  }

  handletableClick = (clickedrow) => {
    console.log(clickedrow)
    // M.toast({ html: 'Clicked row ' + clickedrow, classes: "white-text red rounded" });
    let productdetail = this.state.productlist[clickedrow]
    let countryoptions = this.state.product_category_options
    console.log("handle cat", countryoptions)
    console.log("handle cat", this.state.product_edit_category)
    this.setState({ rowNumber: clickedrow })
    this.setState({ selectItemDetails: productdetail })


    // this.refs.editproduct.openModal(clickedrow,productdetail,countryoptions);
  }

  checkUploadedInvoice = async (orderDetails) => {

    var currentOrderId = orderDetails.order_id

    var invoiceFormData = new FormData()
    invoiceFormData.append("order_id", currentOrderId)

    await Axios({
      method: "POST",
      url: base_url+`/download_customer_invoice`,
      data: invoiceFormData,
      responseType: 'blob'
    }).then((response)=>{
      console.log("RESPONSE DONE", response);  
      console.log("RESPONSE DONE", response.data);  
      console.log("RESPONSE DONE", response.headers['content-type']);  
      const file_url = window.URL.createObjectURL(new Blob([response.data], {type:'application/pdf'}));
      console.log("fileURL",file_url);
      // console.log("fileURL",this.state.fileUrl);
      this.setState({fileUrl: file_url})
      

      // document.getElementById('my-frame').src = file_url
      // window.iframe["my-frame"].src = file_url;

      // var elems = document.getElementById("fileView");
      // var instance = M.Modal.init(elems);
      // instance.open()

      this.setState({modalFile: true})
      // setModalFile(!modalFile)
      // Then print:

      // window.frames["my-frame"].print();

      //TO DOWNLOAD
      // const link = document.createElement('a');
      // link.href = file_url;
      // link.setAttribute('download',  `${currentOrderId}`);
      // document.body.appendChild(link);
      // link.click();
      // M.toast({html: `File Downloaded.`,classes: "white-text blue rounded"})
    }).catch((response)=>{
      console.log("RESPONSE NOT DONE", response);        
      M.toast({html: `Error while Downloading.`,classes: "white-text red rounded"})
    })
  }

  toggleFile = () =>{
    this.setState({modalFile: !this.state.modalFile})
    var elem = document.getElementById(`fileView`)
  }
  

  render() {

    var idNo = 0


    
    const orderCardList = this.state.orderslist.map((order) => {
        
      


          this.state.orderweights[order.order_id] = order.weight
      this.state.ordercustomer[order.order_id] = order.ezz_id
      this.state.orderproducts[order.order_id] = order.product_details
      this.state.statusIDtoName[order.current_status] = order.current_status_name
      this.state.OnHoldValue[order.order_id] = order.on_hold
      this.state.remarksOnHoldList[order.order_id] = order.remarks
      this.state.isCardAuth[order.order_id] = order.card_authorize

      idNo = idNo + 1

      return (
        <div>

                {(() => {
                    // Function to set icons with respect to order status
                    // if (order.current_status !== "NEW") {
                    if (order.current_status) {

                      return (


                        <>
                        
                        <Card key={order.id} className="orderItemdetailsCard">
            <Card.Header className="smallheader">
              <Row >
                <Col sm={4} md={4} lg={3}>
                  <Card.Text>{order.order_id}</Card.Text>
                </Col>
                <Col >
                  <Card.Text>{order.ezz_id}</Card.Text>
                </Col>
                <Col  >
                  <Card.Text >
                    {order.country}
                  </Card.Text>
                </Col>
                <Col>
                  <Card.Text>
                    {order.inbound_tracking_number}
                  </Card.Text>
                </Col>
                <Col>
                  <Card.Text>
                    {order.outbound_number}
                  </Card.Text>
                </Col>
              </Row>
              <Row>
                <Col>
                  {(() => {
                    // Function to set icons with respect to order status
                    if (order.current_status === "DISC") {

                      return (<p className="red-text"><Image className="ml-1" src="assets/images/wrong.svg" /> {order.current_status_name}</p>)
                    }
                    else {
                      return (<p className="black-text"><Image className="ml-1" src="assets/images/dot.svg" /> {order.current_status_name}</p>)
                    }




                  })()}
                </Col>
                <Col className=" ">

                &nbsp;&nbsp;
                <Accordion.Toggle className="right inline alignmore_details" as={Nav.Link} variant="link" eventKey={order.id}>
                    More Details<Image className="ml-1 " src="assets/images/plus-circlesmall.svg" />
                  </Accordion.Toggle>

                  {/* @TODO loading for manifest must be implemented */}
                  {
                    (() => {
                      // function to disable Select button if already shipped
                      if (order.current_status === "WFC") {
                        return (
                          <p className="right indigo-text">
                            <label>
                              <input type="checkbox" name={order.ezz_id} value={order.order_id} onChange={this.onChangeSelectMerge} />
                              <span className="indigo-text">Select to Merge</span>
                            </label>
                          </p>


                        )
                      } else if (order.current_status === "RTM") {

                        return (

                          <>
                            {
                              order.on_hold
                                ?
                                <p className="right orange-text">
                                  <label>
                                    <input type="checkbox" id={order.order_id} checked={true} name={order.ezz_id + order.country} value={order.order_id} onChange={this.onChangeOnHoldCheckOne} />
                                    <span className="orange-text">On Hold</span>
                                  </label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                  <label>
                                    <input type="checkbox" id={`onHoldManifest${order.order_id}`} disabled={true} name={order.ezz_id + order.country} value={order.order_id} onChange={this.onChangeSelectManifest} />
                                    <span className="grey-text">Select to Manifest</span>
                                  </label>
                                </p>
                                :
                                  ( (!order.card_authorize || order.card_authorize === "card details missing" ) && order.billing_type === "card")
                                  ?
                                    <p className="right orange-text">
                                      <label>
                                        <input type="checkbox" id={order.order_id} name={order.ezz_id + order.country} value={order.order_id} onChange={this.onChangeOnHoldCheckTwo} />
                                        <span className="orange-text">On Hold</span>
                                      </label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  
                                      <label>
                                          <input type="checkbox" id={`onHoldManifest${order.order_id}`} disabled={true} name={order.ezz_id + order.country} value={order.order_id} onChange={this.onChangeSelectManifest} />
                                          <span className="grey-text">Select to Manifest</span>
                                        </label>
                                    </p>
                                  :
                                    <p className="right orange-text">
                                      <label>
                                        <input type="checkbox" id={order.order_id} name={order.ezz_id + order.country} value={order.order_id} onChange={this.onChangeOnHoldCheckOne} />
                                        <span className="orange-text">On Hold</span>
                                      </label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                                      <label>
                                        <input type="checkbox" id={`onHoldManifest${order.order_id}`} name={order.ezz_id + order.country} value={order.order_id} onChange={this.onChangeSelectManifest} />
                                        <span className="btnCustomColor">Select to Manifest</span>
                                      </label>
                                    </p>                          
                            }
                          </>
                        )
                      }
                      else {
                        return (

                          // <ManifestButton disabled="" name="Manifest" ordernumber={order.ordernumber}></ManifestButton>
                          <>
                            <p className="right red-text">
                              <label>
                                <input type="checkbox" disabled={true} name={order.ezz_id + order.country} value={order.order_id} onChange={this.onChangeSelectManifest} />
                                <span className="grey-text">Select to Manifest</span>
                              </label>
                            </p>
                            {/* <ManifestButton disabled="disabled" name="Manifest" ordernumber={order.ordernumber}></ManifestButton> */}
                          </>
                        )
                      }
                    })()
                  }
                 
                </Col>
              </Row>

            </Card.Header>


            <Card.Body>


      
    
    
    
                  <Accordion.Collapse eventKey={order.id}>
    
                    <Card.Body>
                      <Row>
                        <Col  >
                              <h6>Customer Info</h6>
                              Name: {order.customer_name}<br></br> 
                              Email: {order.customer_email}<br></br>    
                              Mobile No.: {order.customer_phone_number}         <br></br>       
                              Payment Type: {order.billing_type}<br></br>
                              {/* Received Date: {order.received_date}                         */}
                        </Col>
                        <Col>
                              Promo Code: {order.promo_code}<br></br>
                              Original Freight: {order.original_price}<br></br>
                              Actual Freight: {order.actual_charge}<br></br>
                              Order Invoice Total: {order.total_invoice_order} <br></br>
                              Order Date: {order.order_date}<br></br> 
                              {/* Customs Charge: {order.freight_charge}<br></br> */}
                              {/* Custom Charge: {order.custom_charge}<br></br> */}

                        </Col>
                        <Col>
                              Shipper Number: {order.shipper_number}
                              <h6>Box Dimension</h6>
                              Package Weight: {order.weight}<br></br>
                              Length: {order.length} Width: {order.breadth}  <br></br>
                              Height: {order.height}  

                        </Col>
    

    
                        <Col>
                          <Nav className="right">
    
                            <ul>
                              {
                                order.current_status !== "DISC" && order.current_status !== "NEW" && order.current_status !== "SP"
                                ?
                                  <>
                                    <li><Nav.Link className="red-text modal-trigger " onClick={() => this.openeditordermodal(order)}  >
                                      Edit Order<Image className="red-text ml-1" src="assets/images/edit.svg" /></Nav.Link></li>
                                    <li><Nav.Link className="green-text modal-trigger " onClick={() => this.printLabelManually(order)}  >
                                      Print Label <Print /></Nav.Link></li>
                                  </>
                                :
                                  <li><Nav.Link className="red-text modal-trigger " onClick={() => this.openviewordermodal(order)}  >
                                  View Order<Image className="red-text ml-1" src="assets/images/edit.svg" /></Nav.Link></li>
                              }                            
                              {
                                order.current_status !== "IM" && order.customer_invoice_uploaded
                                ?
                                  <li><Nav.Link className="orange-text modal-trigger " onClick={() => this.checkUploadedInvoice(order)} >
                                  View Invoice <Info /></Nav.Link></li>
                                :
                                  ""                                
                              }
                              {/* {
                                order.current_status !== "IM"
                                ?
                                  <li><Nav.Link className="orange-text modal-trigger " >
                                  View Invoice <Info /></Nav.Link></li>
                                :
                                  ""                                
                              } */}
                            </ul>
                          </Nav>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
    
    
                          {
                            (() => {
                              if (order.current_status === "RTM" && order.on_hold ) {
    
                                // console.log("ORDER.REMARKS", order.remarks)
    
                                return (
                                  <>
                                    <h6>Remarks: </h6>
                                    <p>{order.remarks}
                                      <span className="blue-text ml-1" >
                                      <a 
                                      id={order.order_id}  
                                      style = {{ cursor: "pointer" }} 
                                      onClick={() => this.onHoldRemarksEdit(order.order_id)}  >
                                        <Image  title="Update" src="assets/images/edit.svg" /></a></span></p>
    
                                  </>
                                )
                              }
                            })()
                          }
    
                        </Col>
                      </Row>
    
                    </Card.Body>
                  </Accordion.Collapse>
    
                </Card.Body>
    
              </Card>


                </>
              )

            }
          })()}
          
        </div>
      );
      
    });

    return (
      <Container>


        {
          this.state.showSpinner
            ? < div className="center">

              <Spinner animation="grow" variant="primary" size="sm" />
              <Spinner animation="grow" variant="success" size="sm" />
              <Spinner animation="grow" variant="warning" size="sm" />
            </div>
            : null
        }

        <>
          <div id="parentOrderModel" className="modal parentOrderModel  modal-fixed-footer">
            <div className="modal-content ">
              <div className="">


                <h4 className="center orange-text"> Parent Order </h4>



                <form >


                  <div className="row ">
                    <div className="col  s6 l6">
                      {/* Order Status Radio Buttons */}
                      <h5>Select Parent Order</h5>
                      {(() => {


                        return this.state.mergelist.map((ordernumber, index) => {

                          return (
                            <p key={index}>
                              <label>
                                <input name="parentOrderSelected" value={ordernumber} type="radio"
                                  checked={this.state.parentOrderSelected === ordernumber} onChange={this.handleParentOrderChange} />
                                <span><b>Order Number.</b> {ordernumber}</span>
                              </label>
                            </p>


                          )

                        })



                      })()}
                      {/* { this.state.parentboxSelected} */}

                    </div>
                  </div>


                </form>
              </div>
              {this.state.parentOrderSelected}
            </div>
            <div className="modal-footer">

              <ButtonGroup className="mr-2" aria-label="First group">
                <Button id="closeEditBoxBtn" variant="outline-secondary" className="mr-4 btn modal-close "  >Close</Button>
                <Button id="mergeOrderBtn" variant="outline-primary" className="mr-2 btn modal-close"
                  onClick={this.mergeOrders} > Proceed</Button>
              </ButtonGroup>
            </div>
          </div>


          {/* ON HOLD MODAL */}

                     {/* ADD NEW REMARKS  */}
          <div id="remarksForOnHold" className="modal remarksForOnHold  modal-fixed-footer">
            <div className="modal-content ">
              <div className="">


                <h4 className="center orange-text"> Remarks </h4>

                <form  >
                  <div className="row ">
                    <div className="col  s6 l6">
                      <h5>Please give reason for On Hold <p style = {{ fontSize : "11px" }} > Order Id: {this.state.tempOrderId }</p></h5>

                      {(() => {
                          return (
                            <>

                              <label htmlFor="remarksText">
                                Remarks:
                              </label>
                              <textarea
                                id="remarksText"
                                className=""
                                name=""
                                value={this.state.value}
                                onChange={this.handleChangeRemarksText}
                                placeholder={this.props.placeholder} />

                            </>                          
                          )
                      })()}

                    </div>
                  </div>


                </form>
              </div>
            </div>
            <div className="modal-footer">

              <ButtonGroup className="mr-2" aria-label="First group">
                <Button id="closeRemarksModalBtn" variant="outline-secondary" className="mr-4 btn modal-close "  >Cancel</Button>
                <Button id="saveRemarksModalBtn" variant="outline-primary" type="submit" className="mr-2 btn modal-close" onClick={this.onHoldRemarks} >Save</Button>
              </ButtonGroup>
            </div>
          </div>

                      {/* UPDATE REMARKS */}

          <div id="updateRemarksOnHold" className="modal updateRemarksOnHold  modal-fixed-footer">
            <div className="modal-content ">
              <div className="">


                <h4 className="center orange-text"> Remarks </h4>

                <form  >
                  <div className="row ">
                    <div className="col  s6 l6">
                      <h5>Please give reason for On Hold  <p style = {{ fontSize : "11px" }}  >Order Id: {this.state.tempOrderId2 }</p></h5>

                      {(() => {
                          return (
                            <>

                              <label htmlFor="remarksTextEdit">
                                Remarks:
                              </label>
                              <textarea
                                id="remarksTextEdit"
                                className=""
                                name=""
                                value={this.state.value}
                                onChange={this.handleChangeRemarksTextEdit}
                                placeholder={this.props.placeholder} />

                            </>                          
                          )
                      })()}

                    </div>
                  </div>


                </form>
              </div>
            </div>
            <div className="modal-footer">

              <ButtonGroup className="mr-2" aria-label="First group">
                <Button id="closeRemarksModalBtn" variant="outline-secondary" className="mr-4 btn modal-close "  >Cancel</Button>
                <Button id="saveRemarksModalBtn" variant="outline-primary" type="submit" className="mr-2 btn modal-close" 
                onClick= { () => this.updateOnHoldRemarks(document.getElementById('remarksTextEdit').name)} >Update</Button>
              </ButtonGroup>
            </div>
          </div>
          

          {/* ON HOLD MODAL */}


        </>


        <div className="row">
          <div className="col s3">
            <h4 className=" orange-text">Order Listing </h4>
          </div>

          <div className="col s4">

          </div>

          {/* <div className="col s7 l7 offset-4 offset-l4">                       */}
          <div className="col s7 l7 ">                      
            {/* hide Manifest button because we not using selection things RN */}

            <ButtonGroup>
              <Button variant="outline-secondary " className="grey white-text mr-2" onClick={this.refreshpage}>Refresh </Button>
              <Button variant="outline-primary " className="indigo white-text mr-2" onClick={this.selectParentOrder}>Merge </Button>
              {this.state.ManifestDisable ? <Button disabled variant="outline-primary " className="orange white-text " onClick={this.manifestOrders}>Manifest</Button> : <Button variant="outline-primary " className="orange white-text " onClick={this.manifestOrders}>Manifest</Button>}
            </ButtonGroup>

          </div>
        </div>

        <Row>
          <Col>
            <div>
                {
                  this.state.previousPageUrl
                    ? <Button variant="outline-secondary " title="Previous Page" className="teal white-text mr-2" onClick={() => this.updateOrderList(this.state.previousPageUrl,'-')} ><NavigateBefore /></Button>
                    : <Button variant="outline-secondary " title="Previous Page" className="teal white-text mr-2" disabled><NavigateBefore /></Button>
                }
                {
                  this.state.nextPageUrl
                    ? <Button variant="outline-secondary " title="Next Page" className="teal white-text mr-2" onClick={() => this.updateOrderList(this.state.nextPageUrl,'+')}><NavigateNext /></Button>
                    : <Button variant="outline-secondary " title="Next Page" className="teal white-text mr-2" disabled><NavigateNext /></Button>
                }          
            </div><br/>
            <div>              
                {
                  this.state.currentPageNumber  != ''
                  ?<h5>Page: {this.state.currentPageNumber}</h5>
                  :""
                }              
            </div>
          </Col>
          <Col>
            <div>
              <InputGroup className="mb-3" style={{ float: 'right', width: '270px' }}>
                <InputGroup.Prepend >
                  <InputGroup.Text style={{ border: '1px solid grey', background: 'white' }} id="inputGroup-sizing-default"><Search /></InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  style={{ border: '1px solid gray', borderRadius: '2px', paddingLeft: '10px' }}
                  aria-label="Default"
                  aria-describedby="inputGroup-sizing-default"
                  placeholder="  Search here....."
                  onChange={this.editSearchTerm.bind(this)}
                  onKeyDown={this.handleKeyDownSearch}
                // onKeyUp={this.onKeyDown}
                />
              </InputGroup>
            </div><br/>
            <div style={{ float: 'right', width: '270px' }}>
              {
                this.state.searchResultsCount > -1
                ? <h5>Showing 
                    <span style={{ color: 'orange' }} > {this.state.currentOrderListCount} </span> of
                    <span style={{ color: 'orange' }} > {this.state.searchResultsCount} </span> results
                  </h5>
                : <h5>Showing
                    <span style={{ color: 'orange' }} > {this.state.currentOrderListCount} </span> of
                    <span style={{ color: 'orange' }} > {this.state.totalOrderListCount} </span> orders
                  </h5>                
              }
            </div>

          </Col>
        </Row>

        <Row>
          <Col xs={6} md lg={6}>
            

          </Col>
          <Col xs={6} md lg={6}>

          </Col>
        </Row>
        {/* {console.log("orderlist productlist", this.state.productlist)} */}
        <EditOrder orderdata={this.state.orderforedit} customerinfo={this.state.customerinfo}
          productlist={this.state.productlist} productlisthtml={this.state.productlisthtml}
          ref="editorder" refresh={this.props.refresh} refreshpage={this.refreshpage} productCategory={this.state.product_category_options} />

        <ViewOrder orderdata={this.state.orderforedit} customerinfo={this.state.customerinfo}
          productlist={this.state.productlist} productlisthtml={this.state.productlisthtml}
          ref="vieworder" refresh={this.props.refresh} refreshpage={this.refreshpage} productCategory={this.state.product_category_options} />

        <Row>
          <Col xs={12} sm={12} lg={12}>
            <div >

              <div id="orderlistdiv" >
                <Row id=" orderlistrow">
                  <Col>
                    <p> <Image className="mr-1" src="assets/images/down.svg" />Order Number</p>
                  </Col>
                  <Col>
                    <p className="center"> <Image className="mr-1" src="assets/images/down.svg" />Customer Id</p>
                  </Col>
                  <Col>
                    <p> <Image className="mr-1" src="assets/images/down.svg" />Country</p>
                  </Col>
                  <Col >
                    <p className="left"> <Image className="mr-1" src="assets/images/down.svg" />Inbound No.</p>
                  </Col>
                  <Col >
                    <p> <Image className="mr-1" src="assets/images/down.svg" />Outbound No.</p>
                  </Col>

                </Row>
                <div className="divider"></div>
              </div>
              <div className="orderlistwrapperdiv">

                <Accordion>
                  <form>
                    {orderCardList}
                  </form>

                </Accordion>
              </div>


            </div>
          </Col>


        </Row>

        <Modal id="fileView" className = "fileView" size="lg" isOpen={this.state.modalFile} >
        <ModalBody>

          <iframe name="my-frame" id="my-frame" title="my-frame" src={this.state.fileUrl} style={{ width: '100%', height: '100vh' }} ></iframe>

        </ModalBody>
        <ModalFooter>
          <Button onClick={()=>this.setState({modalFile: false}) } variant="outline-primary" className='mr-2'>Close</Button>{''}
          <Button onClick={()=>{window.frames["my-frame"].print()}} variant="primary">Print</Button>
        </ModalFooter>
      </Modal>         

      </Container>

    )
  }
}

export default OrderList;
