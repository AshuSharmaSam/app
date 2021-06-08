
import React, { Component, Fragment } from 'react';
import { base_url } from '../../globalConstants';
import { Table, Row, Col, Image, Nav, ButtonGroup, Button } from 'react-bootstrap';
import M from "materialize-css";
import { EditOutlined } from "@material-ui/icons";
import Axios from 'axios';
import './addwarehouseowner.css';


export default class WarehouseOwnerFrag extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      warehouseId: "", 
      warehouseOwnerName: "", 
      warehouseState: "",
      city: "", 
      countryId: "", 
      ownerAddressLine1: "",  
      ownerAddressLine2: "",  
      ownerEmailID:"",
      ownerContactNumber:"",
      warehouseOwnerDetails: this.props.warehouse_ownerdata ,      
      warehouseIdList:this.props.warehouseIDList,
      warehouseOwnerIdList:this.props.warehouse_ownerid_list,
      countrylist: this.props.countrylist,       
      countrycodelist: this.props.country_code_list, 
      statedata: this.props.statedata,
      statelist: [], 
      stateSelectOptions: [],
      error: "",
      editRow: false,
      warehouseCountry:"",
      ownerId:"",
      mainId:"",
      url_id:''
      //change name address1:[],
      // address2:[],
    })

    console.log("in constructor")
    console.log(this.state.warehouseIdList)
    console.log(this.state.countrylist)
    console.log(this.state.countrycodelist)
    console.log(this.state.statedata)

  }

  handleCountryNameChange = (e) => {

    let selected_countryId = this.state.countrycodelist[this.state.countrylist.indexOf(e.target.value)]

    const states = this.state.statedata[this.state.countrylist.indexOf(e.target.value)].slice()

    this.setState({ warehouseCountry: e.target.value})
    this.setState({ countryId: selected_countryId})
    this.setState({ statelist: states})
  }
  
  handleWarehouseIdChange = async (e) => {
    console.log("WarehouseID selected:- " + e.target.value)

    // let selected_warehouseId = this.state.warehouseIdList[this.state.warehouseOwnerDetails.indexOf(e.target.value)]

    

    this.setState({ warehouseId: e.target.value})

  }
  handleCountryIdChange = (e) => {
    console.log("country selected:- " + e.target.value)
    // this.setState({countryname:e.target.value})
    let selected_countryId = this.state.countrycodelist[this.state.countrylist.indexOf(e.target.value)]
    const states = this.state.statedata[this.state.countrylist.indexOf(e.target.value)].slice()

    this.setState({ countryId: selected_countryId, statelist: states })
    // this.setState({statelist:states})
    console.log("state list")
    console.log(this.state.statelist)
  }

  handleStateChange = (e) => {
    console.log("state of ware house", e.target.value)
    this.setState({ warehouseState: e.target.value })
  }

  handleCityChange = (e) => {
    this.setState({ city: e.target.value })
  }

  handleWarehouseOwnerId = (e) => {
    this.setState({ ownerId: e.target.value })
  }
  handleWarehouseOwnerName = (e) => {
    this.setState({ warehouseOwnerName: e.target.value })
  }
  handleOwnerAddressLine1 = (e) => {
    this.setState({ ownerAddressLine1: e.target.value })
    // this.state.address1.push(this.state.ownerAddressLine1);
  }
  handleOwnerAddressLine2 = (e) => {
    this.setState({ ownerAddressLine2: e.target.value })
  }
  handleOwnerEmailID = (e) => {
    this.setState({ ownerEmailID: e.target.value })
  }

  handleContactNumber = (e) => {
    this.setState({ ownerContactNumber: e.target.value })
  }

