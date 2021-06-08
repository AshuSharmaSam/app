import React from 'react'
import { base_url } from '../../globalConstants'
import { useState, useEffect, useContext} from 'react'
import { Row, Col, InputGroup, FormControl, Table, Spinner, Card, ListGroup, ListGroupItem } from "react-bootstrap";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import M from "materialize-css";
import InfoIcon from '@material-ui/icons/Info';
import {Search, NavigateBefore, NavigateNext, Close } from "@material-ui/icons";
import "./temp.css";
import Axios from "axios";
import SearchIcon from '@material-ui/icons/Search';
import 'bootstrap/dist/css/bootstrap.min.css';


export default function Shipped() {

    const [shippedData, setShippedData] = useState([]);  
    const [shippedResponse, setShippedResponse] = useState([]);
    const [open, setOpen] = useState(false);
    const [modal, setModal] = useState(false);
    const [boxId, setBoxId] = useState('')
    const [showSpinner, setShowSpinner] = useState(false);  
    const [url, setUrl] = useState(base_url+`custom_settlement_details/?custom_charge_transaction_id=&shipped=null`)
    const [prevPageUrl, setPrevPageUrl] = useState('')
    const [nextPageUrl, setNextPageUrl] = useState('')
    const [searchResultsCount, setSearchResultsCount] = useState(-1)
    const [currentDisplayCount, setCurrentDisplayCount] = useState(-1)
    const [totalDisplayCount, setTotalDisplayCount] = useState(-1)
    const [searchKeyword, setSearchKeyword] = useState('')
    const [currentPageNumber, setCurrentPageNumber] = useState(1)
    
    const toggle = () => setModal(!modal);
    
    const viewShippedDetails = (tempBoxId) => {
      // alert(tempBoxId)
      setBoxId(tempBoxId)
      toggle()
    }

    const fetchDetails = async () => {
      setShowSpinner(true)
      
      // let url = base_url+'custom_settlement_details'
      
      const response = await Axios.get(url)
      // console.log(response);
      const { data } = response 
      console.log(data.results);
      // console.log(base_url);
      setShowSpinner(false)
      await setShippedResponse(data);
      await setShippedData(data.results);
      setCurrentDisplayCount(data.results.length)
      setTotalDisplayCount(data.count)   
      setPrevPageUrl(data.previous)
      setNextPageUrl(data.next) 
    }

    //Handle page navigation
  const handlePageNavigation = async (updatedUrl, pg) =>{

    var tempPageNumber = currentPageNumber

    setShowSpinner(true)
    let updated_url = updatedUrl
    console.log('updatedUrl', updated_url);
    await Axios({
      method: 'GET',
      url: updatedUrl
    }).then( (response) => {
      console.log('RESPONSE', response);
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

    console.log('searchKeyword', searchKeyword);

    var filterString = searchKeyword

    if (eventKey.key === "Backspace") {
      let searchUrl = base_url + `custom_settlement_details/?custom_charge_transaction_id=&shipped=null`
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

    if (eventKey.key === "Enter") {
      if (filterString.trim() === "") {
        return
      }

      let searchUrl = base_url + `custom_settlement_details/?custom_charge_transaction_id=&shipped=null&search=${filterString}`
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

  }

  const editSearchTerm = async e => {
    console.log('SEARCH KEY', e.target.value);

    let word = e.target.value
    let bucket = word.split(' ')

    console.log(bucket)

    let searchString = bucket.reduce((prevVal, currVal) => { return prevVal += currVal + ' ' }, '')

    console.log('searchString', searchString);

    setSearchKeyword(searchString)


  }

  // const onKeyDown = (e) => {
  //   if (e.keyCode === 8) {
  //     setShippedData(shippedData)
  //   }
  // }

  //SEARCH END
    
    useEffect(() => {
      fetchDetails();
    }, [url])

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
          <h3 className="orange-text">Shipped</h3>
        </Col>
        <Col xs={5}>

        </Col>
        <Col>
          {/* <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroup-sizing-lg"><SearchIcon/></InputGroup.Text>
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
                  ? <Button style={{ backgroundColor: "orange" }} onClick={()=>handlePageNavigation(prevPageUrl, '-')}><NavigateBefore /></Button>
                  : <Button disabled><NavigateBefore /></Button>
              }{' '}
              {
                shippedResponse.next
                  ? <Button style={{ backgroundColor: "orange" }} onClick={()=>handlePageNavigation(nextPageUrl, '+')}><NavigateNext /></Button>
                  : <Button onClick={() => setUrl(shippedResponse.next)} disabled><NavigateNext /></Button>
              }
            </div><br />
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
          <Table bordered hover size="lg">
            <thead>
              <tr style = {{ backgroundColor: "#676760", color: "white"  }} >
                {/* <th>S.No.</th> */}
                <th>Box Id</th>
                <th>Box<br/> Weight</th>
                <th>Customer Id</th>
                <th>Customer Name</th>
                <th>Order Id</th>
                <th>Country</th>
                <th>Shipped on</th>
                <th>Outbound No.</th>
                {/* <th>Status</th> */}
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {
                // shippedData.filter(key => key.custom_charge_transaction_id).map((filterkey, index) => (
                shippedData.map((filterkey, index) => (
                  <tr key={filterkey.id}>
                      {/* <th scope = "row">{index + 1}</th> */}
                      <td>{filterkey.box_id}</td>
                      <td>
                        {
                          filterkey.box_details
                          ?filterkey.box_details.box_weight
                          :''
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
                          ?filterkey.orders.map( element => (
                            <> {element.order_id} <br/></> 
                          ))
                          :""
                        }
                        {/* {filterkey.orders[0].order_id} */}
                      </td>
                      <td>
                        {
                          filterkey.customer_details !== null
                          ? filterkey.customer_details.country
                          : ""
                        }
                      </td>
                      <td>
                        {filterkey.date_created.split('T')[0]}
                        <br/>
                        {filterkey.date_created.split('T')[1].split('.')[0]}
                      </td>
                      <td>
                      {
                        filterkey.box_details
                        ?filterkey.box_details.outbound_tracking_number
                        :"-" 
                      }
                      </td>
                      {/* <td>SHIPPED</td> */}
                      <td>
                        <span title = "View Details">
                          <InfoIcon 
                            style={{ cursor: "pointer" }}                              
                            onClick = { () => viewShippedDetails(filterkey.box_id) } />
                        </span>
                      </td>
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
                      shippedData.filter(key => key.box_id == boxId).map(filterkey => (
                        <tbody>
                          <tr>
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
                          <tr>
                            <th>Customer Name</th>
                            <td>:</td>
                            <td>
                            {
                              filterkey.customer_details
                              ?filterkey.customer_details.customer_name
                              :""
                            }
                            </td>
                          </tr>
                          <tr>
                            <th>Inbound Tracking No.</th>
                            <td>:</td>
                            <td>
                                {
                                  filterkey.orders.length > 0
                                    ? filterkey.orders[0].order_id
                                    : ""
                                }
                            </td>
                          </tr>
                          <tr>
                            <th>Outbound Tracking No.</th>
                            <td>:</td>
                            <td>
                              {
                                filterkey.box_details
                                  ? filterkey.box_details.outbound_tracking_number
                                  : "-"
                              }
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
                          <tr>
                            <th>Billing Id</th>
                            <td>:</td>
                            <td>
                              {
                                filterkey.box_details
                                  ? filterkey.box_details.billing_id
                                  : "-"
                              }
                              {/* { filterkey.box_details.billing_id } */}
                            </td>
                          </tr>
                          {/* <tr>
                            <th>Shipper Id</th>
                            <td>:</td>
                            <td>
                              ------
                            </td>
                          </tr> */}
                          <tr>
                            <th>Promotion Applied</th>
                            <td>:</td>
                            <td>-----</td>
                          </tr>
                          <tr>
                            <th>Discount Applied</th>
                            <td>:</td>
                            <td>-----</td>
                          </tr>
                        </tbody>
                      ))
                    }
                </Table><br/>
                
                <table className="table table-hover" id="" >
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th>Order No.</th>
                      <th>Inbound Tracking No.</th>
                      <th>Shipper Order Number</th>
                    </tr>
                  </thead>
                  <tbody>
                      {
                        shippedData.filter(key => key.box_id == boxId).map(filterkey => {
                          if (filterkey.orders.length > 0) {
                            return(
                              filterkey.orders.map((element, index) => (
                                <tr>
                                  <td>{index + 1}</td>
                                  <td>{element.order_id}</td>
                                  <td>{element.inbound_tracking_number}</td>
                                  <td>{element.shipping_order_number}</td>
                                </tr>
                              ))
                            )
                          }
                          else {
                            return <tr><td></td></tr>
                          }
                        })
                      }
                  </tbody>
                </table><br/>
                <table>
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Charged amount</th>
                      <th>Charged on</th>
                      <th>Invoice No.</th>
                      <th>Transaction No.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {                      
                      shippedData.filter(key => key.box_id == boxId).map( filterkey => (
                        <>
                          <tr>
                            <td>Shipment Charges</td>
                            <td>{ filterkey.freight_charge_transaction_amount }</td>
                            <td>
                              { filterkey.date_created.split('T')[0] }
                                <br/>
                              { filterkey.date_created.split('T')[1].split('.')[0] }
                            </td>
                            <td>{filterkey.freight_invoice_number}</td>
                            <td>{ filterkey.freight_charge_transaction_id }</td>
                          </tr>
                          <tr>
                            <td>CustomDuty Charge on hold</td>
                            <td>{ filterkey.onhold_transactions.amount }</td>
                            <td>
                              { filterkey.onhold_transactions.date_created.split('T')[0] }
                                <br/>
                              { filterkey.onhold_transactions.date_created.split('T')[1].split('.')[0] }
                            </td>
                            <td>{filterkey.onhold_transactions.custom_invoice_number}</td>
                            <td>{ filterkey.onhold_transactions.transaction_id }</td>
                          </tr>
                          <tr>
                            <td>Captured Amount</td>
                            <td>{ filterkey.custom_charge_transaction_amount }</td>
                            <td>
                              { filterkey.custom_charge_date.split('T')[0] }
                                <br/>
                              { filterkey.custom_charge_date.split('T')[1].split('.')[0] }
                            </td>
                            <td>{filterkey.onhold_transactions.custom_invoice_number}</td>
                            <td>{ filterkey.custom_charge_transaction_id }</td>
                          </tr>
                          <tr>
                            <td>Excessive Amount</td>
                            <td>{ filterkey.excessive_amount }</td>
                            <td>
                              { filterkey.custom_charge_date.split('T')[0] }
                                <br/>
                              { filterkey.custom_charge_date.split('T')[1].split('.')[0] }
                            </td>
                            <td>{filterkey.excessive_invoice_number}</td>
                            <td>{ filterkey.excessive_transaction_id }</td>
                          </tr>
                        </>                        
                      ))
                    }
                  </tbody>
                </table><br/>                
              </div>
              <div className="right">
                <Button color="danger" onClick={toggle} > Close </Button>
                {/* <Button color="danger" onClick={toggle} style={{ marginLeft: "5px" }}>Cancel</Button> */}
              </div>  
            </ModalBody>
          </Modal>
        </Col>
      </Row>
    </div>
    )
}
