import React, { Component, Fragment } from 'react';
import { base_url } from '../../globalConstants';
import Axios from "axios"
import { ButtonToolbar, ButtonGroup, Button, Row, Col, Container } from 'react-bootstrap';
import M from "materialize-css";
import CountryFrag from './AddCountry';
import StateFrag from './AddState';
import SlabFrag from './AddSlab'
import WarehouseFrag from './AddWarehouse'
import WarehouseOwnerFrag from './AddWarehouseOwner'
import CategoryFrag from './AddCategory'
import FedexConsolidateFrag from './AddFedexConsolidate'
import BillingFrag from './AddBillingDetails'
import PrinterFrag from './AddPrinterIP'
import DiscountFrag from './AddPromotionalData'
import LanguageFrag from './AddLanguageTemplate'
import BrokerFrag from './AddBroker'
import Error from './Error'
import './countrydetail.css';
// import { getJSON, parseJSON } from 'jquery';


class DbCountry extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      fragmentdiv: <CountryFrag countrytable={this.props.countrydata} />,
      error: '',
      tableHeader: "Country Master"
    })
    this.fetchCountryData = this.fetchCountryData.bind(this)
  }



  getCountryData = async () => {

    try {
      const response = await Axios.get(base_url+'countries/')
      console.log(response.data)
      console.log("COutnry data" + response.data)

      this.setState({ fragmentdiv: <CountryFrag countrytable={response.data} /> })

    }

    catch (error) {
      console.log("Error", error);
      this.setState({ error: "<h1 className= 'red-text'>${error}></h1>" })
    }



  }

  getStateData = async () => {
    console.log()
    try {
      const response = await Axios.get(base_url+'states/')
      const response_countrylist = await Axios.get(base_url+'countries/?list=True')
      // console.log(response.data)
      console.log(response_countrylist.data)
      let countrylist = []
      let country_codelist = []
      for (var key in response_countrylist.data) {
        console.log("state key", key)


        country_codelist.push(response_countrylist.data[key].country_id)
        countrylist.push(response_countrylist.data[key].country_name)
      }
      console.log("codelist", country_codelist)
      console.log("namelist", countrylist)
      this.setState({
        fragmentdiv: <StateFrag statedata={response.data}
          countrylist={countrylist} country_code_list={country_codelist} />
      })
      this.setState({ error: <></> })
    }

    catch (error) {
      console.log("Error", error);
      this.setState({ error: <Error /> })
    }



  }

  getSlabData = async () => {
    console.log()
    try {

      let token = localStorage.getItem("token")
      let header = {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Token ' + token,

      }


      const response = await Axios.get(base_url+'slabcodes/', header)
      const response_countrylist = await Axios.get(base_url+'countries/?list=True', header)

      let countrylist = []
      let country_codelist = []
      console.log("country resp", response_countrylist.data)
      for (var key in response_countrylist.data) {
        console.log("key", key)
        country_codelist.push(response_countrylist.data[key].country_id)
        countrylist.push(response_countrylist.data[key].country_name)
      }
      console.log("codelist", country_codelist)
      console.log("namelist", countrylist)
      this.setState({
        fragmentdiv: <SlabFrag slabdata={response.data}
          countrylist={countrylist} country_code_list={country_codelist} />
      })

    }

    catch (error) {
      console.log("Error", error);
      this.setState({ error: <Error /> })
    }



  }

  // Category data fetch to display

  getCategoryData = async () => {
    console.log()
    try {
      const response = await Axios.get(base_url+'categories/')
      const response_countrylist = await Axios.get(base_url+'countries/?list=True')

      let countrylist = []
      let country_codelist = []
      for (var key in response_countrylist.data) {

        country_codelist.push(response_countrylist.data[key].country_id)
        countrylist.push(response_countrylist.data[key].country_name)
      }

      this.setState({
        fragmentdiv: <CategoryFrag categorydata={response.data}
          countrylist={countrylist} country_code_list={country_codelist} />
      })

    }

    catch (error) {
      console.log("Error", error);
      this.setState({ error: <Error /> })
    }



  }

  // Warehouse data fetch to display

  getWareHouseData = async () => {

    try {
      const response = await Axios.get(base_url+'warehouses/')
      const response_countryStatelist = await Axios.get(base_url+'country_state_details/')

      let countrylist = []
      let country_codelist = []
      let state_list = []
      let stateCode_list = []
      for (var key in response_countryStatelist.data) {

        country_codelist.push(response_countryStatelist.data[key].country_id)
        countrylist.push(response_countryStatelist.data[key].name)
        state_list.push(response_countryStatelist.data[key].states)
        
        console.log(response_countryStatelist.data[key].country_id)
        console.log(response_countryStatelist.data[key].name)
        console.log(response_countryStatelist.data[key].states)
        console.log(response_countryStatelist.data[key].states[2])
      }
      // console.log("statelist warehouse ", state_list)
      // for (var i in state_list){
      //   stateCode_list.push(state_list.states[i])
      //   console.log(state_list.states[i])
      // }
      // for (var i in state_list){
      //   stateCode_list.push(state_list[i])
      // }
      console.log("stateCodelist warehouse ", stateCode_list)
      this.setState({
        fragmentdiv: <WarehouseFrag warehousedata={response.data}
          countrylist={countrylist} country_code_list={country_codelist}
          statedata={state_list}
        />
      })

    }

    catch (error) {
      console.log("Error", error);
      this.setState({ error: <Error /> })
    }



  }


  //NEW ADMIN TABS START

  //Warehouse Owner Data fetch to display
  getWarehouseOwnerData = async () => {
    try {
      const response = await Axios.get(base_url+'warehouse_owner/')
      const response_warehouseList = await Axios.get(base_url+'warehouses/')
      const response_countryStatelist = await Axios.get(base_url+'country_state_details/')

      let warehouseIDList = []
      let countrylist = []
      let country_codelist = []
      let state_list = []

      for (var key in response_warehouseList.data) {
        warehouseIDList.push(response_warehouseList.data[key].warehouse_id)       
      }

      for (var key in response_countryStatelist.data) {

        country_codelist.push(response_countryStatelist.data[key].country_id)
        countrylist.push(response_countryStatelist.data[key].name)
        state_list.push(response_countryStatelist.data[key].states)
        console.log(response_countryStatelist.data[key].country_id)
        console.log(response_countryStatelist.data[key].name)
        console.log(response_countryStatelist.data[key].states)
      }
      console.log("statelist warehouse ", state_list)
      // console.log("warehouse list", state_list)
      console.log("warehouse ID list", warehouseIDList)
      this.setState({
        fragmentdiv: <WarehouseOwnerFrag warehouse_ownerdata={response.data}
          countrylist={countrylist} country_code_list={country_codelist}
          statedata={state_list} warehouseIDList = {warehouseIDList}
        />
      })

    }

    catch (error) {
      console.log("Error", error);
      this.setState({ error: <Error /> })
    }
    
  }

  //Fedex Consolidate fetch to display
  getFedexConsolidateData = async () => {
    console.log()
    try {
      const response = await Axios.get(base_url+'fedex_consolidate/')
      const response_countrylist = await Axios.get(base_url+'countries/?list=True')
      const response_countryStatelist = await Axios.get(base_url+'country_state_details/')
  
      let countrylist = []
      let country_codelist = []
      let state_list = []
      for (var key in response_countryStatelist.data) {

        country_codelist.push(response_countryStatelist.data[key].country_id)
        countrylist.push(response_countryStatelist.data[key].name)
        state_list.push(response_countryStatelist.data[key].states)
        console.log(response_countryStatelist.data[key].country_id)
        console.log(response_countryStatelist.data[key].name)
        console.log(response_countryStatelist.data[key].states)
      }

      this.setState({
        fragmentdiv: <FedexConsolidateFrag fedexConsolidatedata={response.data}
          countrylist={countrylist} country_code_list={country_codelist}
          />
      })

    }

    catch (error) {
      console.log("Error", error);
      this.setState({ error: <Error /> })
    }
  }


  //Billing Data fetch to display
  getBillingData = async () => {
    console.log()
    try {
      const response = await Axios.get(base_url+'cash_billing/')
      const response_countrylist = await Axios.get(base_url+'countries/?list=True')
      const response_ownerList = await Axios.get(base_url+'warehouse_owner/')
      const response_ezzid = await Axios.get(base_url + 'customers/?ezz_id=&ezz_id__icontains=CAS&email__icontains=&phone_number=&zipcode__icontains=')
      console.log("response ezzy", response_ezzid)
      let countrylist = []
      let country_codelist = []
      let ownerList = []
      let ezzyid_cas = []
      for (var key in response_countrylist.data) {

        country_codelist.push(response_countrylist.data[key].country_id)
        countrylist.push(response_countrylist.data[key].country_name)
      }

      for (var key in response_ownerList.data) {
        ownerList.push(response_ownerList.data[key].owner_id)       
      }

      for (var key in response_ezzid.data.results) {
        ezzyid_cas.push(response_ezzid.data.results[key].ezz_id)
      }
      console.log("EZZYID", ezzyid_cas)

      this.setState({
        fragmentdiv: <BillingFrag billingdata={response.data}
          countrylist={countrylist} country_code_list={country_codelist}
          ownerList = {ownerList}
          ezzyid_cas = {ezzyid_cas}/>
          // ezzyid_cas = {ezzyid} />
          
      })

    }

    catch (error) {
      console.log("Error", error);
      this.setState({ error: <Error /> })
    }
  }

  //Printer IP Data fetch to display
  getPrinterIPdata = async () => {
    console.log()
    try {
      const response = await Axios.get(base_url+'printer_ip/')
      const response_countrylist = await Axios.get(base_url+'countries/?list=True')
      const response_warehouseList = await Axios.get(base_url+'warehouses/')
      
      let warehouseIDList = []
      let countrylist = []
      let country_codelist = []

      for (var key in response_countrylist.data) {

        country_codelist.push(response_countrylist.data[key].country_id)
        countrylist.push(response_countrylist.data[key].country_name)
      }

      for (var key in response_warehouseList.data) {
        warehouseIDList.push(response_warehouseList.data[key].warehouse_id)       
      }
     
      this.setState({
        fragmentdiv: <PrinterFrag printerIPdata={response.data}
          countrylist={countrylist} country_code_list={country_codelist}
          warehouseIDList = {warehouseIDList}/>
      })

    }

    catch (error) {
      console.log("Error", error);
      this.setState({ error: <Error /> })
    }
  }

  //Promotional/Discount Data Fetch to Display
  getDiscountData = async () => {
    try {
      const response = await Axios.get(base_url+'promotions/')
      const response_countrylist = await Axios.get(base_url+'countries/?list=True')
      
      let countrylist = []
      let country_codelist = []
      let country_name = {}

      for (var key in response_countrylist.data) {

        country_codelist.push(response_countrylist.data[key].country_id)
        countrylist.push(response_countrylist.data[key].country_name)

        country_name[response_countrylist.data[key].country_id] = response_countrylist.data[key].country_name
      }

      // console.log('COUNTRY NAME', country_name);

      this.setState({
        fragmentdiv: <DiscountFrag discountdata = { response.data }
        countrylist={countrylist} 
        country_code_list={country_codelist}
        country_name = { country_name } />
      })  

    }

    catch (error) {
      console.log("Error", error);
      this.setState({ error: <Error /> })
    }
  }
  
  getLanguageTemplateData = async () => {

    try {
      const response = await Axios.get(base_url+'countries/')
      const response_countrylist = await Axios.get(base_url+'countries/?list=True')
      
      let countrylist = []
      let country_codelist = []
      let default_lang_list = []

      for (var key in response_countrylist.data) {
        country_codelist.push(response_countrylist.data[key].country_id)
        countrylist.push(response_countrylist.data[key].country_name)        
      }
      
      for (var key in response.data) {
        default_lang_list.push(response.data[key].default_language)
      }     
      console.log('DEF LANG', default_lang_list);

      this.setState({
        fragmentdiv: <LanguageFrag languageData = { response.data }
        default_langList = { default_lang_list }
        countrylist={countrylist} 
        country_code_list={country_codelist}  />
      }) 

    }

    catch (error) {
      console.log("Error", error);
      this.setState({ error: <Error /> })
    }
    
   
  }

  getBrokerData = async () => {
    try {
      const response = await Axios.get(base_url+'countries/')
      const response_countrylist = await Axios.get(base_url+'countries/?list=True')
      const response_countryStatelist = await Axios.get(base_url+'country_state_details/')
      const response_broker = await Axios.get(base_url+'brokers/')
      
      let countrylist = []
      let country_codelist = []
      let country_name = {}

      for (var key in response_countrylist.data) {
        country_codelist.push(response_countrylist.data[key].country_id)
        countrylist.push(response_countrylist.data[key].country_name)    
        
        country_name[response_countrylist.data[key].country_id] = response_countrylist.data[key].country_name
        
      }

      console.log("response_broker.data", response_broker.data);

      let state_list = []
      let stateCode_list = []
      for (var key in response_countryStatelist.data) {
        state_list.push(response_countryStatelist.data[key].states)
        
        // console.log(response_countryStatelist.data[key].country_id)
        // console.log(response_countryStatelist.data[key].name)
        // console.log(response_countryStatelist.data[key].states)
        // console.log(response_countryStatelist.data[key].states[2])
      }
      console.log("stateCodelist warehouse ", stateCode_list)

      this.setState({
        fragmentdiv: <BrokerFrag languageData = { response.data }
        countrylist={countrylist} 
        country_code_list={country_codelist}  
        country_name = { country_name }
        statedata={state_list}
        broker_data = {response_broker.data}
      />
      }) 

    }

    catch (error) {
      console.log("Error", error);
      this.setState({ error: <Error /> })
    }
  }

  //NEW ADMIN TABS END

  componentDidMount() {

    M.AutoInit();

    this.getCountryData()

  }


  functionalityNotAvailable = () => {

    M.toast({ html: 'Functionality Not Available', classes: "white-text red rounded" })

  }

  fetchCountryData() {
    this.setState({
      tableHeader: "Country Master"
    })
    this.setState({
      fragmentdiv: <CountryFrag countrytable={this.props.countrydata} />,
    })
  }

  fetchStateData = () => {
    this.setState({
      tableHeader: "State Master"
    })
    this.getStateData()
  }


  fetchSlabData = () => {
    this.setState({
      tableHeader: "Freight Slab Rates"
    })
    this.getSlabData()
  }

  fetchWareHouseData = () => {
    this.setState({
      tableHeader: "Warehouse Master"
    })
    this.getWareHouseData()
  }
  fetchCategoryData = () => {
    this.setState({
      tableHeader: "Category Master"
    })    
    this.getCategoryData()
  }

  //NEW ADMIN TABS START


  fetchWarehouseOwnerData = () => {
    this.setState({
      tableHeader: "Warehouse Owner"
    })
    this.getWarehouseOwnerData()
  }

  fetchBillingData = () => {
    this.setState({
      tableHeader: "Billing"
    })
    this.getBillingData()
  }
  
  fetchFedexConsolidateData = () => {
    this.setState({
      tableHeader: "Consolidated Invoice Recipient"
    })
    this.getFedexConsolidateData()
  }

  fetchPrinterIPdata = () => {
    this.setState({
      tableHeader: "Printer IP"
    })
    this.getPrinterIPdata()
  }
  
  fetchDiscountData = () => {
    this.setState({
      tableHeader: "Discount"
    })
    this.getDiscountData()
  }

  fetchLanguageTemplateData = () => {
    this.setState({
      tableHeader: "Country Language"
    })
    this.getLanguageTemplateData()
  }

  fetchBrokerData = () => {
    this.setState({
      tableHeader: "Broker"
    })
    this.getBrokerData()
  }

  //NEW ADMIN TABS END

  render() {
    return (
      <Fragment>



        <Row>
          <Col xs={12} md={12} lg={12}>
            {/* Todo searchbar  */}
          </Col>
        </Row>
        <Row>
          <Col xs={12} lg={12} className="" >
            <ButtonToolbar aria-label="Toolbar with button groups">
              <Row>
                <ButtonGroup className="mr-2" aria-label="First group">

                  <Col xs sm md lg={12}>

                    <Button onClick={this.fetchCountryData} className="mr-3 " variant="outline-primary" >Country Master</Button>
                    <Button onClick={this.fetchStateData} variant="outline-primary" className="mr-3 ">State Master</Button>
                    <Button onClick={this.fetchLanguageTemplateData} variant="outline-primary"  className="mr-3">Country Language</Button>
                    <Button onClick={this.fetchSlabData} variant="outline-primary" className="mr-3 ">Freight Slab Rates</Button>
                    <Button onClick={this.fetchCategoryData} variant="outline-primary" className="mr-3">Category Master</Button>
                  </Col>
                </ButtonGroup>
              </Row>

              <Row>
                <ButtonGroup className="mr-2" aria-label="First group">

                  <Col xs sm md lg={12}>
                    <Button onClick={this.fetchWareHouseData} variant="outline-primary" className="mr-3">Warehouse Master</Button>
                    <Button onClick={this.fetchWarehouseOwnerData} variant="outline-primary" className="mr-3">Warehouse Owner</Button>
                    <Button onClick={this.fetchFedexConsolidateData} variant="outline-primary"  className="mr-3">Consolidated Invoice Recipient</Button>
                    <Button onClick={this.fetchDiscountData} variant="outline-primary"  className="mr-3">Discount</Button>
                  </Col>
                </ButtonGroup>
              </Row>
              
              
              <Row>
                <ButtonGroup className="mr-2" aria-label="First group">
                  <Col xs sm md lg={12}>
                    {/* <Button variant="outline-primary" className="mr-3 " disabled>Operator</Button> */}
                    {/* <Button variant="outline-primary" className="mr-3 " disabled>Order Status Master</Button> */}
                    <Button onClick={this.fetchBillingData} variant="outline-primary" className="mr-3">Cash Billing Id</Button>
                    <Button onClick={this.fetchBrokerData} variant="outline-primary" className="mr-3">Broker</Button>
                    {/* <Button onClick={this.fetchPrinterIPdata} variant="outline-primary" className="mr-3">Printer IP</Button> */}
                  </Col>
                </ButtonGroup>
              </Row>

            </ButtonToolbar>
          </Col>
        </Row>


        <Row>
          <Col xs={12} lg={12}>
            <h3 className = "orange-text center">{ this.state.tableHeader }</h3>
            <div className="operation-dataDiv">
              {this.state.fragmentdiv}
              {this.state.error}
            </div>
          </Col>


        </Row>

      </Fragment>
    )
  }
}

export default DbCountry;