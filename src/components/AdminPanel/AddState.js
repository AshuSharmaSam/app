
import React, { Component, Fragment, useState } from 'react';
import { base_url } from '../../globalConstants'
import { Table, Row, Col, Image, Nav, ButtonGroup, Button } from 'react-bootstrap';
import M from "materialize-css";
import { EditOutlined } from "@material-ui/icons";
import Axios from 'axios';
import Error from './Error';
// import AddCountry from './CountryModal';
import './addstate.css';




class StateFrag extends Component {

  constructor(props) {
    super(props);
    // let countries = this.props.countrylist.map((item)=>{
    // //   "  {
    // //     "country_id_name": {
    // //         "Antigua": "AT"
    // //     },
    // //     "country_name": "Antigua"
    // // }"
    // item.country_name

    // })

    


    this.state = ({
      countryname: "", statecode: "", statename: "", countrylist: this.props.countrylist,
      statedata: this.props.statedata, countrycodelist: this.props.country_code_list, error: "",
      editRow: false, state_id: "", stateRealId:""
    })

    console.log("statedata:",this.props.statedata);

  }
  handleCountryNameChange = (e) => {
    this.setState({ countryname: this.state.countrycodelist[this.state.countrylist.indexOf(e.target.value)] })

    console.log("country selected "+e.target.value, this.state.countrycodelist[this.state.countrylist.indexOf(e.target.value)])
  }

  handleStateCodeChange = (e) => {
    this.setState({ statecode: e.target.value })
  }
  handleStateNameChange = (e) => {
    this.setState({ statename: e.target.value })
  }  

  
  //EDIT OPTION START
  handleEditOption = (e) => {
    // alert("done")

    this.setState({editRow:true})
  

    var elems = document.getElementById("addStateModal");
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
                this.setState({countryname: country_name, statecode: data[1], statename: data[2]})
                this.setState({state_id: data[0]})
                this.setState({stateRealId: data[5]})
                
                console.log(data);

                console.log(this.state.countrycodelist)
                console.log(data[3])
                console.log(this.state.countrycodelist.indexOf(data[3]));
                console.log(this.state.countrylist);

                console.log(country_name);               

  }   

  openAddStateModal =  ()=>{
    this.setState({editRow:false})

    var elems = document.getElementById("addStateModal");
    var instance = M.Modal.init(elems);
    instance.open()
      
  }
  closeModal = ()=>{
    var elems = document.getElementById("addStateModal");
    var instance = M.Modal.init(elems);
    instance.close();
    this.setState({editRow:false})
  }

