
import React, { Component, Fragment } from 'react';
import { base_url } from '../../globalConstants'
import { Table, Row, Col, Image, Nav, ButtonGroup, Button } from 'react-bootstrap';
import M from "materialize-css";
import { EditOutlined } from "@material-ui/icons";
import Axios from 'axios';
import './addbroker.css';


class BrokerFrag extends Component {
  constructor(props) {
    super(props);
    this.state = ({

        countryId: "",
        brokerName: "", companyName: "", phoneNumber: "", streetLine: "", flag: '',
        brokerState: '', streetLine: '', city: '', zipcode: '', stateName: '',
        brokerData: this.props.broker_data, 
        countryNameList: this.props.country_name,
        countrylist: this.props.countrylist, countrycodelist: this.props.country_code_list, error: "",
        countryName:"", editRow: false, mainId:"", keyId:"",
        statedata: this.props.statedata, stateCode_list: [], stateName_list:[],
        statelist: [], stateSelectOptions: [] 
    })

    // console.log('country_name_list',this.state.countryNameList);
  }

  handleCountryNameChange = async (e) => {
    // this.setState({countryname: e.target.value})
    // @TODO: on changing countryname state list should also Change

    this.setState({ countryName: e.target.value })
    console.log("country selected:- " + e.target.value)
    // this.setState({countryname:e.target.value})


    let selected_countryId = this.state.countrycodelist[this.state.countrylist.indexOf(e.target.value)]
    console.log(selected_countryId)

    const states = this.state.statedata[this.state.countrylist.indexOf(e.target.value)].slice()
    console.log(states)

    this.setState({ countryId: selected_countryId, statelist: states })
    // this.setState({statelist:states})
    console.log(this.state.countryId)
    console.log("state list")
    console.log(this.state.statelist)
    // this.state.statelist


    /////TESTTTTTTT  

    this.setState({ tempStateList: states })
    console.log(this.state.tempStateList)
    console.log(typeof this.state.tempStateList)
    
    /////TESTTTTTTTT END

  }

  handleStateChange = (e) => {
    console.log("state of broker", e.target.value)
    this.setState({ brokerState: e.target.value })
    console.log(this.state.brokerState);
  }

