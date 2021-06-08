
import React, { Component, Fragment } from 'react';
import { base_url } from '../../globalConstants'
import { Table, Row, Col, Image, Nav, ButtonGroup, Button } from 'react-bootstrap';
import M from "materialize-css";
import { EditOutlined } from "@material-ui/icons";
import Axios from 'axios';
// import AddCountry from './CountryModal';
import './addSlab.css';



class SlabFrag extends Component {

  constructor(props) {
    super(props);
    this.state = ({
      countryName: "", rangeInitial: "", rangeFinal: "",
      unitCharge: "", markup: "", 
      slabdata: this.props.slabdata, 
      countrylist: this.props.countrylist, 
      countrycodelist: this.props.country_code_list, error: "",
      countryId:"", mainId:"", keyId:"", editRow: false
    })

  }
  handleCountryNameChange = (e) => {

    let selected_countryName = this.state.countrycodelist[this.state.countrylist.indexOf(e.target.value)]

    this.setState({ countryName: e.target.value})
    this.setState({ countryId: selected_countryName})
  }

  handleRangeInitialChange = (e) => {
    this.setState({ rangeInitial: e.target.value })
  }

  handleRangeFinalChange = (e) => {
    this.setState({ rangeFinal: e.target.value })
  }
  handleUnitchargeChange = (e) => {
    this.setState({ unitCharge: e.target.value })
  }
  handleMarkupChange = (e) => {
    this.setState({ markup: e.target.value })
  }


//EDIT OPTION START
handleEditOption = (e) => {
  this.setState({editRow:true})
  var elems = document.getElementById("addSlabModal");
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
              let country_name = this.state.countrylist[this.state.countrycodelist.indexOf(data[5])]
              // let country_name = this.state.countrylist[this.state.countrycodelist.indexOf(data[3])]
              
              this.setState({editRowNumer: selectedRowIndex})
              console.log(selectedRowIndex);
              this.setState({mainId: data[0], keyId: data[7]})
              this.setState({
                rangeInitial: data[1], rangeFinal: data[2], 
                unitCharge: data[3], markup: data[4],
                countryName: country_name
              })
              console.log(data);
              // console.log(country_name);
              console.log(data[5]);

}
openAddSlabDetailsModal =  ()=>{
  this.setState({editRow:false})
  this.setState({error :""})

  var elems = document.getElementById("addSlabModal");
  var instance = M.Modal.init(elems);
  instance.open()
    
}
closeModal = ()=>{
  var elems = document.getElementById("addSlabModal");
  var instance = M.Modal.init(elems);
  instance.close();
  this.setState({editRow:false})
  this.setState({error :""})
  this.setState({ countryName: "", rangeFinal: "", rangeInitial: "", unitCharge: "", markup: "" })

}
updateSlabDetailsDB = async () => {

  let country_code = this.state.countrycodelist[this.state.countrylist.indexOf(this.state.countryName)]
  let url = base_url+`slabcodes/${this.state.keyId}/`

  // console.log(this.state.statename + this.state.statecode + this.state.countryname)
  var slabformdata = new FormData()
  slabformdata.append("country", country_code)
  slabformdata.append("range_initial", this.state.rangeInitial)
  slabformdata.append("range_final", this.state.rangeFinal)
  slabformdata.append("unit_charge", this.state.unitCharge)
  slabformdata.append("markup", this.state.markup)
  slabformdata.append("status", "Active")


  // @Todo: APi to be called to save data for state

  try {
    let token = localStorage.getItem("token")
    var config = {
      headers: { 'Content-Type': 'multipart/form-data' , 'Authorization':'Token '+token},
      
    };
    const response = await Axios.put(url, slabformdata, config)

    let itemIndex = parseInt(this.state.mainId) - 1
    this.state.slabdata.splice(itemIndex, 1, response.data)    
    
    // this.state.slabdata.unshift(response.data)
    var elem = document.getElementById('addSlabModal')
    var instance = M.Modal.getInstance(elem);
    instance.close();
    M.toast({ html: 'Updated Slab Successfully.' , classes: "white-text orange rounded" })
    this.setState({ countryName: "", rangeFinal: "", rangeInitial: "", unitCharge: "", markup: "" })

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


  addSlabToDB = async () => {
    let country_code = this.state.countrycodelist[this.state.countrylist.indexOf(this.state.countryName)]

    var slabformdata = new FormData()
    slabformdata.append("country", country_code)
    slabformdata.append("range_initial", this.state.rangeInitial)
    slabformdata.append("range_final", this.state.rangeFinal)
    slabformdata.append("unit_charge", this.state.unitCharge)
    slabformdata.append("markup", this.state.markup)
    slabformdata.append("status", "Active")
 var context = this
  
      let token = localStorage.getItem("token")
      var config = {
        headers: { 'Content-Type': 'multipart/form-data' , 'Authorization':'Token '+token},
        
      };
      var elem = document.getElementById('addSlabModal')
      var instance = M.Modal.getInstance(elem);
       Axios.post(base_url+'slabcodes/', slabformdata, config)
      .then(function(response){
        context.state.slabdata.unshift(response.data)

        
        instance.close();
        context.setState({ countryName: "", rangeFinal: "", rangeInitial: "", unitCharge: "", markup: "" })
        M.toast({ html: 'Added SLAB Successfully! Please see Updated Table', classes: "white-text orange rounded" })
      }).catch(function(response){
        // console.log(response)
      
      if (response.response.status === 400){
        console.log(response.response.status)
        context.setState({
          error: "Sent Empty fields/bad Request. "
        })
        M.toast({ html: 'Please Try Again!', classes: "white-text red rounded" });
      }
        }) 
      
      

   






      
    // } catch (err) {
    //   this.setState({
    //     error: "OH Snap! Something is Wrong.Please try again"
    //   })
    //   console.log(err.Status)
    //   M.toast({ html: 'Please Try Again!', classes: "white-text red rounded" });


    // }



  }

  componentDidMount() {
    // Auto initialize all the things!
    M.AutoInit();
  }
  render() {



    var uniquekey = 0
    const selectCounrtyOptions = this.state.countrylist.map((country) => {
      // console.log("countrylist", country)
      return (
        <option className="black-text" key={uniquekey++} value={country}>{country}</option>
      )
    })

    var sr_no=0
    const statetable = this.state.slabdata.map((slab) => {
      sr_no=sr_no+1; 
      return (
        <Fragment key={sr_no}>
          <tr  >
            <td>{sr_no}</td>
            <td>{slab.range_initial}</td>
            <td>{slab.range_final}</td>
            <td>{slab.unit_charge}</td>
            <td>{slab.markup}</td>
            <td>{slab.country}</td>
            <td onClick={this.handleEditOption}><a title = "Edit"><EditOutlined/></a></td>  
            <td className="hide">{slab.id}</td>
          </tr>
        </Fragment>

      )
    })

    const table_render = <Table hover >
      <thead>
        <tr>
          <th>Sr.No.</th>
          <th>Range Initial (LBS)</th>
          <th>Range Final (LBS))</th>
          <th>Unit charge</th>
          <th>Markup</th>
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
        <div id="addSlabModal" className="modal modal-fixed-footer">
          <div className="modal-content">
          <h4 className="center orange-text"> {this.state.editRow ? "Update Slab Details" : "Add Slab Details "}</h4>

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
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name-="rangeinitial" id="range_initial" className="materialize-textarea" type="text" value={this.state.rangeInitial} onChange={this.handleRangeInitialChange} />
                        <label htmlFor="range_initial" className="black-text">Enter Initial Range</label>
                        <span className="helper-text left" data-error="wrong" data-success="">Lower LBS</span>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name="rangefinal" id="rangel_final" type="text" value={this.state.rangeFinal} onChange={this.handleRangeFinalChange} className="" />
                        <label htmlFor="range_final" className="black-text">Enter Final Range</label>
                        <span className="helper-text left" data-error="wrong" data-success="">Upper LBS</span>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name="unitcharge" id="unit_charge" type="text" value={this.state.unitCharge} onChange={this.handleUnitchargeChange} className="" />
                        <label htmlFor="unit_charge" className="black-text">Enter Unit Charge</label>
                        <span className="helper-text left" data-error="wrong" data-success=""></span>
                      </div>
                    </Col>
                  </Row>


                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name="markup" id="mark_up" type="text" value={this.state.markup} onChange={this.handleMarkupChange} className="" />
                        <label htmlFor="mark_up" className="black-text">Enter Markup</label>
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
              <Button id='cancelSlabbtn' variant="outline-secondary" className="mr-4 btn modal-close " onClick={this.closeModal} >Cancel</Button>
              {
              this.state.editRow
              ?<Button id="updateSlabBtn" variant="outline-primary" className="mr-2 btn" onClick = {this.updateSlabDetailsDB}>Update</Button>
              :<Button id="addSlabBtn" variant="outline-primary" className="mr-2 btn" onClick={this.addSlabToDB}> Add</Button>
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
                <Nav.Link className="red-text modal-trigger " onClick={this.openAddSlabDetailsModal}>
                  Add Slab Details<Image className="red-text mr-auto" src="assets/images/plus-circle-red-m.svg" /></Nav.Link>
              </Nav>


            </Col>
          </Row>
        </div>


      </Fragment>

    )
  }

}

export default SlabFrag;