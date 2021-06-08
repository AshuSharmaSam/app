
import React, { Component, Fragment } from 'react';
import { base_url } from '../../globalConstants'
import { Table, Row, Col, Image, Nav, ButtonGroup, Button } from 'react-bootstrap';
import M from "materialize-css";
import { EditOutlined } from "@material-ui/icons";
import Axios from 'axios';
import './addfedexconsolidate.css';


export default class FedexConsolidateFrag extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      fedexConsolidatedInvoice_id:"",  
      to: "", cc1: "", cc2: "",cc3: "",
      bcc1: "", bcc2: "",bcc3: "",
      fedexConsolidatedata: this.props.fedexConsolidatedata,
      countrylist: this.props.countrylist, countrycodelist: this.props.country_code_list, error: "",
      editRow: false, countryName:"", mainId:""
    })

  }

  handleCountryNameChange = (e) => {

    let selected_countryId = this.state.countrycodelist[this.state.countrylist.indexOf(e.target.value)]

    this.setState({ countryName: e.target.value})
    this.setState({ countryId: selected_countryId})
  }

  handleTo = (e) => {
    this.setState({ to: e.target.value })
  }
  handleCC1 = (e) => {
    this.setState({ cc1: e.target.value })
  }
  handleCC2 = (e) => {
    this.setState({ cc2: e.target.value })
  }
  handleCC3 = (e) => {
    this.setState({ cc3: e.target.value })
  }
  handleBCC1 = (e) => {
    this.setState({ bcc1: e.target.value })
  }
  handleBCC2 = (e) => {
    this.setState({ bcc2: e.target.value })
  }
  handleBCC3 = (e) => {
    this.setState({ bcc3: e.target.value })
  }
  

  //EDIT OPTION START
  handleEditOption = (e) => {
    this.setState({editRow:true})
    var elems = document.getElementById("addFedexDetailsModal");
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
                let country_name = this.state.countrylist[this.state.countrycodelist.indexOf(data[9])]
                // let country_name = this.state.countrylist[this.state.countrycodelist.indexOf(data[3])]
                
                console.log(data);
                this.setState({
                  fedexConsolidatedInvoice_id: data[1], to: data[2], 
                  cc1: data[3], cc2: data[4],cc3: data[5],
                  bcc1: data[6], bcc2: data[7],bcc3: data[8],
                  countryName: country_name
                })
                this.setState({mainId: data[0]})
                // console.log(country_name);

  }
  openFedexDetailsModal =  ()=>{
    this.setState({editRow:false})

    var elems = document.getElementById("addFedexDetailsModal");
    var instance = M.Modal.init(elems);
    instance.open()
      
  }
  closeModal = ()=>{
    var elems = document.getElementById("addFedexDetailsModal");
    var instance = M.Modal.init(elems);
    instance.close();
    this.setState({editRow:false})
    this.setState({
      fedexConsolidatedInvoice_id:"",  
      to: "", cc1: "", cc2: "",cc3: "",
      bcc1: "", bcc2: "",bcc3: "",
      countryId: "",error:""
    })
  }
  updateFedexDetailsDB = async () => {

    let country_code = this.state.countrycodelist[this.state.countrylist.indexOf(this.state.countryName)]
    let url = base_url+`fedex_consolidate/${this.state.fedexConsolidatedInvoice_id}/`

    // console.log(this.state.statename + this.state.statecode + this.state.countryname)
    var fedexConsolidateformdata = new FormData()
    fedexConsolidateformdata.append("country_id", country_code)
    fedexConsolidateformdata.append("fedex_consolidated_invoice_id", this.state.fedexConsolidatedInvoice_id)
    fedexConsolidateformdata.append("to", this.state.to)
    fedexConsolidateformdata.append("cc_1", this.state.cc1)
    fedexConsolidateformdata.append("cc_2", this.state.cc2)
    fedexConsolidateformdata.append("cc_3", this.state.cc3)
    fedexConsolidateformdata.append("bcc_1", this.state.bcc1)
    fedexConsolidateformdata.append("bcc_2", this.state.bcc2)
    fedexConsolidateformdata.append("bcc_3", this.state.bcc3)



    // @Todo: APi to be called to save data for state

    try {
      let token = localStorage.getItem("token")
      var config = {
        headers: { 'Content-Type': 'multipart/form-data' , 'Authorization':'Token '+token},
        
      };
      const response = await Axios.put(url, fedexConsolidateformdata, config)

      let itemIndex = parseInt(this.state.mainId) - 1
      this.state.fedexConsolidatedata.splice(itemIndex, 1, response.data)      
      
      // this.state.fedexConsolidatedata.unshift(response.data)
      var elem = document.getElementById('addFedexDetailsModal')
      var instance = M.Modal.getInstance(elem);
      instance.close();
      M.toast({ html: 'Updated Fedex Details Successfully.' , classes: "white-text orange rounded" })
      this.setState({
        fedexConsolidatedInvoice_id:"",  
        to: "", cc1: "", cc2: "",cc3: "",
        bcc1: "", bcc2: "",bcc3: "",
        countryId: "",countryName:""
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

  
  addFedexDetailsToDB = async () => {

    let num = Math.floor(Math.random() * Math.floor(10000));

    var fedexConsolidateformdata = new FormData()
    fedexConsolidateformdata.append("country_id", this.state.countryId)
    fedexConsolidateformdata.append("fedex_consolidated_invoice_id", num.toString())
    fedexConsolidateformdata.append("to", this.state.to)
    fedexConsolidateformdata.append("cc_1", this.state.cc1)
    fedexConsolidateformdata.append("cc_2", this.state.cc2)
    fedexConsolidateformdata.append("cc_3", this.state.cc3)
    fedexConsolidateformdata.append("bcc_1", this.state.bcc1)
    fedexConsolidateformdata.append("bcc_2", this.state.bcc2)
    fedexConsolidateformdata.append("bcc_3", this.state.bcc3)

    let url = base_url+'fedex_consolidate/'  
    
    try {
      let token = localStorage.getItem("token")

      var config = {
        headers: { 
        'Content-Type': 'multipart/form-data' , 
        'Authorization':'Token '+ token},        
      };
      
      const response = await Axios.post(url, fedexConsolidateformdata, config)
      this.state.fedexConsolidatedata.unshift(response.data)

      var elem = document.getElementById('addFedexDetailsModal')
      var instance = M.Modal.getInstance(elem);
      instance.close();
      this.setState({
        fedexConsolidatedInvoice_id:"",  
        to: "", cc1: "", cc2: "",cc3: "",
        bcc1: "", bcc2: "",bcc3: "",
        countryId: "",error:""
      })
      // @Todo: APi to be called to save data for SLAB
      M.toast({ html: 'Added Fedex Details Successfully ', classes: "white-text orange rounded" })


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

    const selectCounrtyOptions = this.state.countrylist.map((country) => {

      return (
        <option key={uniquekey++} value={country}>{country}</option>
      )
    })

    var sr_no=0
    const fedextable = this.state.fedexConsolidatedata.map((fedex) => {
      sr_no=sr_no+1 
      return (
        <Fragment key={sr_no}>
          <tr>
            <td>{sr_no}</td>            
            <td>{fedex.fedex_consolidated_invoice_id}</td>
            <td>{fedex.to}</td>            
            <td>{fedex.cc_1}</td>
            <td>{fedex.cc_2}</td>
            <td>{fedex.cc_3}</td>            
            <td>{fedex.bcc_1}</td>
            <td>{fedex.bcc_2}</td>
            <td>{fedex.bcc_3}</td> 
            <td>{fedex.country_id}</td>
            <td><a title = "Edit" onClick={this.handleEditOption}><EditOutlined/></a></td>    
            <td className="hide">{fedex.id}</td>
          </tr>
        </Fragment>

      )
    })

    const table_render = <Table hover >
      <thead>
        <tr>
          <th>Sr.No.</th>
          <th>Fedex Invoice ID</th>
          <th>To.</th>
          <th>CC 1</th>
          <th>CC 2</th>
          <th>CC 3</th>
          <th>BCC 1</th>
          <th>BCC 2</th>
          <th>BCC 3</th> 
          <th>Country ID</th> 
          <th>Edit</th>                 
        </tr>
      </thead>
      <tbody>
        {fedextable}

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
        <div id="addFedexDetailsModal" className="modal modal-fixed-footer">
          <div className="modal-content">

          <h4 className="center orange-text"> {this.state.editRow ? "Update Fedex Details" : "Add Fedex Details"}</h4>

            <h4 className="center orange-text"> </h4>

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
                            ? <select id="countryName_select" name="country_name" className="browser-default countryName_select" value={this.state.countryName} onChange={this.handleCountryNameChange}>
                              <option value="" disabled >Choose WareHouse Country</option>
                              {selectCounrtyOptions}

                            </select>
                            : <select id="countryName_select" name="country_name" className="browser-default countryName_select" defaultValue={'DEFAULT'} onChange={this.handleCountryNameChange}>
                              <option value="DEFAULT" disabled >Choose WareHouse Country</option>
                              {selectCounrtyOptions}

                            </select>
                          }
                          <label>Select Country</label>

                        </div>
                      </div>  
                    </Col>
                  </Row>

                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name-="fedexconsolidateTo" id="fedexconsolidate_To" className="materialize-textarea" type="email" value={this.state.to}
                         onChange={this.handleTo}  />
                        <label htmlFor="fedexconsolidate_To" className="black-text">To</label>
                        <span className="helper-text left" data-error="wrong" data-success=""></span>
                      </div>
                    </Col>
                  </Row> 

                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name-="fedexconsolidateCC1" id="fedexconsolidate_cc1" className="materialize-textarea" type="email" value={this.state.cc1}
                         onChange={this.handleCC1}  />
                        <label htmlFor="fedexconsolidate_cc1" className="black-text">CC 1</label>
                        <span className="helper-text left" data-error="wrong" data-success=""></span>
                      </div>
                    </Col>
                  </Row>        
                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name-="fedexconsolidateCC2" id="fedexconsolidate_cc2" className="materialize-textarea" type="email" value={this.state.cc2}
                         onChange={this.handleCC2}  />
                        <label htmlFor="fedexconsolidate_To" className="black-text">CC 2</label>
                        <span className="helper-text left" data-error="wrong" data-success=""></span>
                      </div>
                    </Col>
                  </Row>        
                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name-="fedexconsolidateCC3" id="fedexconsolidate_cc3" className="materialize-textarea" type="email" value={this.state.cc3}
                         onChange={this.handleCC3}  />
                        <label htmlFor="fedexconsolidate_To" className="black-text">CC 3</label>
                        <span className="helper-text left" data-error="wrong" data-success=""></span>
                      </div>
                    </Col>
                  </Row>        
                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name-="fedexconsolidateBCC1" id="fedexconsolidate_bcc1" className="materialize-textarea" type="email" value={this.state.bcc1}
                         onChange={this.handleBCC1}  />
                        <label htmlFor="fedexconsolidate_bcc1" className="black-text">BCC 1</label>
                        <span className="helper-text left" data-error="wrong" data-success=""></span>
                      </div>
                    </Col>
                  </Row>        
                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name-="fedexconsolidateBCC2" id="fedexconsolidate_bcc2" className="materialize-textarea" type="email" value={this.state.bcc2}
                         onChange={this.handleBCC2}  />
                        <label htmlFor="fedexconsolidate_bcc2" className="black-text">BCC 2</label>
                        <span className="helper-text left" data-error="wrong" data-success=""></span>
                      </div>
                    </Col>
                  </Row>        
                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name-="fedexconsolidateCC3" id="fedexconsolidate_bcc3" className="materialize-textarea" type="email" value={this.state.bcc3}
                         onChange={this.handleBCC3}  />
                        <label htmlFor="fedexconsolidate_bcc3" className="black-text">BCC 3</label>
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
              <Button id='cancelFedexBtn' variant="outline-secondary" className="mr-4 btn modal-close " >Cancel</Button>
              {
              this.state.editRow
              ?<Button id="updateFedexBtn" variant="outline-primary" className="mr-2 btn" onClick = {this.updateFedexDetailsDB}>Update</Button>
              :<Button id="addFedexBtn" variant="outline-primary" className="mr-2 btn" onClick={this.addFedexDetailsToDB}> Add</Button>
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
                <Nav.Link className="red-text modal-trigger " href="" onClick={this.openFedexDetailsModal}>
                  Add Fedex Consolidate Details<Image className="red-text mr-auto" src="assets/images/plus-circle-red-m.svg" /></Nav.Link>
              </Nav>


            </Col>
          </Row>
        </div>


      </Fragment>
    )
  }

}