  handleBrokerNameChange = (e) => {
    this.setState({ brokerName: e.target.value })
  }
  handleCompanyChange = (e) => {
    this.setState({ companyName: e.target.value })
  }
  handlePhoneNumberChange = (e) => {
    this.setState({ phoneNumber: e.target.value })
  }
  handleStreeLineChange = (e) => {
    this.setState({ streetLine: e.target.value })
  }  
  handleCityChange = (e) => {
    this.setState({ city: e.target.value })
  }  
  handleZipcodeChange = (e) => {
    this.setState({ zipcode: e.target.value })
  }  
  handleFlagChange = (e) => {
      // console.log('fflag',e.target);
      console.log('fflag',e.target.value);
      this.setState({ flag: e.target.value })
  }


//EDIT OPTION START
handleEditOption = (e) => {
  this.setState({editRow:true})
  var elems = document.getElementById("addBrokerModal");
  var instance = M.Modal.init(elems);
  instance.open()

  let selectedRowIndex ;
              e = e || window.event;
              var data = [];
              var target = e.srcElement || e.target;
              // console.log(target.nodeName)
              while (target && target.nodeName !== "TR") {
                  target = target.parentNode;
                  selectedRowIndex= target.sectionRowIndex
                  console.log("Clicked row",target.sectionRowIndex)
                  // console.log(target.parentNode.index)
              }
              if (target) {
                  var cells = target.getElementsByTagName("td");
                  for (var i = 0; i < cells.length; i++) {
                      data.push(cells[i].innerHTML);
                  }
              } 
              
              let country_name = this.state.countrylist[this.state.countrycodelist.indexOf(data[1])]
              
              // let country_name = country_name[data[1]]   

              console.log(country_name);
              console.log(data);
              this.setState({mainId: data[0], keyId: data[11]})
              this.setState({

                countryId: "",
                brokerName: data[2], 
                companyName: data[3], 
                phoneNumber: data[4],
                brokerState: '', 
                streetLine: data[5], 
                city: data[7], 
                zipcode: data[8], 
                // countryName: country_name,
                countryName: data[1],
                flag: data[9]
              })
}

openAddBrokerModal =  ()=>{
  this.setState({editRow:false})

  var elems = document.getElementById("addBrokerModal");
  var instance = M.Modal.init(elems);
  instance.open()
        
}
closeModal = ()=>{
  var elems = document.getElementById("addBrokerModal");
  var instance = M.Modal.init(elems);
  instance.close();
  this.setState({error: "", editRow:false})
  this.setState({
    brokerName:'', companyName: '', phoneNumber: '', flag: '',
    brokerState: '', streetLine: '', city: '', zipcode: '', 
  })  
}

updateBrokerDB = async () => {
  // console.log("UPDATE FUNCT")

  let country_code = this.state.countrycodelist[this.state.countrylist.indexOf(this.state.countryName)]
  let url = base_url+`brokers/${this.state.keyId}/`

    var brokerformdata = new FormData()
    brokerformdata.append("country", this.state.countryId)
    brokerformdata.append('name',this.state.brokerName)
    brokerformdata.append('company_name',this.state.companyName)
    brokerformdata.append('phone_number',this.state.phoneNumber)
    brokerformdata.append('street_line',this.state.streetLine)
    brokerformdata.append('state',this.state.brokerState)
    brokerformdata.append('city',this.state.city)
    brokerformdata.append('zipcode',this.state.zipcode)
    brokerformdata.append('flag',this.state.flag)
    

    try {
      let token = localStorage.getItem("token")
      var config = {
        headers: { 'Content-Type': 'multipart/form-data' , 'Authorization':'Token '+token},
        
      };
      const response = await Axios.put(url, brokerformdata, config)
  
      let itemIndex = parseInt(this.state.mainId) - 1
      this.state.brokerData.splice(itemIndex, 1, response.data)
  
      var elem = document.getElementById('addBrokerModal')
      var instance = M.Modal.getInstance(elem);
      instance.close();
      M.toast({ html: 'Updated Broker Details Successfully.' , classes: "white-text orange rounded" })
      this.setState({
        countryId: "",
        brokerName:'', companyName: '', phoneNumber: '', flag: '',
        brokerState: '', streetLine: '', city: '', zipcode: '', 
      })
      this.setState({
        error: "",
        editRow: false
      })
    } catch (err) {
      this.setState({
        error: "OH Snap! Something is Wrong.Please try again",
        // editRow: false
      })
      M.toast({ html: 'Please Try Again!', classes: "white-text red rounded" });
  
      console.log(err.message)
    }

}
//EDIT OPTION END


addBrokerToDB = async () => {
    // console.log('ADD FUNCT');

    var brokerformdata = new FormData()
    brokerformdata.append("country", this.state.countryId)
    brokerformdata.append('name',this.state.brokerName)
    brokerformdata.append('company_name',this.state.companyName)
    brokerformdata.append('phone_number',this.state.phoneNumber)
    brokerformdata.append('street_line',this.state.streetLine)
    brokerformdata.append('state',this.state.brokerState)
    brokerformdata.append('city',this.state.city)
    brokerformdata.append('zipcode',this.state.zipcode)
    brokerformdata.append('flag',this.state.flag)
        
    let url = base_url+'brokers/'

    try{
      let token = localStorage.getItem('token')
      var config = {
        headers:{
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Token'+token,
        }    
      };

      const response = await Axios.post(url, brokerformdata, config)
      this.state.brokerData.push(response.data)
      console.log('push response data', response.data);

      var elem = document.getElementById('addBrokerModal')
      var instance = M.Modal.getInstance(elem);
      instance.close();
      this.setState({
        countryId: "",
        brokerName:'', companyName: '', phoneNumber: '',
        brokerState: '', streetLine: '', city: '', zipcode: '', 
        error: ""
      })

      M.toast({ html: 'Added Broker Successfully.', classes: "white-text orange rounded" })

    }catch(err) {
      console.log('ERRRR',err);
      this.setState({
        error: "OH Snap! Something is Wrong.Please try again"
      })
      M.toast({ html: 'Please Try Again!', classes: "white-text red rounded" });

    }

  }

