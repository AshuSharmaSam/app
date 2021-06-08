import React from 'react'
import { base_url } from '../../globalConstants'
import { useState, useEffect, useContext } from 'react'
import { Row, Col, InputGroup, FormControl, Spinner, Form, ListGroup, ListGroupItem, Pagination} from "react-bootstrap";
import { ButtonGroup, Button, ModalHeader, ModalBody, ModalFooter, Modal  } from 'reactstrap';
import M from "materialize-css";
import {GetApp, Info, Search, NavigateBefore, NavigateNext, Close, Print } from "@material-ui/icons";
import "./temp.css";
import Axios from "axios"
import 'bootstrap/dist/css/bootstrap.min.css';
import Viewer  from '@phuocng/react-pdf-viewer';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';



export default function CustomSettlement() {

  const [shippedData, setShippedData] = useState([]);
  const [shippedResponse, setShippedResponse] = useState([]);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  // const [ProductDetails, setProductDetails] = useState([]);
  const [openFile, setOpenFile] = useState(false);
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [modalFile, setModalFile] = useState(false);
  const [boxId, setBoxId] = useState('');
  // const [OrderNo, setOrderNo] = useState('');
  const [OrderDetails, setOrderDetails] = useState([]);
  const [Category, setCategory] = useState('');
  const [categoryCustom, setCategoryCustom] = useState({});
  const [categoryVat, setCategoryVat] = useState({})
  const [showSpinner, setShowSpinner] = useState(false);
  const [buttonProgress, setbuttonProgress] = useState(false);
  const [customButtonProgress, setCustomButtonProgress] = useState(false);
  // const [ProgressDone, setProgressDone] = useState();
  const [captureAmountValue, setCaptureAmountValue] = useState('')
  const [url, setUrl] = useState(base_url+`custom_settlement_details/?custom_charge_transaction_id=null&shipped=`)
  const [prevPageUrl, setPrevPageUrl] = useState('')
  const [nextPageUrl, setNextPageUrl] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [searchResultsCount, setSearchResultsCount] = useState(-1)
  const [currentDisplayCount, setCurrentDisplayCount] = useState(-1)
  const [currentPageNumber, setCurrentPageNumber] = useState(1)
  const [totalDisplayCount, setTotalDisplayCount] = useState(-1)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [open2, setOpen2] = React.useState(false);
  const [rowBackgroundColor, setRowBackgroundColor] = useState('')

  const [capture, setCapture] = useState(false);
  const [isEditCustom, setisEditCustom] = useState(false);
  const [isEditVat, setisEditVat]= useState(false);
  const [amount, setamount]= useState();
  const [CustomValue, setCustomValue] = useState(0);
  const [VatValue, setVatValue] = useState(0);
  
  const [printLabelProcess, setPrintLabelProcess] = useState(false)
 
  const printLabel = async (box_id) => {

    setBoxId(box_id)
    setPrintLabelProcess(true)
    console.log('boxid',box_id);
    let url = `${base_url}print_fedex_label`

    await Axios({
      url: url,
      method: 'POST',
      data:{
        "box_id": box_id,
      }
    }).then((response)=>{
      setPrintLabelProcess(false)
      console.log('print success',response);
      M.toast({html: `Print Label Success.`,classes: "white-text green rounded"})
    }).catch((err)=>{
      setPrintLabelProcess(false)
      console.log('print fail',err);
      M.toast({html: `Print Label Fail.`,classes: "white-text orange rounded"})
    })

  }
  
  const toggle = () => {
    setModal(!modal);
    setOpen(!open)
    var elem = document.getElementById(`captureAmount${boxId}`)
    // console.log("ELEM", `captureAmount${boxId}`)
    // elem.checked = false
  }

  const toggleFile = () => {
    setModal(!modalFile);
    setOpen(!openFile)
    var elem = document.getElementById(`fileView`)
    // console.log("ELEM", `captureAmount${boxId}`)
    // elem.checked = false
  }
  const toggle1 = () => {

    
    setModal1(!modal1);
    setOpen1(!open1)

    var elem = document.getElementById(`captureModal`)
  }

  

  //Handle page navigation
  const handlePageNavigation = async (updatedUrl, pg) =>{

    var tempPageNumber = currentPageNumber
    setShowSpinner(true)
    let updated_url = updatedUrl
    // console.log('updatedUrl', updated_url);
    await Axios({
      method: 'GET',
      url: updatedUrl
    }).then( (response) => {
      // console.log('RESPONSE', response);
      setShowSpinner(false)
      setShippedResponse(response.data);
      setShippedData(response.data.results);
      setCurrentDisplayCount(response.data.results.length)
      setTotalDisplayCount(response.data.count)   
      setPrevPageUrl(response.data.previous)
      setNextPageUrl(response.data.next) 
      // setCurrentPageNumber(updatedUrl.toString().split('=')[2].split('&')[0]?updatedUrl.toString().split('=')[2].split('&')[0]:1)

      if(pg === '+')
        tempPageNumber = tempPageNumber + 1
      else if(pg === '-')
        tempPageNumber = tempPageNumber - 1
      else
        tempPageNumber = ''

      setCurrentPageNumber(tempPageNumber)  

    }).catch((response)=>{
      console.log('CATCH RESPONSE',response);
    })

  }   
  //Handle page navigation end

  //SEARCH START

  const handleKeyDownSearch = async (eventKey) => {

    // console.log('searchKeyword',searchKeyword);

    var filterString = searchKeyword

    if (eventKey.key === "Backspace") {
      let searchUrl = base_url+`custom_settlement_details/?custom_charge_transaction_id=null&shipped=`      
      setUrl(searchUrl)
      console.log(searchUrl);

      await Axios({
        method: 'GET',
        url: searchUrl
      }).then(async (response) => {
        console.log(response.data);
        // console.log(response.data.results);
        // console.log(response.data.count);
        // console.log(response.data.next);
        // console.log(response.data.previous);

        // if(response.data.count === 0){
        //   this.setState({orderslist: []})      
        //   return
        // }

        setShippedResponse(response.data)
        setShippedData(response.data.results)
        setSearchResultsCount(response.data.count)
        setCurrentDisplayCount(response.data.results.length)
        setPrevPageUrl(response.data.previous)
        setNextPageUrl(response.data.next) 
        setCurrentPageNumber(1)

        // console.log('SHIPPED DATA LENGTH', shippedData.length);

        // console.log('orderlist.length', this.state.orderslist.length);
        // this.setState({currentOrderListCount: orderCount})

      }).catch(async (response) => {
        console.log(response.status)

      })
    }

    if (eventKey.key === "Enter") {
      if (filterString.trim() === "") {
        return
      }

      let searchUrl = base_url+`custom_settlement_details/?search=${filterString}`      
      setUrl(searchUrl)
      console.log(searchUrl);

      await Axios({
        method: 'GET',
        url: searchUrl
      }).then(async (response) => {
        // console.log(response);
        // console.log(response.data.results);
        console.log(response.data.count);
        // console.log(response.data.next);
        // console.log(response.data.previous);

        // if(response.data.count === 0){
        //   this.setState({orderslist: []})      
        //   return
        // }

        setShippedResponse(response.data)
        setShippedData(response.data.results)
        setSearchResultsCount(response.data.count)
        setCurrentDisplayCount(response.data.results.length)
        setPrevPageUrl(response.data.previous)
        setNextPageUrl(response.data.next) 
        setCurrentPageNumber(1)

        // console.log('SHIPPED DATA LENGTH', shippedData.length);

        // console.log('orderlist.length', this.state.orderslist.length);
        // this.setState({currentOrderListCount: orderCount})

      }).catch(async (response) => {
        console.log(response.status)

      })

    }  

  }

  const editSearchTerm = async e =>{
    // console.log('SEARCH KEY', e.target.value);

    let word = e.target.value
    let bucket = word.split(' ')
    
    // console.log(bucket)
    
    let searchString = bucket.reduce((prevVal, currVal)=>{ return prevVal+=currVal+' ' }, '')

    // console.log('searchString',searchString);
    
    setSearchKeyword(searchString)
  

  }

  // const onKeyDown = (e) => {
  //   if (e.keyCode === 8) {
  //     setShippedData(shippedData)
  //   }
  // }

  //SEARCH END

  const viewShippedDetails = (tempBoxId) => {
    setBoxId(tempBoxId)
    toggle()
  }

  const viewOrderDetails = async () => {
    // setOrderNo()
    await Axios.get(base_url + `boxes_received/`).then(res=> { console.log(res);
    console.log(res.data);
    setOrderDetails(res.data)
    // console.log(res.data.product_details)
    
    // setProductDetails(res.data.product_details)
    viewCategory();

  }).catch(error=>{console.log('error')})
    
    // viewCategory()
    // toggle1()
  }
  const viewCategory = async () => {
    // setCategory(tempCategory)
    let cat_customs = {}
    let cat_vat = {}
    await Axios.get(base_url + `categories/`).then(res=>{ console.log(res);
      console.log(res.data);
      setCategory(res.data)
      // setCategoryDetails()
      for (var key in res.data) {
       cat_customs[res.data[key].category_id]=[res.data[key].custom_duty]
       cat_vat[res.data[key].category_id]=[res.data[key].vat]
      }
      setCategoryCustom(cat_customs)
      setCategoryVat(cat_vat)

      
      // console.log(cat_vat)
      toggle1();
      
    }).catch(error=> {
      console.log('error')
    })
  }

  const handleCustomChange = (e)=>{
    const {name, value}=e.target
    console.log(name, value)
    console.log(CustomValue)
    // setCustomValue([name]value)
    setCustomValue((preValue)=>{
    return(
      
      {...preValue,[name]:value})
      })
  }
  
  const handleVatChange = (e) => {

    const {name, value}=e.target
    console.log(name, value)
    console.log(CustomValue)
    // setCustomValue([name]value)
    setVatValue((preValue)=>{
    return(
      
      {...preValue,[name]:value})
      })
  }
  
  const handleUpdateCustomCharge =async(key)=>{
    // console.log(VatValue[`vat${key}`])
    // console.log(CustomValue[`customs${key}`])

    var product_id = key.id
    var newCustom = parseFloat(CustomValue[`customs${product_id}`])
    var newVat = parseFloat(VatValue[`vat${product_id}`])
    var newCustomCharge 
    setbuttonProgress(true)
    const customformdata = new FormData() 
    if (isNaN(newCustom) && isNaN(newVat)) {
      setbuttonProgress(false)
      return
    }
    if (isNaN(newCustom))
      {
      newCustom= key.custom
      customformdata.append('custom',newCustom)  
      customformdata.append('vat',newVat)  
      console.log('newCustom', newCustom)
      } 

    if (isNaN(newVat))
      {
      newVat = key.vat
      customformdata.append('custom',newCustom)  
      customformdata.append('vat',newVat)  
      console.log('newVat', newVat)
      }
    if (!isNaN(newCustom) && !isNaN(newVat)) {
      if (newVat===key.vat && newCustom===key.custom) {
         setbuttonProgress(false)
         return
      }
      else { 
        customformdata.append('custom',newCustom)  
        customformdata.append('vat',newVat)
      }
    }

    console.log('newCustom', newCustom)
    console.log('newVat', newVat)

  // console.log('newVat', newVat)
  // console.log('SUMCUSTOM', newCustom + newVat)
  // newCustomCharge = newCustom + newVat
  

      // customformdata.append('custom',newCustom)  
      // customformdata.append('vat',newVat)  

    await Axios({
      method:'patch',
      url:base_url+`products/${product_id}/`,
      data:customformdata
    }).then(res=>

      {
        console.log(res)
        fetchDetails()
        setbuttonProgress(false)
        
      }).catch(error=>{ 
        setbuttonProgress(false)                                            
      console.log('error')                                                                 
    })                                                                             


    // await Axios({​​​​​​​​
    // method:'PATCH',
    // url:base_url + `products/${key}`,
    // data:customformdata
    // }​​​​​​​​)
    // .then(res=>{console.log(res);
    // }).catch(error=> {
    //   console.log('error')
    // })
  }
  
  const downLoadFedexConsolodated = async (tempFedexInvoice) => {
    // console.log("FEDEX INVOICE", tempFedexInvoice);

    var fedexConsolidatedFormData = new FormData()
    fedexConsolidatedFormData.append("invoice", tempFedexInvoice)

    await Axios({
      method: "POST",
      url: base_url+`/download_invoice`,
      data: fedexConsolidatedFormData,
      responseType: 'blob'
    }).then(function(response){
      // console.log("RESPONSE DONE", response);  
      // console.log("RESPONSE DONE", response.data);  
      // console.log("RESPONSE DONE", response.headers['content-type']);  
      const file_url = window.URL.createObjectURL(new Blob([response.data], {type:'application/pdf'}));
      // console.log("fileURL",file_url);
      setFileUrl(file_url)
      // document.getElementById('my-frame').src = fileUrl
      // window.iframe["my-frame"].src = fileUrl;
      setModalFile(!modalFile)
      // Then print:

      // window.frames["my-frame"].print();
      // const link = document.createElement('a');
      // link.href = fileUrl;
      // link.setAttribute('download',  `${tempFedexInvoice}.pdf`);
      // document.body.appendChild(link);
      // link.click();
      M.toast({html: `File Downloaded.`,classes: "white-text blue rounded"})
    }).catch(function(response){
      console.log("RESPONSE NOT DONE", response);        
      M.toast({html: `Error while Downloading.`,classes: "white-text red rounded"})
    })
  }

  const printInvoice = () => {
    window.frames["my-frame"].print()
  }  
  //<<NOT IN USE
  const calculateTime = (tempTime) => {
    var calculatedTime
    // calculatedTime = ` ${days} d, ${hours}, h, ${mins} m`
    // console.log(temp_time)
    // console.log(calculatedTime)
    // return temp_time
  }
  //NOT IN USE>>

  const timeLeft = (shipped_data) => {
    var tempTime = {}
    var timeLeft
    
    // console.log(shipped_data)
    // shipped_data.filter(key => !key.custom_charge_transaction_id && key.box_details )
    shipped_data.filter(key => key.box_details )
                // .filter(filterkey1 => filterkey1.box_details.box_status === "Shipped"  )
                .map( filterkey => {
                  if (filterkey.onhold_transactions) {
                    tempTime[filterkey.box_id] = filterkey.onhold_transactions.time_left
                    timeLeft = filterkey.onhold_transactions.time_left * 86400
                    if (timeLeft <= 2.592e+6 || timeLeft > 1.728e+6)
                      // console.log(`rowBoxId${key.box_id}`)
                      document.getElementById(`rowBoxId${filterkey.box_id}`).style.backgroundColor = "#ffa500e0"
                    if (timeLeft == 1.728e+6 || timeLeft > 864000)
                      // console.log(`rowBoxId${key.box_id}`)
                      document.getElementById(`rowBoxId${filterkey.box_id}`).style.backgroundColor = "#ffff00cc"
                    if (timeLeft <= 864000)
                      // console.log(`rowBoxId${key.box_id}`)
                      document.getElementById(`rowBoxId${filterkey.box_id}`).style.backgroundColor = "#9acd32d1"
                  }
                  else {
                    tempTime[filterkey.box_id] = "grey"
                    document.getElementById(`rowBoxId${filterkey.box_id}`).style.backgroundColor = "#0000000d"
                  }
                })
    setShowSpinner(false)
    // console.log(tempTime)
  }

  const boxDetails = (event) => {
    var checkFreightNull = shippedData[event.target.value].custom_charge_transaction_id
    setBoxId(event.target.name);
    console.log("Selected Box ID: ", boxId);   
    console.log("KEYKEY: ", event.target.value);   
    console.log("Value at index: ", checkFreightNull ); 
    console.log("Capture: ", capture) 
    if(checkFreightNull) {
      setCapture(true)
    }else{
      setCapture(false)
    }
    console.log("Capture: ", capture) 
    toggle()
  }

  const captureValue = (event) => {
    var tempAmount = event.target.value
    setCaptureAmountValue(tempAmount)
    console.log(captureAmountValue)
  }
  
  const captureAmount = async (captureAmountValue) => {
    // alert("done")
    setCustomButtonProgress(true)

    // var tempBoxId = boxId
    console.log("BOX ID",boxId);
    // console.log("BOX ID from variable",tempBoxId);
    let capture_amount = captureAmountValue
    console.log(capture_amount);

    let token = localStorage.getItem("token")
    let header = {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Token ' + token,

    }
    var config = {
      headers: { 'Content-Type': 'multipart/form-data', 'Authorization': 'Token ' + token },

    };

    try {

      var captureAmountData = new FormData()
      captureAmountData.append("box_id", boxId)
      captureAmountData.append("amount", capture_amount)

      let captureAmounturl = base_url+`capture_amount`

      const captureAmount_response = await Axios.post(captureAmounturl, captureAmountData, config)
      // console.log(captureAmount_response.data)
      M.toast({
        html: 'Captured amount $' + capture_amount + ' for BoxID: ' + boxId , classes: "white-text green rounded",
        outDuration: 2000
      })

      // console.log( 'captureAmount_response', captureAmount_response.data) 
      // console.log( 'typeof(captureAmount_response.excessive)', typeof(captureAmount_response.data.excessive) )

      if(captureAmount_response.data.excessive){
        M.toast({
          html: 'Excess amount: ' + captureAmount_response.data.excessive + ' for BoxID: ' + boxId , classes: "white-text green rounded",
          outDuration: 2000
        })
      }
      setCustomButtonProgress(false)
      toggle()
      
    } catch (error) {
      console.log(error)
      console.log(error.response)
      console.log(error.response.data)
      var tempErrorCode = error.response.status
      if( tempErrorCode === 403 || tempErrorCode === 404 || tempErrorCode === 408 ){
        M.toast({ html: error.response.data.Error, classes: "white-text red rounded" });
      }else if( tempErrorCode === 410  ){
        M.toast({ html: error.response.data.Message, classes: "white-text red rounded" });
        M.toast({ html: error.response.data.Description, classes: "white-text red rounded" });
      }else {
        M.toast({ html: 'Failed to Capture Amount', classes: "white-text orange rounded" });
        console.log(error.response.data.statusText)        
        M.toast({ html: error.response.data.statusText, classes: "white-text red rounded" });
      }
      setCustomButtonProgress(false)
    }

  } 

  const fetchDetails = async () => {
    setShowSpinner(true)
    const response = await Axios.get(url)
    const { data } = response;
    console.log(data);
    // console.log(data.results);
    setShowSpinner(false)
    setShippedResponse(data);
    setShippedData(data.results);
    setCurrentDisplayCount(data.results.length)
    setTotalDisplayCount(data.count)   
    setPrevPageUrl(data.previous)
    setNextPageUrl(data.next) 
    // timeLeft(data.results)


    for(var key in data.results){
      if(data.results[key].onhold_transactions){
        setRowBackgroundColor()
        // console.log('TIME LEFT', data.results[key].onhold_transactions.time_left);
      }  
    }
  }

  useEffect(() => {
    fetchDetails();
    // viewOrderDetails();
    // viewCategory();
  }, [])
  useEffect(()=>{
    fetchDetails();
    // viewCategory();
  }, [CustomValue, VatValue])
  M.AutoInit();

  return (
    <div style={{ marginLeft: "10px", marginRight: "10px" }}>
      {
        showSpinner
          ?
          < div className="center">

            <Spinner animation="grow" variant="primary" size="sm" />
            <Spinner animation="grow" variant="success" size="sm" />
            <Spinner animation="grow" variant="warning" size="sm" />
          </div>
          :
          null
      }
      <Row >
        <Col>
          <h3 className="orange-text">Custom Settlement</h3>
        </Col>

        <Col lg={3}>


          
          {/* <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroup-sizing-lg"><Search /></InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" />
          </InputGroup> */}
        </Col>
      </Row>
      <Row>
        <Col>
          <div>
            {
              shippedResponse.previous
              ?<Button style={{ backgroundColor: "orange" }} onClick={()=>handlePageNavigation(prevPageUrl, '-')}><NavigateBefore/></Button>
              :<Button disabled><NavigateBefore/></Button>
            }{' '}
            {
              shippedResponse.next
              // ?<Button style={{ backgroundColor: "orange" }} onClick={()=>console.log('shippedResponse.next',nextPageUrl)}><NavigateNext/></Button> 
              ?<Button style={{ backgroundColor: "orange" }} onClick={()=>handlePageNavigation(nextPageUrl, '+')}><NavigateNext/></Button> 
              :<Button disabled><NavigateNext/></Button>
            } 
          </div><br/>
          <div>
            <h5>Page: {currentPageNumber}</h5>
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
                  onChange={editSearchTerm}
                  onKeyUp={handleKeyDownSearch}
                />
              </InputGroup>
            </div>
            <div style={{ float: 'right', width: '270px' }}>
              {
                searchResultsCount > -1
                  ?
                  <h5>Showing
                    <span style={{ color: 'orange' }} > {currentDisplayCount} </span> of
                    <span style={{ color: 'orange' }} > {searchResultsCount} </span> results
                  </h5>
                  : <h5>Showing
                      <span style={{ color: 'orange' }} > {currentDisplayCount} </span> of
                      <span style={{ color: 'orange' }} > {totalDisplayCount} </span> results
                    </h5>
              }
            </div>
        </Col>
      </Row>
      <Row>
        <Col >
          <Table striped bordered hover size="lg" >
            <thead>
              <tr style = {{ backgroundColor: "dimgray", color: "white" }}>
                {/* <th>S.No.</th> */}
                <th>Box Id</th>
                <th>Box<br/>Weight</th>
                <th>Customer Id</th>
                <th>Customer Name</th>
                <th>Order Id</th>
                <th>Country</th>
                <th>Shipped on</th>
                <th>Outbound No.</th>
                <th>Hold<br/>Expiry</th>
                <th>Status</th>
                <th>Capture</th>
              </tr>
            </thead>
            <tbody>
              {
                // shippedData.filter(key => (!key.custom_charge_transaction_id && key.box_details ))
                shippedData.filter(key => key.box_details )
                          //  .filter(filterkey1 => filterkey1.box_details.box_status === "Shipped"  ) 
                           .map((filterkey,index) => (
                             <tr key={filterkey.id} id={`rowBoxId${filterkey.box_id}`} 
                                style = {{ 
                                          backgroundColor: 
                                            filterkey.onhold_transactions
                                            ?(((30 - parseInt(Math.round(filterkey.onhold_transactions.time_left))) > 10 )
                                                &&
                                              ((30 - parseInt(Math.round(filterkey.onhold_transactions.time_left))) < 21 ))
                                              ?'#ffff00cc'
                                              :(((30 - parseInt(Math.round(filterkey.onhold_transactions.time_left))) > 21)
                                                &&
                                              ((30 - parseInt(Math.round(filterkey.onhold_transactions.time_left))) <= 30))
                                                ?'#9acd32d1'
                                                : 30 - parseInt(Math.round(filterkey.onhold_transactions.time_left)) < 0
                                                  ?'orangered'
                                                  :'#ffa500e0'                                                                                                                                           
                                            :'#0000000d'                                                                                                                           
                                        }} >
                               {/* <th scope="row" >{index + 1}</th> */}
                               <td>{filterkey.box_id}</td>
                               <td>
                                  {
                                    filterkey.box_details
                                      ? filterkey.box_details.box_weight
                                      : "-"
                                  }
                               </td>
                               <td>
                                 {
                                   filterkey.customer_details !== null
                                     ? filterkey.customer_details.ezz_id
                                     : ""
                                 }
                               </td>
                               <td>
                                 {
                                   filterkey.customer_details !== null
                                     ? filterkey.customer_details.customer_name
                                     : ""
                                 }
                               </td>
                               <td>
                                 {
                                   filterkey.orders.length > 0
                                     ? filterkey.orders[0].order_id
                                     : ""
                                 }
                               </td>
                               {/* <td></td> */}
                               <td>
                                 {
                                   filterkey.customer_details !== null
                                     ? filterkey.customer_details.country
                                     : ""
                                 }
                               </td>
                               <td>{filterkey.date_created.split('T')[0]} <br /> {filterkey.date_created.split('T')[1].split('.')[0]}</td>
                               <td>
                                 {
                                   filterkey.box_details
                                     ? filterkey.box_details.outbound_tracking_number
                                     : "-"
                                 }
                               </td>
                               <td>
                                 {
                                   filterkey.onhold_transactions
                                     ?
                                      <>
                                        {
                                          30 - parseInt(Math.round(filterkey.onhold_transactions.time_left)) >= 0
                                          ? <span>{30 - parseInt(Math.round(filterkey.onhold_transactions.time_left))} Days</span> 
                                          : 'Expired'
                                        }  
                                      </>
                                     //  calculateTime( filterkey.onhold_transactions.time_left ) 
                                     :
                                     "n/a"
                                 }
                               </td>
                               <td>
                                 { filterkey.box_details.box_status }
                               </td>
                               <td>
                                 <span title="Capture Amount">
                                  <Info
                                    style={{ cursor: "pointer" }}
                                    onClick={() => viewShippedDetails(filterkey.box_id)} 
                                  />
                                 </span>
                                  {' '}
                                  {/* <span title="Download Invoice">
                                    {
                                      filterkey.fedex_invoice_number !== "0" 
                                        ? <GetApp
                                          style={{ cursor: "pointer" }}
                                          onClick={() => downLoadFedexConsolodated(filterkey.fedex_invoice_number)}
                                          />
                                        :""
                                    }
                                  </span>                                 */}
                                  <span title="Print Label">
                                    {
                                      printLabelProcess && boxId === filterkey.box_id
                                      ?
                                        <Button disabled id={filterkey.box_id}><Spinner 
                                            as="span"
                                            animation = "border"
                                            size = "sm"
                                            role = "status"
                                            aria-hidden="true"
                                            variant = "primary"
                                        /></Button>
                                      :
                                       <Print
                                         style={{ cursor: "pointer" }}
                                         onClick={() => printLabel(filterkey.box_id)}
                                      />
                                    }
                                  </span>                                  
                                  <span title="Download Invoice">
                                   <div className="App">
                                    
                                   </div>
                                    {
                                      filterkey.fedex_invoice_number !== "0" 
                                        ? 
                                          <>
                                            {/* <GetApp
                                              style={{ cursor: "pointer" }}
                                              onClick={() => downLoadFedexConsolodated(filterkey.fedex_invoice_number)}
                                            /> */}
                                            <GetApp
                                              style={{ cursor: "pointer" }}
                                              onClick={() => downLoadFedexConsolodated(filterkey.fedex_invoice_number)}
                                            />
                                            {/* <Worker workerUrl="/pdf.worker.bundle.worker.js"> */}
                                              {/* <div id="pdfviewer">
                                                <Viewer fileUrl="https://cors-anywhere.herokuapp.com/http://www.africau.edu/images/default/sample.pdf" />
                                              </div> */}
                                            {/* </Worker> */}
                                          </>
                                        :""                                          
                                    }
                                  </span>                                
                                  {' '}
                               </td>
                               {/* <td><label>
                      <input 
                      type="checkbox" 
                      id={ `captureAmount${filterkey.box_id}` } 
                      name={filterkey.box_id} value={index} 
                      onChange={boxDetails} />
                      <span className="orange-text"></span>
                    </label></td> */} 
                             </tr>
                ))
              }

            </tbody>
          </Table>

          <Modal id="captureAmountModal" className = "captureAmountModal" size="lg" isOpen={modal} toggle={toggle} >
            <span style={{textAlign: 'right'}}><Close onClick={()=>setModal(false)} style={{cursor: 'pointer'}}  /></span>            
            <ModalBody id="captureAmountModalBody" className = "captureAmountModalBody" >
              <h4 className="center orange-text">Box Details
                <span className="black-text right" style= {{ fontSize: "medium", padding: "1%" }} > Box Id: 
                  <span className = "green-text"> { boxId }</span>
                </span>
              </h4><br/>
              <div>
                <Table >
                {
                  shippedData.filter(key=>key.box_id==boxId).map(filterkey=>(
                    <>
                    <tbody>
                        <tr >
                          <th scope="row" style={{ width: "50%" }} >Customer Id</th>
                          <td style={{ width: "1%" }} >:</td>
                          <td>
                            {
                              filterkey.customer_details
                              ?filterkey.customer_details.ezz_id
                              :""
                            }
                          </td>
                        </tr>
                        <tr >
                          <th >Customer Name</th>
                          <td>:</td>
                          <td>
                            {
                              filterkey.customer_details
                              ?filterkey.customer_details.customer_name
                              :""
                            }
                          </td>
                        </tr>
                        <tr >
                          <th >Outbound Tracking No.</th>
                          <td>:</td>
                          <td>
                            <span>
                              {
                                filterkey.box_details
                                  ? filterkey.box_details.outbound_tracking_number
                                  : "-"
                              }
                              {/* {filterkey.box_details.outbound_tracking_number} */}
                            </span>
                          </td>
                        </tr>
                        <tr>
                            <th>Box Weight</th>
                            <td>:</td>
                            <td>
                              {
                                filterkey.box_details
                                  ? filterkey.box_details.box_weight
                                  : ''
                              }
                            </td>
                        </tr>
                        <tr >
                          <th >Billing Id</th>
                          <td>:</td>
                          <td><span>{
                                filterkey.box_details
                                  ? filterkey.box_details.billing_id
                                  : "-"
                              }</span></td>
                        </tr>
                        <tr >
                          <th >Promotion Applied</th>
                          <td>:</td>
                          <td><span>-----</span></td>
                        </tr>
                        <tr >
                          <th >Discount Applied</th>
                          <td>:</td>
                          <td><span>-----</span></td>
                        </tr>
                      </tbody>
                    </>                      
                  ))
                }                
                </Table><br/>
        <React.Fragment>   
        
        <Table className="table table-hover" id="" >
        <TableHead>
        <TableRow>
       
        <TableCell></TableCell>
        <TableCell>Sr. No.</TableCell>
        <TableCell>Order No.</TableCell>
        <TableCell>Inbound Tracking No.</TableCell>
        <TableCell></TableCell>
        </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      shippedData.filter(key => key.box_id == boxId).map(filterkey => {
                        if (filterkey.orders.length > 0) {
                          return(
                            filterkey.orders.map((element, index) => (
                              <React.Fragment>
                              <TableRow key={index}>
                                <TableCell>
                                <IconButton className='blue' aria-label="expand row" size="" onClick={() => setOpen2(!open2)}>
                              {open2 ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton></TableCell>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{element.order_id}</TableCell>
                                <TableCell>{element.inbound_tracking_number}</TableCell>
                                <TableCell><span title="Capture Amount">
                                    {/* <Info
                                      style={{ cursor: "pointer" }}
                                      onClick={() => viewOrderDetails(element.order_id)} 
                                    /> */}
                                  </span></TableCell>
                            </TableRow>

                            <TableRow>
                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                              <Collapse in={open2} timeout="auto" unmountOnExit>
                                <Box margin={1}>
                                 <Table size="small" aria-label="purchases">
                                    <TableHead>

                                      <TableRow>
                                        <TableCell>Sr. No.</TableCell>
                                        <TableCell>Product Description</TableCell>
                                        <TableCell>Unit Price ($)</TableCell>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>Custom Duty ($)</TableCell>
                                        <TableCell>Vat Charge ($)</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    {
                                      element.product_details
                                      ? 

                                      element.product_details.map((key, index)=>{
                                        if(key){
                                          //console.log(key)
                                          return(
                                                                                       
                                              <TableRow key={index}>
                                              <TableCell>{index+1}</TableCell>
                                              <TableCell>{key.description}</TableCell>
                                              <TableCell>{key.unit_price}</TableCell>
                                              <TableCell>{key.quantity}</TableCell>
                                              <TableCell>
                                              {/* {isEditCustom ? ( */}
                                           <span>{key.custom}</span>
                                           
                                              <span>
                                              <input type="number"
                                                value={CustomValue[`customs${key.id}`]}
                                                name = {`customs${key.id}`}
                                                onChange={handleCustomChange}
                                                
                                              /></span>
                                            {/* // ) : (
                                            //   categoryCustom[key.category]*key.quantity*key.unit_price/100
                                            // )} */}
                                            
                                            </TableCell>
                                              <TableCell>
                                              {/* {isEditVat ? ( */}
                                              <span>{key.vat}</span>
                                              <span>
                                              <input type = "number"
                                                value={VatValue[`vat${key.id}`]}
                                                name = {`vat${key.id}`}
                                                onChange={handleVatChange}
                                                
                                              /></span>
                                            {/* // ) : (
                                            //   categoryVat[key.category]*key.quantity*key.unit_price/100
                                            // )} */}
                                            </TableCell>
                                            <TableCell>
                                              
                                            { 
                                            buttonProgress
                                            ? 
                                            <Button disabled><Spinner 
                                            as="span"
                                            animation = "border"
                                            size = "sm"
                                            role = "status"
                                            aria-hidden="true"
                                            variant = "primary"

                                            />
                                            </Button>
                                        
                                            :
                                            <Button className='orange' onClick={()=>handleUpdateCustomCharge(key)} 
                                              type="submit">Update</Button>
                                        
                                            }
                                            </TableCell>
                                              
                                              
  
                                            </TableRow>
                                           
                                          )
                                        }
                                      
                                      })
                                      :<TableRow></TableRow>
                                    }
                                  </Table>
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                         
                          
                          </React.Fragment>
                            ))
                          )                          
                        }
                        else {
                          return <tr><td></td></tr>
                        }
      
                      })
                    }
                    
                  </TableBody>
                  </Table>
                  
                  </React.Fragment>   
                  
                  
                  <br/>
                  
                  <table>
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Charge amount ($)</th>
                        <th>Charged on</th>
                        <th>Invoice No.</th>
                        <th>Transaction No.</th>
                      </tr>
                    </thead>
                  {
                    shippedData.filter(key => key.box_id == boxId).map(filterkey => (
                      <tbody>
                        <tr>
                          <td style = {{ width:"30%" }}>Shipment Charges</td>
                          <td>{filterkey.freight_charge_transaction_amount }</td>
                          <td>{filterkey.date_created.split('T')[0]} <br/> { filterkey.date_created.split('T')[1].split('.')[0] }</td>
                          <td>{filterkey.freight_invoice_number}</td>
                          <td>{filterkey.freight_charge_transaction_id}</td>
                        </tr>
                        <tr>
                          <td>CustomDuty Charge on hold</td>

                            {
                              filterkey.onhold_transactions
                              ?
                               <>
                                  <td>{filterkey.onhold_transactions.amount}</td>
                                  <td>
                                      {filterkey.onhold_transactions.date_created.split('T')[0]}
                                      <br />
                                      {filterkey.onhold_transactions.date_created.split('T')[1].split('.')[0]}                                   
                                  </td>
                                  <td>{filterkey.onhold_transactions.custom_invoice_number}</td>
                                  <td>{filterkey.onhold_transactions.transaction_id}</td>
                               </>                              
                              :
                                <>
                                 <td>null</td>
                                 <td>null</td>
                                 <td>null</td>
                                 <td>null</td>
                                </>
                            }
                        </tr>
                        <tr >
                          <td>Total Amount</td>
                          {
                            filterkey.custom_charge_transaction_id != "null"
                            ?<> 
                              {
                                  <>
                                    <td>{filterkey.custom_charge_transaction_amount}</td>
                                    <td>
                                        {filterkey.custom_charge_date.split('T')[0]}
                                        <br />
                                        {filterkey.custom_charge_date.split('T')[1].split('.')[0]}
                                    </td>
                                    <td>INV---</td>
                                    <td>{filterkey.custom_charge_transaction_id}</td>
                                  </>
                              }
                             </>
                            :<>
                              {
                                <>
                                  <td colSpan="2" >
                                    {
                                      filterkey.box_details
                                      ?
                                      filterkey.box_details.total_custom_charge 
                                      : 
                                      ''
                                    }
                                    {/* { 
                                    (()=> {
                                      var amount = 0.0
                                      filterkey.orders.flat().forEach((key, item)=>{
                                        // setamount(0)
                                        
                                        
                                        key.product_details.forEach((item, index)=>{
                                          //  console.log('INDEX', item.custom_charge)
                                          amount = amount + item.custom_charge
                                          // console.log('amount', amount)
                                          // console.log(typeof(item.custom_charge), item.custom_charge)
                                        })
                                          return(
                                            amount
                                          )
                                      })
                                      return(
                                        amount
                                      )
                                    })()
                                  } */}

                              
                                    
                                    
                                   
                                  </td>
                                  <td colSpan="2" style={{textAlign:"right"}}>
                                  {
                                    customButtonProgress
                                    ?
                                          <Button disabled><Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            variant="primary"

                                          />
                                          </Button>
                                      
                                    :
                                      <Button color="primary" type="submit" 
                                        onClick={ ()=> captureAmount(filterkey.box_details.total_custom_charge )}>Capture</Button>
                                  }
                                 </td>   
                                </>                                  
                              }
                              </>
                          }
                        </tr>
                      </tbody>
                    ))
                  }                      
                  </table><br/>
              </div>
              <div className="right">
              {/* {
                capture
                ?<Button color="primary" type="submit" onClick={toggle} > OK </Button>
                : <Button color="primary" type="submit" onClick={ ()=> captureAmount()}>OK</Button>
              }             */}
              {' '}     
              {
                customButtonProgress
                ?''
                :<Button color="danger" onClick={toggle} style={{ marginLeft: "5px" }}>Cancel</Button>
              }
              
              </div>
              
            </ModalBody>          
          </Modal>
        </Col>
      </Row>   


      <Modal id="fileView" className = "fileView" size="lg" isOpen={modalFile} toggle={toggleFile} >
        <ModalBody>



          <iframe name="my-frame" id="my-frame" title="my-frame" src={fileUrl} style={{ width: '100%', height: '100vh' }} ></iframe>

        </ModalBody>
        <ModalFooter>
          <Button outline  onClick={()=>setModalFile(!modalFile)} color="primary" className='mr-2' >Close</Button>
          <Button onClick={()=>{window.frames["my-frame"].print()}} color="primary">Print</Button>
        </ModalFooter>
      </Modal>


                 

      <div id="tempModal" className="modal tempModal  modal-fixed-footer">
        <div className="modal-content ">

        </div>
        <div className="modal-footer">

        </div>
      </div>

    </div>
  )
}




