
import React, { Component, Fragment } from 'react';
import { base_url } from '../../globalConstants'
import { Table, Row, Col, Image, Nav, ButtonGroup, Button } from 'react-bootstrap';
import M from "materialize-css";
import { EditOutlined } from "@material-ui/icons";
import Axios from "axios";
import './addWarehouse.css';


class WarehouseFrag extends Component {


  constructor(props) {
    super(props);
    this.state = ({
      warehouseId: "", warehouseName: "", address: "",
      countryId: "", warehouseState: "", city: "", zipcode: "", 
      warehousedata: this.props.warehousedata,
      countrylist: this.props.countrylist, countrycodelist: this.props.country_code_list,
      statedata: this.props.statedata, stateCode_list: [], stateName_list:[],
      statelist: [], stateSelectOptions: [],
      countryName:"", mainId:"", keyId:"", stateCode:"", warehouseStateId:"", stateCodeDict:{}, tempStateList: {},
      editRow: false
    })

    console.log("in constructor")
    console.log(this.state.countrylist)
    console.log(this.state.countrycodelist)
    console.log("statedata: ",this.state.statedata)
   
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

  handleWareHouseIdChange = (e) => {
    this.setState({ warehouseId: e.target.value })
  }
  handleWareHouseNameChange = (e) => {
    this.setState({ warehouseName: e.target.value })
  }
  handleAddressChange = (e) => {
    this.setState({ address: e.target.value })
  }
  handleUnitchargeChange = (e) => {
    this.setState({ unitCharge: e.target.value })
  }
  handleStateChange = (e) => {
    console.log("state of ware house", e.target.value)
    this.setState({ warehouseState: e.target.value })
    console.log(this.state.warehouseState);
  }

  handleCityChange = (e) => {
    this.setState({ city: e.target.value })
  }
  handleZipCodeChange = (e) => {
    this.setState({ zipcode: e.target.value })
  }

//EDIT OPTION START
handleEditOption = (e) => {
  this.setState({editRow:true})
  var elems = document.getElementById("addWareHouseModal");
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

              console.log(data);

              let country_name = this.state.countrylist[this.state.countrycodelist.indexOf(data[6])]
              console.log("Country name", country_name);

              const statesOnEdit = this.state.statedata[this.state.countrylist.indexOf(country_name)].slice()
              console.log(`States for the country ${country_name}:`)
              console.log(statesOnEdit);

              let stateNameCodeDict = {}
              for (var key in statesOnEdit) {              
                stateNameCodeDict[statesOnEdit[key].state_code] = statesOnEdit[key].state_name
              }
             console.log("stateNameCodeDict: ",stateNameCodeDict );

             console.log(`state name for state code ${data[5]} is`,stateNameCodeDict[data[5]] );
             
             let selStateName = stateNameCodeDict[data[5]]
             console.log(selStateName); 

              this.setState({mainId: data[0], keyId: data[1]})
              this.setState({
                countryName: country_name, warehouseState: selStateName, city: data[4], 
                warehouseId: data[1], warehouseName: data[2], 
                address: data[3], zipcode: data[7]
              })

              console.log(this.state.warehouseId);
              console.log(this.state.warehouseName);
              console.log(this.state.address);
              console.log(this.state.city);
              console.log(this.state.zipcode);
              console.log(this.state.countryName);
              console.log(this.state.warehouseState);

}
openAddWarehouseDetailsModal =  ()=>{
  this.setState({editRow:false})

  var elems = document.getElementById("addWareHouseModal");
  var instance = M.Modal.init(elems);
  instance.open()
    
}
closeModal = ()=>{
  var elems = document.getElementById("addWareHouseModal");
  var instance = M.Modal.init(elems);
  instance.close();
  this.setState({editRow:false})
  this.setState({
    warehouseId: "", warehouseName: "", address: "",
    countryId: "", countryName:"", warehouseState: "", city: "", 
    warehouseStateId:"", zipcode: "", error:""
  })
}
updateWarehouseDetailsDB = async () => {

  let country_code = this.state.countrycodelist[this.state.countrylist.indexOf(this.state.countryName)]
  let url = base_url+`warehouses/${this.state.keyId}/`

  // console.log(this.state.statename + this.state.statecode + this.state.countryname)
  var warehouseformdata = new FormData()
  warehouseformdata.append("warehouse_id", this.state.warehouseId)
  warehouseformdata.append("name", this.state.warehouseName)
  warehouseformdata.append("address", this.state.address)
  warehouseformdata.append("city", this.state.city)
  warehouseformdata.append("zipcode", this.state.zipcode)
  warehouseformdata.append("country", country_code)
  warehouseformdata.append("state", this.state.warehouseState)
  warehouseformdata.append("status", "Active")

  // @Todo: APi to be called to save data for state

  try {
    let token = localStorage.getItem("token")
    var config = {
      headers: { 'Content-Type': 'multipart/form-data' , 'Authorization':'Token '+token},
      
    };
    const response = await Axios.put(url, warehouseformdata, config)
    
    let itemIndex = parseInt(this.state.mainId) - 1
    this.state.warehousedata.splice(itemIndex, 1, response.data)
    
    // this.state.warehousedata.unshift(response.data)
    var elem = document.getElementById('addWareHouseModal')
    var instance = M.Modal.getInstance(elem);
    instance.close();
    M.toast({ html: 'Updated Warehouse Successfully.' , classes: "white-text orange rounded" })
    this.setState({
      warehouseId: "", warehouseName: "", address: "", countryName:"",
      countryId: "", warehouseState: "", city: "", zipcode: ""
    })
    this.setState({
      error: "",
      editRow: false
    })
  } catch (err) {
    this.setState({
      error: "OH Snap! Something is Wrong.Please try again",
      editRow: false
    })
    M.toast({ html: 'Please Try Again!', classes: "white-text red rounded" });

    console.log(err.message)
  }

}
//EDIT OPTION END

  addWareHouseToDB = async () => {
    // console.log(this.state.countryname + this.state.markup + this.state.rangeFinal)

    let state_code = this.state.countrycodelist[this.state.countrylist.indexOf(this.state.warehouseState)]
    console.log(state_code);

    var warehouseformdata = new FormData()
    warehouseformdata.append("warehouse_id", this.state.warehouseId)
    warehouseformdata.append("name", this.state.warehouseName)
    warehouseformdata.append("address", this.state.address)
    warehouseformdata.append("city", this.state.city)
    warehouseformdata.append("zipcode", this.state.zipcode)
    warehouseformdata.append("country", this.state.countryId)
    warehouseformdata.append("state", this.state.warehouseState)
    warehouseformdata.append("status", "Active")

    console.log(this.state.warehouseState);

    try {

      let token = localStorage.getItem("token")
      let url = base_url+'warehouses/'  

      var config = {
        headers: { 
        'Content-Type': 'multipart/form-data' , 
        'Authorization':'Token '+ token},        
      };
      const response = await Axios.post(url, warehouseformdata, config)
      this.state.warehousedata.unshift(response.data)

      var elem = document.getElementById('addWareHouseModal')
      var instance = M.Modal.getInstance(elem);
      instance.close();
      this.setState({
        warehouseId: "", warehouseName: "", address: "",
        countryId: "", warehouseState: "", city: "", zipcode: "",
        warehouseStateId:"", 
        error:""
      })
      // @Todo: APi to be called to save data for SLAB
      M.toast({ html: 'Added WareHouse Successfully ', classes: "white-text orange rounded" })


    } catch (err) {
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
    var statekey = 0
    const selectCounrtyOptions = this.state.countrylist.map((country) => {
     
      return (
        <option key={uniquekey++} value={country}>{country}</option>
      )
    })
    const selectStateOptions = this.state.statelist.map((state) => {
      console.log("state", state)

      return (

        <option key={"_" + statekey++} value={state.state_id}>{state.state_name}</option>
      )
    })
  
    var sr_no=0
    const warehousetable = this.state.warehousedata.map((warehouse) => {
      sr_no=sr_no+1
      return (
        <Fragment key={sr_no}>
          <tr>
            <td>{sr_no}</td>
            <td>{warehouse.warehouse_id}</td>
            <td>{warehouse.name}</td>
            <td>{warehouse.address}</td>
            <td>{warehouse.city}</td>
            <td>{warehouse.state_name}</td>
            <td>{warehouse.country}</td>
            <td>{warehouse.zipcode}</td>
            <td onClick={this.handleEditOption}><a title = "Edit"><EditOutlined/></a></td>  
            <td className="hide">{warehouse.id}</td>
            <td className="hide"></td>
          </tr>
        </Fragment>

      )
    })
    const table_render = <Table hover >
      <thead>
        <tr>
          <th>Sr.No.</th>
          <th>Warehouse ID</th>
          <th>Warehouse Name</th>
          <th>Address</th>
          <th>City</th>
          <th>State</th>
          <th>Country</th>
          <th>Zipcode</th>
          <th>Edit</th>                 
        </tr>
      </thead>
      <tbody>
        {warehousetable}
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
        <div id="addWareHouseModal" className="modal modal-fixed-footer">
          <div className="modal-content">
          <h4 className="center orange-text"> {this.state.editRow ? "Update Warehouse Details" : "Add Warehouse Details "}</h4>
            <Row>
              <Col xs={12} >
                <form>
                  <p className="center red-text">{this.state.error}</p>

                  <Row>
                    <Col className=" rowdivPading " xs={12}>
                      <div className="input-field col s6 offset-s3 center">
                        <div >

                        {
                          this.state.editRow
                            ? <select id="country_name_select" name="country" className="browser-default " value={this.state.countryName} onChange={this.handleCountryNameChange}>
                              <option value="" disabled >Choose Warehouse Country </option>
                              {selectCounrtyOptions}
                            </select>
                            : <select id="country_name_select" name="country" className="browser-default " defaultValue={'DEFAULT'} onChange={this.handleCountryNameChange}>
                              <option value="DEFAULT" disabled >Choose Warehouse Country </option>
                              {selectCounrtyOptions}
                            </select>
                            }
                          <label>Select Country</label>

                        </div>
                      </div>  </Col>
                  </Row>

                  <Row>
                    <Col className=" rowdivPading " xs={12}>
                      <div className="input-field col s6 offset-s3 center">
                        <div>

                          {
                            this.state.editRow
                              ? <select id="state_name_select" name="stateName" className="browser-default " value={this.state.warehouseState} onChange={this.handleStateChange}>
                                <option value="" disabled >Choose WareHouse state </option>
                                {selectStateOptions}
                              </select>
                              : <select id="state_name_select" name="stateName" className="browser-default " defaultValue={'DEFAULT'} onChange={this.handleStateChange}>
                                <option value="DEFAULT" disabled >Choose WareHouse state </option>
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
                        <input name="warehousecity" id="warehouse_city" type="text" value={this.state.city} onChange={this.handleCityChange} className="" />
                        <label htmlFor="warehousecity" className="black-text">Enter Warehouse City</label>
                        <span className="helper-text left" data-error="wrong" data-success="">Warehouse City Ex: Miami</span>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name-="warehouseid" id="warehouse_id" className="materialize-textarea" type="text" value={this.state.warehouseId}
                         onChange={this.handleWareHouseIdChange} />
                        <label htmlFor="warehouse_id" className="black-text">Enter Warehouse ID</label>
                        <span className="helper-text left" data-error="wrong" data-success="">Unique Warehouse ID ex: WAR_001</span>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name="warehousename" id="warehouse_name" type="text" value={this.state.warehouseName} onChange={this.handleWareHouseNameChange} className="" />
                        <label htmlFor="warehouse_name" className="black-text">Enter WareHouse Name</label>
                        <span className="helper-text left" data-error="wrong" data-success="">Unique WareHouse Name ex: EzzyShip Warehouse_1</span>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name="warehouseaddress" id="warehouse_address" type="text" value={this.state.address} onChange={this.handleAddressChange} className="" />
                        <label htmlFor="warehouse_address" className="black-text">Enter WareHouse Address</label>
                        <span className="helper-text left" data-error="wrong" data-success="">Warehouse Address Ex: 112281 SW 133nd CT, Miami,FL</span>
                      </div>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name="warehousezipcode" id="warehouse_zipcode" type="text" value={this.state.zipcode} onChange={this.handleZipCodeChange} className="" />
                        <label htmlFor="warehouse_zipcode" className="black-text">Enter Warehouse Zipcode</label>
                        <span className="helper-text left" data-error="wrong" data-success="">Warehouse Zipcode Ex: 33186</span>
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
              <Button id='cancelWareHouseBtn' variant="outline-secondary" className="mr-4 btn modal-close "  >Cancel</Button>
              {
              this.state.editRow
              ?<Button id="updateWareHouseBtn" variant="outline-primary" className="mr-2 btn" onClick = {this.updateWarehouseDetailsDB}>Update</Button>
              :<Button id="addWareHouseBtn" variant="outline-primary" className="mr-2 btn" onClick={this.addWareHouseToDB}> Add</Button>
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
                <Nav.Link className="red-text modal-trigger " onClick={this.openAddWarehouseDetailsModal}>
                  Add WareHouse Details<Image className="red-text mr-auto" src="assets/images/plus-circle-red-m.svg"  /></Nav.Link>
              </Nav>
            </Col>
          </Row>
        </div>


      </Fragment>
    )
  }

}


export default WarehouseFrag;