//EDIT OPTION START
handleEditOption = (e) => {
  this.setState({editRow:true})
  var elems = document.getElementById("addWarehouseOwnerModal");
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
              let country_name = this.state.countrylist[this.state.countrycodelist.indexOf(data[3])]
              // let state_name = this.state.statedata[this.state.countrycodelist.indexOf(data[3])]  
              // let owner_id = this.state.statedata[this.state.countrycodelist.indexOf(data[3])]  
                            
              // console.log(this.state.address1);
              console.log(data);

              this.setState({mainId: data[0], ownerId: data[1], url_id: data[12]  });
              // let add1 = this.state.address1[data[0]]
              // console.log(add1);
              this.setState({
                  warehouseId: data[2],
                  warehouseCountry: country_name,
                  warehouseState: data[13],
                  city: data[5],
                  warehouseOwnerName: data[6],
                  ownerAddressLine1: data[7],
                  ownerAddressLine2: data[8],
                  ownerEmailID: data[9],
                  ownerContactNumber: data[10],                                  
                })
              // this.setState({
              //   warehouseId: data[1],
              //   countryId: data[2],
              //   city: data[3],
              //   warehouseOwnerName: data[4],
              //   ownerAddressLine1: "",
              //   ownerAddressLine2: "",
              //   ownerEmailID: data[6],
              //   ownerContactNumber: data[7],
              //   warehouseCountry:country_name,
              // })
              console.log(data[5]);
              // console.log(country_name);
              // console.log(data[5]);

}
openWarehouseOwnerModal =  ()=>{
  this.setState({editRow:false})

  var elems = document.getElementById("addWarehouseOwnerModal");
  var instance = M.Modal.init(elems);
  instance.open()
        
}
closeModal = ()=>{
  var elems = document.getElementById("addWarehouseOwnerModal");
  var instance = M.Modal.init(elems);
  instance.close();
  this.setState({editRow:false, error:""})
  this.setState({
    warehouseId: "",
    countryId: "",
    city: "",
    warehouseOwnerName: "",
    ownerAddressLine1: "",
    ownerAddressLine2: "",
    ownerEmailID: "",
    ownerContactNumber: "",
    warehouseCountry:"",
    warehouseState:"",
    ownerId:""
  })
}
updateOwnerDetailsDB = async () => {

  let country_code = this.state.countrycodelist[this.state.countrylist.indexOf(this.state.warehouseCountry)]
  let url = base_url+`warehouse_owner/${this.state.url_id}/`


    var warehouseOwnerformdata = new FormData()
    warehouseOwnerformdata.append("warehouse_id", this.state.warehouseId)
    warehouseOwnerformdata.append("owner_id", this.state.ownerId)
    warehouseOwnerformdata.append("country_id", country_code)
    warehouseOwnerformdata.append("state", this.state.warehouseState)
    warehouseOwnerformdata.append("city", this.state.city)
    warehouseOwnerformdata.append("name", this.state.warehouseOwnerName)
    warehouseOwnerformdata.append("address1", this.state.ownerAddressLine1)
    warehouseOwnerformdata.append("address2", this.state.ownerAddressLine2)
    warehouseOwnerformdata.append("email", this.state.ownerEmailID)
    warehouseOwnerformdata.append("phone_number", this.state.ownerContactNumber)



  // @Todo: APi to be called to save data for state

  try {
    let token = localStorage.getItem("token")
    var config = {
      headers: { 'Content-Type': 'multipart/form-data' , 'Authorization':'Token '+token},
      
    };
    const response = await Axios.put(url, warehouseOwnerformdata, config)

    let itemIndex = parseInt(this.state.mainId) - 1
    this.state.warehouseOwnerDetails.splice(itemIndex, 1, response.data)

    var elem = document.getElementById('addWarehouseOwnerModal')
    var instance = M.Modal.getInstance(elem);
    instance.close();
    M.toast({ html: 'Updated Owner Details Successfully.' , classes: "white-text orange rounded" })
    this.setState({
      warehouseId: "",
      countryId: "",
      city: "",
      warehouseOwnerName: "",
      ownerAddressLine1: "",
      ownerAddressLine2: "",
      ownerEmailID: "",
      ownerContactNumber: "",
      warehouseCountry:"",
      warehouseState:"",
      ownerId:""
    })
    this.setState({
      error: "",
      editRow: false
    })
  } catch (err) {
    this.setState({
      error: "OH Snap! Something is Wrong.Please try again",
      editRow: true
    })
    M.toast({ html: 'Please Try Again!', classes: "white-text red rounded" });

    console.log(err.message)
  }

}
//EDIT OPTION END

   addWarehouseOwnerToDB = async () => {

    console.log("warehouse_id", this.state.warehouseId)
    console.log("country", this.state.countryId)
    console.log("state", this.state.state)
    console.log("state_name", this.state.state_name)
    console.log("city", this.state.city)
    console.log("name", this.state.warehouseOwnerName)
    console.log("address_line_1", this.state.ownerAddressLine1)
    console.log("address_line_2", this.state.ownerAddressLine2)
    console.log("email_address", this.state.ownerEmailID)
    console.log("contact_number", this.state.ownerContactNumber)

    let url = base_url+'warehouse_owner/'  

    // const {data} = await Axios.get(url)
    // console.log(data)
    // this.setState({ ownerDetails: data })   
    // console.log(this.state.ownerDetails);

    var warehouseOwnerformdata = new FormData()
    warehouseOwnerformdata.append("warehouse_id", this.state.warehouseId)
    warehouseOwnerformdata.append("owner_id", this.state.ownerId)
    warehouseOwnerformdata.append("country_id", this.state.countryId)
    warehouseOwnerformdata.append("state", this.state.warehouseState)
    warehouseOwnerformdata.append("city", this.state.city)
    warehouseOwnerformdata.append("name", this.state.warehouseOwnerName)
    warehouseOwnerformdata.append("address1", this.state.ownerAddressLine1)
    warehouseOwnerformdata.append("address2", this.state.ownerAddressLine2)
    warehouseOwnerformdata.append("email", this.state.ownerEmailID)
    warehouseOwnerformdata.append("phone_number", this.state.ownerContactNumber)
    // warehouseOwnerformdata.append("status", "Active")

    try {
      let token = localStorage.getItem("token")
      var config = {
        headers: { 
        'Content-Type': 'multipart/form-data' , 
        'Authorization':'Token '+token},
        
      };

      const response = await Axios.post(url, warehouseOwnerformdata, config)
      this.state.warehouseOwnerDetails.unshift(response.data)

      var elem = document.getElementById('addWarehouseOwnerModal')
      var instance = M.Modal.getInstance(elem);
      instance.close();
      this.setState({
        warehouseId: "",
        countryId: "",
        city: "",
        warehouseOwnerName: "",
        ownerAddressLine1: "",
        ownerAddressLine2: "",
        ownerEmailID: "",
        ownerContactNumber: "",
        warehouseCountry:"",
        warehouseState:"",
        error: "",
        ownerId:""
      })
      M.toast({ html: 'Added Owner Successfully ', classes: "white-text orange rounded" })


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
    var warehouseIDkey = 0
    var countrykey = 0
    var statekey = 0

    const selectWarehouseIDOptions = this.state.warehouseIdList.map((wID) => {

      return (
        <option key={warehouseIDkey++} value={wID}>{wID}</option>
      )
    })

    const selectCounrtyOptions = this.state.countrylist.map((country) => {

      return (
        <option key={countrykey++} value={country}>{country}</option>
      )
    })

    const selectStateOptions = this.state.statelist.map((state) => {
      // console.log("state", state)
      return (

        <option key={"_" + statekey++} value={state.state_id}>{state.state_name}</option>
      )
    })

    var sr_no= 0;
    let address;
    const WarehouseOwnerTable = this.state.warehouseOwnerDetails.map((owner) => {
      sr_no=sr_no+1;
      // address = owner.address2 === null ? owner.address1 : owner.address1 + " " + owner.address2;
      // this.state.address1.push(owner.address1);
      // this.state.address2 = owner.address2 ;
      
      return (
        <Fragment key = {sr_no}>
          <tr >
            <td>{sr_no}</td>
            <td>{owner.owner_id}</td>
            <td>{owner.warehouse_id}</td>
            <td>{owner.country_id}</td>
            <td>{owner.state_name}</td>
            <td>{owner.city}</td>
            <td>{owner.name}</td>
            {/* <td>{address}</td> */}
            <td>{owner.address1}</td>
            <td>{owner.address2}</td>
            {/* <td>{owner.address2 === null ? owner.address1 : owner.address1 + owner.address2}</td> */}
            <td>{owner.email}</td>
            <td>{owner.phone_number}</td>
            <td onClick={this.handleEditOption}><a title="Edit"><EditOutlined /></a></td>
            <td className="hide">{owner.id}</td>
            <td className="hide">{owner.state}</td>
          </tr>
        </Fragment>

      )
    })

    const table_render = <Table hover >
      <thead>
        <tr>
          <th>Sr.No.</th>
          <th>Owner ID</th>
          <th>Warehouse ID</th>
          <th>Country ID</th>
          <th>State Name</th>
          <th>City</th>
          <th>Owner Name</th>
          <th>Address Line 1</th>
          <th>Address Line 2</th>
          <th>Owner EmailID</th>
          <th>Owner Phone No.</th>
          <th>Edit</th>
         
        </tr>
      </thead>
      <tbody>
            {WarehouseOwnerTable}
      </tbody>
    </Table>

    return (
      <Fragment>
        <br></br>
        <br></br>
       
      


        {/* <!-- Modal Trigger --> */}
        <div id="addWarehouseOwnerModal" className="modal modal-fixed-footer">
          <div className="modal-content">
            
            
          <h4 className="center orange-text"> {this.state.editRow ? "Update Owner Details" : "Add New Warehouse Owner"}</h4>


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
                            ? <select id="warehouse_id_select" name="warehouseid" className="browser-default warehouseID_select" value={this.state.warehouseId} onChange={this.handleWarehouseIdChange}>
                              <option value="" disabled >Choose WarehouseID </option>
                              {selectWarehouseIDOptions}

                            </select>
                            : <select id="warehouse_id_select" name="warehouseid" className="browser-default warehouseID_select" defaultValue={'DEFAULT'} onChange={this.handleWarehouseIdChange}>
                              <option value="DEFAULT" disabled >Choose WarehouseID </option>
                              {selectWarehouseIDOptions}

                            </select>
                          }
                          <label>Select WarehouseID</label>

                        </div>
                      </div>  
                    </Col>
                  </Row>

                  <Row>
                    <Col className=" rowdivPading " xs={12}>
                      <div className="input-field col s6 offset-s3 center">
                        <div >
                        {
                            this.state.editRow
                            ? <select id="warehouseCountry_select" name="country_name" className="browser-default country_name_select" value={this.state.warehouseCountry} onChange={this.handleCountryNameChange}>
                              <option value="" disabled >Choose WareHouse Country </option>
                              {selectCounrtyOptions}

                            </select>
                            : <select id="warehouseCountry_select" name="country_name" className="browser-default country_name_select" defaultValue={'DEFAULT'} onChange={this.handleCountryNameChange}>
                              <option value="DEFAULT" disabled >Choose WareHouse Country </option>
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
                            ? <select id="warehouseState_select" name="" className="browser-default " value={this.state.warehouseState} onChange={this.handleStateChange}>
                              <option value="" disabled >Choose WareHouse state</option>
                              {selectStateOptions}
                            </select>
                            : <select id="warehouseState_select" name="" className="browser-default " defaultValue={'DEFAULT'} onChange={this.handleStateChange}>
                              <option value="DEFAULT" disabled >Choose WareHouse state</option>
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
                        <input name="warehousecity" id="warehouse_city" type="text" className="" value={this.state.city} 
                        onChange={this.handleCityChange} />
                        <label htmlFor="warehouse_city" className="black-text active">Enter Warehouse City</label>
                        <span className="helper-text left" data-error="wrong" data-success="">Warehouse City Ex: Miami</span>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name-="warehouseOwnerId" id="warehouseOwner_Id" className="materialize-textarea" type="text" value={this.state.ownerId} 
                         onChange={this.handleWarehouseOwnerId} />
                        <label htmlFor="warehouseOwner_Id" className="black-text active">Enter Warehouse Owner Id</label>
                        <span className="helper-text left" data-error="wrong" data-success=""></span>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name-="warehouseOwnerName" id="warehouseOwner_Name" className="materialize-textarea" type="text" value={this.state.warehouseOwnerName} 
                         onChange={this.handleWarehouseOwnerName} />
                        <label htmlFor="warehouseOwner_Name" className="black-text active">Enter Warehouse Owner Name</label>
                        <span className="helper-text left" data-error="wrong" data-success=""></span>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name-="owner_AddressLine1" id="ownerAddressLine1" className="materialize-textarea" type="text" value={this.state.ownerAddressLine1} 
                         onChange={this.handleOwnerAddressLine1} />
                        <label htmlFor="ownerAddressLine1" className="black-text active">Address Line 1</label>
                        <span className="helper-text left" data-error="wrong" data-success=""></span>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name-="owner_AddressLine2" id="ownerAddressLine2" className="materialize-textarea" type="text" value={this.state.ownerAddressLine2} 
                         onChange={this.handleOwnerAddressLine2}  />
                        <label htmlFor="ownerAddressLine2" className="black-text active">Address Line 2</label>
                        <span className="helper-text left" data-error="wrong" data-success=""></span>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name-="owner_EmailID" id="ownerEmailID" className="materialize-textarea" type="email" value={this.state.ownerEmailID}
                         onChange={this.handleOwnerEmailID}  />
                        <label htmlFor="ownerEmailID" className="black-text active ">Enter Email ID</label>
                        <span className="helper-text left" data-error="wrong" data-success=""></span>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name-="owner_ContactNumber" id="ownerContactNumber" className="materialize-textarea" type="text"  value={this.state.ownerContactNumber}
                          onChange={this.handleContactNumber} />
                        <label htmlFor="ownerContactNumber" className="black-text active">Enter Contact Number</label>
                        <span className="helper-text left" data-error="wrong" data-success=""></span>
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
              <Button id='cancelOwnerBtn' variant="outline-secondary" className="mr-4 btn modal-close "  >Cancel</Button>
              {
              this.state.editRow
              ?<Button id="updateOwnerBtn" variant="outline-primary" className="mr-2 btn" onClick = {this.updateOwnerDetailsDB}>Update</Button>
              :<Button id="addOwnerBtn" variant="outline-primary" className="mr-2 btn" onClick={this.addWarehouseOwnerToDB}> Add</Button>
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
                <Nav.Link className="red-text modal-trigger " href="" onClick={this.openWarehouseOwnerModal}>
                  Add Owners Details<Image className="red-text mr-auto" src="assets/images/plus-circle-red-m.svg"  /></Nav.Link>
              </Nav>


            </Col>
          </Row>
        </div>


      </Fragment>
    )
  }

}