  componentDidMount() {
    // Auto initialize all the things!
    M.AutoInit();

  }


  render() {

    var uniquekey = 0
    const selectCounrtyOptions = this.state.countrylist.map((country) => {

      return (
        <option key={uniquekey++} value={country}>{country}</option>
      )
    })

    const selectStateOptions = this.state.statelist.map((state, index) => {
      // console.log("state", state)

      return (

        <option key={index} value={state.state_id}>{state.state_name}</option>
      )
    })


    const broker_table = this.state.brokerData.map((broker, index) => {
      return (
        <Fragment key={broker.id}>
          <tr>
            <td>{index+1}</td>
            <td>{ this.state.countryNameList[broker.country] }</td>
            <td>{broker.name}</td>
            <td>{broker.company_name}</td>
            <td>{broker.phone_number}</td>
            <td>{broker.street_line}</td>
            <td>{broker.state_name}</td>
            <td>{broker.city}</td>
            <td>{broker.zipcode}</td>
            <td>{broker.flag}</td>
            <td onClick={this.handleEditOption}><a title = "Edit"><EditOutlined/></a></td>
            <td className="hide">{broker.country}</td>
            <td className="hide">{broker.state}</td>
          </tr>
        </Fragment>

      )
    })

    const table_render = <Table hover >
      <thead>
        <tr>
          <th>Sr. No.</th>
          <th>Country</th>
          <th>Broker Name</th>
          <th>Company Name</th>
          <th>Phone Number</th>
          <th>Street Line</th>
          <th>State</th>
          <th>City</th>
          <th>Zipcode</th>
          <th>Flag</th>
          <th>Edit</th>
        </tr>
      </thead>
      <tbody>
        {broker_table}
      </tbody>
    </Table>

    return (
      <Fragment>
        <br></br>
        <br></br>
        {/* <div className="">
    <AddCountry ref="child"/>
        </div> */}




        {/* <!-- Modal Trigger --> */}
        <div id="addBrokerModal" className="modal modal-fixed-footer">
          <div className="modal-content">

          <h4 className="center orange-text"> {this.state.editRow ? "Update Broker Details" : "Add Broker Details"}</h4>

            <h4 className="center orange-text">   </h4>

            <Row>
              <Col xs={12} >
                <form>
                  <p className="center red-text">{this.state.error}</p>

                  <Row>
                    <Col className=" rowdivPading " xs={12}>
                      <div className="input-field col s6 offset-s3 center">
                        <div id=''>
                        {
                            this.state.editRow
                            ? <select id="country_name_select" name="country_name" className="browser-default country_name_select" value={this.state.countryName} onChange={this.handleCountryNameChange}>
                              <option value="" disabled >Choose Country</option>
                              {selectCounrtyOptions}

                            </select>
                            : <select id="country_name_select" name="country_name" className="browser-default country_name_select" defaultValue={'DEFAULT'} onChange={this.handleCountryNameChange}>
                              <option value="DEFAULT" disabled >Choose Country</option>
                              {selectCounrtyOptions}
                            </select>
                          }
                          <label>Select Country</label>

                        </div>
                      </div>  
                    </Col>
                  </Row>

                  <Row>
                    <Col className=" rowdivPading " xs={12}>
                      <div className="input-field col s6 offset-s3 center">
                        <div>

                          {
                            this.state.editRow
                              ? <select id="state_name_select" name="stateName" className="browser-default " value={this.state.brokerState} onChange={this.handleStateChange}>
                                <option value="" disabled >Choose state </option>
                                {selectStateOptions}
                              </select>
                              : <select id="state_name_select" name="stateName" className="browser-default " defaultValue={'DEFAULT'} onChange={this.handleStateChange}>
                                <option value="DEFAULT" disabled >Choose state </option>
                                {selectStateOptions}
                              </select>
                          }
                          <label>Select state</label>

                        </div>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name="broker_name" id="broker_name" type="text" 
                          value={this.state.brokerName} onChange={this.handleBrokerNameChange} className="" />
                        <label htmlFor="broker_name" className="black-text active">Broker Name</label>
                        <span className="helper-text left" data-error="wrong" data-success=""></span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name="company_name" id="company_name" type="text" 
                          value={this.state.companyName} onChange={this.handleCompanyChange} className="" />
                        <label htmlFor="company_name" className="black-text active">Company Name</label>
                        <span className="helper-text left" data-error="wrong" data-success=""></span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name="phone_number" id="phone_number" type="text" 
                          value={this.state.phoneNumber} onChange={this.handlePhoneNumberChange} className="" />
                        <label htmlFor="phone_number" className="black-text active">Phone Number</label>
                        <span className="helper-text left" data-error="wrong" data-success=""></span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name="street_line" id="street_line" type="text" 
                          value={this.state.streetLine} onChange={this.handleStreeLineChange} className="" />
                        <label htmlFor="street_line" className="black-text active">Street Line</label>
                        <span className="helper-text left" data-error="wrong" data-success=""></span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name="city" id="city" type="text" 
                          value={this.state.city} onChange={this.handleCityChange} className="" />
                        <label htmlFor="city" className="black-text active">City</label>
                        <span className="helper-text left" data-error="wrong" data-success=""></span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name="zipcode" id="zipcode" type="text" 
                          value={this.state.zipcode} onChange={this.handleZipcodeChange} className="" />
                        <label htmlFor="zipcode" className="black-text active">Zipcode</label>
                        <span className="helper-text left" data-error="wrong" data-success=""></span>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col className=" rowdivPading " xs={12}>
                      <div className="input-field col s6 offset-s3 center">
                        <div>
                          {
                            this.state.editRow
                              ? <select id="selectFlag" name="selectFlag" className="browser-default " value={this.state.flag} onChange={this.handleFlagChange}>
                                {/* <option value="" disabled >Select Flag </option> */}
                                  <option key='0' value='0'>Inactive</option>
                                  <option key='1' value='1'>Active</option>
                              </select>
                              : <select id="selectFlag" name="selectFlag" className="browser-default " defaultValue={'DEFAULT'} onChange={this.handleFlagChange}>
                                {/* <option value="DEFAULT" disabled >Select Flag </option> */}
                                  <option key='0' value='0'>Inactive</option>
                                  <option key='1' value='1'>Active</option>
                              </select>
                          }
                          <label>Select Flag</label>

                        </div>
                      </div>
                    </Col>
                  </Row>

                </form>
              </Col>
            </Row>
          </div>
          <div className="modal-footer">
            {/* <a href="#!" className="modal-close waves-effect waves-green btn-flat">Agree</a> */}

            <ButtonGroup className="mr-2" aria-label="First group">
              <Button id='cancelBrokerBtn' variant="outline-secondary" className="mr-4 btn modal-close "  >Cancel</Button>
              {
              this.state.editRow
              ?<Button id="updateBrokerBtn" variant="outline-primary" className="mr-2 btn" onClick = {this.updateBrokerDB}>Update</Button>
              :<Button id="addBrokerBtn" variant="outline-primary" className="mr-2 btn" onClick={this.addBrokerToDB}> Add</Button>
              }   
            </ButtonGroup>

          </div>
        </div>

        <div className="">
          <Row>
            <Col xs={12} md={12} lg={12} >
              <div className="tableheight">
                {table_render}
              </div>
            </Col>

          </Row>
          <Row>
            <Col >

              <Nav className="right">
                <Nav.Link className="red-text modal-trigger " href="" onClick={this.openAddBrokerModal}>
                  Add Broker Details<Image className="red-text mr-auto" src="assets/images/plus-circle-red-m.svg" /></Nav.Link>
              </Nav>


            </Col>
          </Row>
        </div>


      </Fragment>
    )
  }

}


export default BrokerFrag;