  updateStateDB = async () => {

    let country_code = this.state.countrycodelist[this.state.countrylist.indexOf(this.state.countryname)]
    let url = base_url+`states/${this.state.stateRealId}/`

    console.log(this.state.statename + this.state.statecode + this.state.countryname)
    var stateformdata = new FormData()
    stateformdata.append("country", country_code)
    stateformdata.append("name", this.state.statename)
    stateformdata.append("state_code", this.state.statecode)
    stateformdata.append("status", "Active")



    // @Todo: APi to be called to save data for state

    try {
      let token = localStorage.getItem("token")
      var config = {
        headers: { 'Content-Type': 'multipart/form-data' , 'Authorization':'Token '+token},
        
      };
      const response = await Axios.put(url, stateformdata, config)

      let itemIndex = parseInt(this.state.state_id) - 1
      this.state.statedata.splice(itemIndex, 1, response.data)
      
      this.setState({ countryname: "", statecode: "", statename: "" })
      var elem = document.getElementById('addStateModal')
      var instance = M.Modal.getInstance(elem);
      instance.close();
      M.toast({ html: 'Updated state Successfully.' , classes: "white-text orange rounded" })

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


  addStateToDB = async () => {
    console.log(this.state.statename + this.state.statecode + this.state.countryname)
    var stateformdata = new FormData()
    stateformdata.append("country", this.state.countryname)
    stateformdata.append("name", this.state.statename)
    stateformdata.append("state_code", this.state.statecode)
    stateformdata.append("status", "Active")



    // @Todo: APi to be called to save data for state

    try {
      let token = localStorage.getItem("token")
      var config = {
        headers: { 'Content-Type': 'multipart/form-data' , 'Authorization':'Token '+token},
        
      };
      const response = await Axios.post(base_url+'states/', stateformdata,
      config)
      this.state.statedata.unshift(response.data)
      this.setState({ countryname: "", statecode: "", statename: "" })
      var elem = document.getElementById('addStateModal')
      var instance = M.Modal.getInstance(elem);
      instance.close();
      M.toast({ html: 'Added state Successfully. Please see Updated Table', classes: "white-text orange rounded" })

      this.setState({
        error: ""
      })
    } catch (err) {
      this.setState({
        error: "OH Snap! Something is Wrong.Please try again"
      })
      M.toast({ html: 'Please Try Again!', classes: "white-text red rounded" });

      console.log(err.message)
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

    var sr_no = 0;
    const statetable = this.state.statedata.map((state) => {
      // console.log(state.id)
      sr_no=sr_no+1
      return (
        <Fragment key={sr_no}>
          <tr  >
            <td>{sr_no}</td>
            <td>{state.state_code}</td>
            <td>{state.name}</td>
            <td>{state.country}</td>
            <td onClick={this.handleEditOption}><a title = "Edit"><EditOutlined/></a></td>
            <td className="hide">{state.id}</td>
          </tr>
        </Fragment>

      )
    })

    const table_render = <Table hover >
      <thead>
        <tr>
          <th>Sr.No.</th>
          <th>State Code</th>
          <th>State Name</th>
          <th>Country</th>
          <th>Edit</th>

        </tr>
      </thead>
      <tbody>
        {statetable}

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
        <div id="addStateModal" className="modal modal-fixed-footer">
          <div className="modal-content">
            
          <h4 className="center orange-text"> {this.state.editRow ? "Update State" : "Add State "}</h4>
            <Row>
              <Col xs={12} >
                <form>
                  <p className="center red-text">{this.state.error}</p>

                  <Row>
                    <Col className=" rowdivPading " xs={12}>
                      {/* <div className="input-field col s6 offset-s3 center">
                      <input id="country_name_select" type="text" value={this.state.countryname} onChange={this.handleCountryNameChange} className=""/>
                      <label htmlFor="country_name_select" className="black-text" >Country Name</label>
                      <span className="helper-text left" data-error="wrong" data-success="">Enter a valid Country Name</span>
                      </div> */}

                      <div className="input-field col s6 offset-s3 center">
                        <div id=''>
                        {this.state.editRow
                        ?<select id="selectCountry" className="browser-default country_name_select" value={this.state.countryname} onChange={this.handleCountryNameChange}>
                        <option value="" disabled >Choose your Country </option>
                        {selectCounrtyOptions}

                      </select>
                        :<select id="selectCountry" className="browser-default country_name_select" onChange={this.handleCountryNameChange}>
                            <option value="" disabled >Choose your Country </option>
                            {selectCounrtyOptions}

                          </select>}
                          <label>Select Country</label>

                        </div>
                      </div>

                    </Col>
                  </Row>

                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input id="state_name" type="text" value={this.state.statename} onChange={this.handleStateNameChange} className="" />
                        <label htmlFor="state_name" className="black-text">Enter State Name</label>
                        <span className="helper-text left" data-error="wrong" data-success=""></span>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input id="state_code" type="text" value={this.state.statecode} onChange={this.handleStateCodeChange} className="" />
                        <label htmlFor="state_code" className="black-text">Enter State Code</label>
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
              <Button id='cancelStatebtn' variant="outline-secondary" className="mr-4 btn modal-close " onClick={this.closeModal} >Cancel</Button>
              {this.state.editRow?<Button id="updateStateBtn" variant="outline-primary" className="mr-2 btn" onClick = {this.updateStateDB}>Update</Button>:<Button id="addStateBtn" variant="outline-primary" className="mr-2 btn" onClick={this.addStateToDB}> Add</Button>}         
            </ButtonGroup>

          </div>
        </div>        
        <div className="">
          <Row>
            <Col xs={12} md={12} lg={12} >
              <div className="tableheight">
                {/* {this.props.statetable} */}

                {table_render}
              </div>
            </Col>

          </Row>
          <Row>
            <Col >

              <Nav className="right">
                <Nav.Link className="red-text " href="" onClick={this.openAddStateModal}>
                  Add State Details<Image className="red-text ml-1" src="assets/images/plus-circle-red-m.svg" /></Nav.Link>
              </Nav>


            </Col>
          </Row>
        </div>


      </Fragment>

    )
  }

}

export default StateFrag;