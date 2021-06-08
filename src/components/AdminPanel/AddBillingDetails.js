
import React, { Component, Fragment } from 'react';
import { base_url } from '../../globalConstants'
import { Table, Row, Col, Image, Nav, ButtonGroup, Button } from 'react-bootstrap';
import M from "materialize-css";
import { EditOutlined } from "@material-ui/icons";
import Axios from 'axios';
import './addbillingdetails.css';


export default class BillingFrag extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      countryId: "", ownerId: "",
      billingdata: this.props.billingdata,
      countrylist: this.props.countrylist, countrycodelist: this.props.country_code_list, error: "",
      ownerList: this.props.ownerList,
      cashBillingId:"", mainId:"", countryName: "",
      billingid:"",
      ezzyid_cas:this.props.ezzyid_cas,
      editRow: false
    })

  }

  handleCountryNameChange = (e) => {

    let selected_countryName = this.state.countrycodelist[this.state.countrylist.indexOf(e.target.value)]

    this.setState({ countryName: e.target.value})
    this.setState({ countryId: selected_countryName})
  }
  
  handleOwnerIDChange = (e) => {

    this.setState({ ownerId: e.target.value})

  }
  
  handleEzzyidChange = (e) => {
    this.setState({billingid: e.target.value})
  }

  //EDIT OPTION START
  handleEditOption = (e) => {
    this.setState({editRow:true})
    var elems = document.getElementById("addBillingDetailsModal");
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
                let country_name = this.state.countrylist[this.state.countrycodelist.indexOf(data[2])]
                
                // this.setState({editRowNumer: selectedRowIndex})
                // console.log(selectedRowIndex);
                // this.setState({countryName: country_name, warehouseId: data[5], portNumber: data[3], IPaddress: data[2]})
                this.setState({countryName: country_name})
                this.setState({cashBillingId: data[1]})
                this.setState({billingid: data[1]})
                this.setState({ownerId: data[2]})
                this.setState({mainId: data[0]})
                console.log(data);
                console.log(data[1]);
                console.log(data[5]);
                // console.log(cashBillingId);

                // console.log(country_name);
                // console.log(data[5]);

  }
  openAddBillingDetailsModal =  ()=>{
    this.setState({editRow:false})

    var elems = document.getElementById("addBillingDetailsModal");
    var instance = M.Modal.init(elems);
    instance.open()
          
  }
  closeModal = ()=>{
    var elems = document.getElementById("addBillingDetailsModal");
    var instance = M.Modal.init(elems);
    instance.close();
    this.setState({editRow:false})
    this.setState({
      countryId: "", ownerId: "", error: "", countryName:"", billingid:"",
    })
  }
  updateBillingDetailsDB = async () => {

    // let country_code = this.state.countrycodelist[this.state.countrylist.indexOf(this.state.countryName)]
    let url = base_url+`cash_billing/${this.state.cashBillingId}/`

    // let num = Math.floor(Math.random() * Math.floor(10000));

    var billingformdata = new FormData()
    billingformdata.append("cash_billing_id", this.state.billingid)
    // billingformdata.append("country_id", this.state.countryId)
    billingformdata.append("owner_id", this.state.ownerId)



    // @Todo: APi to be called to save data for state

    try {
      let token = localStorage.getItem("token")
      var config = {
        headers: { 'Content-Type': 'multipart/form-data' , 'Authorization':'Token '+token},
        
      };
      const response = await Axios.put(url, billingformdata, config)

      let itemIndex = parseInt(this.state.mainId) - 1
      this.state.billingdata.splice(itemIndex, 1, response.data)

      // this.state.billingdata.unshift(response.data)
      var elem = document.getElementById('addBillingDetailsModal')
      var instance = M.Modal.getInstance(elem);
      instance.close();
      M.toast({ html: 'Updated Billing Details Successfully.' , classes: "white-text orange rounded" })
      this.setState({
        countryId: "", ownerId: "",countryName:"", billingid:"",
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

  addBillingDetailsToDB = async () => {
    // console.log(this.state.countryId + this.state.categoryId + this.state.customDuty
    //   + this.state.vat + this.state.categoryName)


    var billingformdata = new FormData()
    // billingformdata.append("country_id", this.state.countryId)
    billingformdata.append("owner_id", this.state.ownerId)
    billingformdata.append("cash_billing_id",this.state.billingid)

    let url = base_url+"cash_billing/"  
    
    try {
      let token = localStorage.getItem("token")

      var config = {
        headers: { 
        'Content-Type': 'multipart/form-data' , 
        'Authorization':'Token '+ token},        
      };
      
      const response = await Axios.post(url, billingformdata, config)
      this.state.billingdata.unshift(response.data)

      var elem = document.getElementById('addBillingDetailsModal')
      var instance = M.Modal.getInstance(elem);
      instance.close();
      this.setState({
        countryId: "", ownerId: "", error: "", countryName:"", billingid:"",
      })
      // @Todo: APi to be called to save data for SLAB
      M.toast({ html: 'Added Billing Details successfully ', classes: "white-text orange rounded" })


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
    var ownerIDkey = 0

    const selectCounrtyOptions = this.state.countrylist.map((country) => {
    
      return (
        <option key={uniquekey++} value={country}>{country}</option>
      )
    })

    const selectezzyid = this.state.ezzyid_cas.map((bill, index)=>{
      return(
        <option key = {index} value={bill}>{bill}</option>
      )
    })
    const selectOwnerIDOptions = this.state.ownerList.map((owner) => {

      return (
        <option key={ownerIDkey++} value={owner}>{owner}</option>
      )
    })

    var sr_no = 0;
    const billingtable = this.state.billingdata.map((billing) => {
      sr_no=sr_no+1
      return (
        <Fragment key={sr_no}>
          <tr>
            <td>{sr_no}</td>
            <td>{billing.cash_billing_id}</td>
            {/* <td>{billing.country_id}</td> */}
            <td>{billing.owner_id}</td>   
            <td onClick={this.handleEditOption}><a title = "Edit"><EditOutlined/></a></td>     
            <td className="hide">{billing.id}</td>
          </tr>
        </Fragment>

      )
    })

    const table_render = <Table hover >
      <thead>
        <tr>
          <th>Sr.No.</th>
          <th>Cash Billing ID</th>
          {/* <th>Country ID</th> */}
          <th>Owner ID</th>
          <th>Edit</th>                           
        </tr>
      </thead>
      <tbody>
        {billingtable}

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
        <div id="addBillingDetailsModal" className="modal modal-fixed-footer">
          <div className="modal-content">
           
          <h4 className="center orange-text"> {this.state.editRow ? "Update Billing Details" : "Add Billing Details"}</h4>

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
                            ? <select id="country_name_select" name="country_name" className="browser-default country_name_select" value={this.state.billingid} onChange={this.handleEzzyidChange}>
                              <option value="" disabled >Choose EzzyID</option>
                              {selectezzyid}
                            </select>
                            : <select id="country_name_select" name="country_name" className="browser-default country_name_select" defaultValue={'DEFAULT'} onChange={this.handleEzzyidChange}>
                              <option value="DEFAULT" disabled >Choose EzzyID</option>
                              {selectezzyid}
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
                        <div id=''>
                          {
                          this.state.editRow
                            ? <select id="ownerid_select" name="ownerid" className="browser-default ownerID_select" value={this.state.ownerId} onChange={this.handleOwnerIDChange}>
                              <option value="" disabled >Choose Owner</option>
                              {selectOwnerIDOptions}
                            </select>
                            : <select id="ownerid_select" name="ownerid" className="browser-default ownerID_select" defaultValue={'DEFAULT'} onChange={this.handleOwnerIDChange}>
                              <option value="DEFAULT" disabled >Choose Owner</option>
                              {selectOwnerIDOptions}
                            </select>
                            }
                          <label>Select Owner</label>
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
              <Button id='cancelBillingBtn' variant="outline-secondary" className="mr-4 btn modal-close " onClick={this.closeModal} >Cancel</Button>
              {
              this.state.editRow
              ?<Button id="updateBillingBtn" variant="outline-primary" className="mr-2 btn" onClick = {this.updateBillingDetailsDB}>Update</Button>
              :<Button id="addBillingBtn" variant="outline-primary" className="mr-2 btn" onClick={this.addBillingDetailsToDB}> Add</Button>
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
                <Nav.Link className="red-text modal-trigger " href="" onClick={this.openAddBillingDetailsModal}>
                  Add Billing Details<Image className="red-text mr-auto" src="assets/images/plus-circle-red-m.svg"  /></Nav.Link>
              </Nav>


            </Col>
          </Row>
        </div>


      </Fragment>
    )
  }

}

