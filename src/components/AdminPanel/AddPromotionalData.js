
import React, { Component, Fragment } from 'react';
import { base_url } from '../../globalConstants'
import { Table, Row, Col, Image, Nav, ButtonGroup, Button } from 'react-bootstrap';
import M from "materialize-css";
import { EditOutlined } from "@material-ui/icons";
import Axios from 'axios';
import './addpromotional.css';


class DiscountFrag extends Component {
  constructor(props) {
    super(props);
    this.state = ({

        countryId: "",
        discountName: "", discountValue: "", startDate: "", endDate: "", 
        discountData: this.props.discountdata,
        countryNameList: this.props.country_name,
        countrylist: this.props.countrylist, countrycodelist: this.props.country_code_list, error: "",
        countryName:"", editRow: false, mainId:"", keyId:""
    })

    // console.log('discounttttt',this.state.discountData);
    // console.log('country_name_list',this.state.countryNameList);
  }

  handleCountryNameChange = (e) => {

    let selected_countryName = this.state.countrycodelist[this.state.countrylist.indexOf(e.target.value)]

    this.setState({ countryName: e.target.value})
    this.setState({ countryId: selected_countryName})
  }

  handleDiscountNameChange = (e) => {
    this.setState({ discountName: e.target.value })
  // console.log('function to add add discount');
  }

  // handleStartDate = e => {    
  //   var context = this;
  //   var elems_startDate = document.getElementById('start_date');
  //   var options_recieved={
  //       //selectMonths: true, // Enable Month Selection
  //       selectYears: 1, // Creates a dropdown of 10 years to control year
  //       format:'yyyy-mm-dd',
  //       autoClose :true,
  //       defaultDate:new Date(),
  //       setDefaultDate :true,
  //       onSelect: function(date) {
  //         let selecteddata =  date.getFullYear() +'-'+ (date.getMonth() + 1) +'-'+date.getDate()
  //         context.setState({ discountStartDate: selecteddata});
  //         //  console.log("recived"+ selecteddata); // Selected date is logged
  //       },
  //     }
  //   var instances = M.Datepicker.init(elems_startDate, options_recieved);   
  //   console.log('START DATE', this.state.discountStartDate); 
  //   console.log('START DATE', e.target.value); 
  // }

  handleEndDate = e => {
    var context = this;
    var elems_endDate = document.getElementById('start_end');
    var options_recieved={
        //selectMonths: true, // Enable Month Selection
        selectYears: 1, // Creates a dropdown of 10 years to control year
        format:'yyyy-mm-dd',
        autoClose :true,
        defaultDate:new Date(),
        setDefaultDate :true,
        onSelect: function(date) {
          let selecteddata =  date.getFullYear() +'-'+ (date.getMonth() + 1) +'-'+date.getDate()
          context.setState({ discountEndDate: selecteddata});
          //  console.log("recived"+ selecteddata); // Selected date is logged
        },
      }
    var instances = M.Datepicker.init(elems_endDate, options_recieved);
    console.log('START DATE', this.state.discountEndDate); 
  }

  handleDiscountChange = (e) => {
      this.setState({ discountValue: e.target.value })
    // console.log('function to add add discount');
  }

//EDIT OPTION START
handleEditOption = (e) => {
  this.setState({editRow:true})
  var elems = document.getElementById("addDiscountModal");
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
             
              console.log(data);
              this.setState({mainId: data[0], keyId: data[7]})
              this.setState({
                discountName: data[2],
                startDate: data[3],
                endDate: data[4],
                discountValue: data[5], 
                countryName: data[1]
              })

}

openAddDiscountModal =  ()=>{
  this.setState({editRow:false})

  var elems = document.getElementById("addDiscountModal");
  var instance = M.Modal.init(elems);
  instance.open()
        
}
closeModal = ()=>{
  var elems = document.getElementById("addDiscountModal");
  var instance = M.Modal.init(elems);
  instance.close();
  this.setState({error: "", editRow:false})
  this.setState({
      countryId: "", countryName:""
  })  
}

updateDiscountDB = async () => {
  // console.log("UPDATE FUNCT")

  let country_code = this.state.countrycodelist[this.state.countrylist.indexOf(this.state.countryName)]
  let url = base_url+`promotions/${this.state.keyId}/`

  // let num = Math.floor(Math.random() * Math.floor(10000));

    var discountformdata = new FormData()
    discountformdata.append("country", this.state.countryId)
    discountformdata.append('discount_percentage',this.state.discountValue)
    discountformdata.append('start_date',this.state.startDate)
    discountformdata.append('end_date',this.state.endDate)
    
    this.state.discountName == ""
    ?discountformdata.append('discount_name',this.state.countryName+' '+'Discount')
    :discountformdata.append('discount_name',this.state.discountName)

    try {
      let token = localStorage.getItem("token")
      var config = {
        headers: { 'Content-Type': 'multipart/form-data' , 'Authorization':'Token '+token},
        
      };
      const response = await Axios.put(url, discountformdata, config)
  
      let itemIndex = parseInt(this.state.mainId) - 1
      this.state.discountData.splice(itemIndex, 1, response.data)
  
      var elem = document.getElementById('addDiscountModal')
      var instance = M.Modal.getInstance(elem);
      instance.close();
      M.toast({ html: 'Updated Discount Details Successfully.' , classes: "white-text orange rounded" })
      this.setState({
        discountName: "", discountValue: "",
        countryId: "", countryName:""
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


  addDiscountToDB = async () => {
    // console.log('ADD FUNCT');

    var discountformdata = new FormData()
    discountformdata.append("country", this.state.countryId)
    discountformdata.append('discount_percentage',this.state.discountValue)
    discountformdata.append('start_date',this.state.startDate)
    discountformdata.append('end_date',this.state.endDate)
    
    this.state.discountName == ""
    ?discountformdata.append('discount_name',this.state.countryName+' '+'Discount')
    :discountformdata.append('discount_name',this.state.discountName)
    
    
    let url = base_url+'promotions/'

    try{
      let token = localStorage.getItem('token')
      var config = {
        headers:{
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Token'+token,
        }    
      };

      const response = await Axios.post(url, discountformdata, config)
      this.state.discountData.push(response.data)
      console.log('push response data', response.data);

      var elem = document.getElementById('addDiscountModal')
      var instance = M.Modal.getInstance(elem);
      instance.close();
      this.setState({
        countryId: "",
        discountName: "", discountValue: "",
        startDate: "",endDate: "",
        error: ""
      })

      M.toast({ html: 'Added Discount Successfully.', classes: "white-text orange rounded" })

    }catch(err) {
      console.log('ERRRR',err);
      this.setState({
        error: "OH Snap! Something is Wrong.Please try again"
      })
      M.toast({ html: 'Please Try Again!', classes: "white-text red rounded" });

    }

  }

  handleDateChange = ev => {
      alert("date")
      const target = ev.target
      const name = target.name
      console.log(ev.target.name)
      console.log(ev.target.value)
    this.setState({
      [name]: target.value
    });
  }


  componentDidMount() {
    // Auto initialize all the things!
    M.AutoInit();

    let context = this

    var elems_startDate = document.getElementById('start_date');

    var options_startDate = {
      //selectMonths: true, // Enable Month Selection
      selectYears: 10, // Creates a dropdown of 10 years to control year
      format: 'yyyy-mm-dd',
      autoClose: true,
      defaultDate: new Date(),
      setDefaultDate: true,
      onSelect: function (date) {
        let selecteddata = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        context.setState({ startDate: selecteddata });
        // console.log("order",selecteddata); // Selected date is logged
      },
    }
    var instances = M.Datepicker.init(elems_startDate, options_startDate);

    var elems_endDate = document.getElementById('end_date');

    var options_endDate = {
      //selectMonths: true, // Enable Month Selection
      selectYears: 10, // Creates a dropdown of 10 years to control year
      format: 'yyyy-mm-dd',
      autoClose: true,
      defaultDate: new Date(),
      setDefaultDate: true,
      onSelect: function (date) {
        let selecteddata = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        context.setState({ endDate: selecteddata });
        // console.log("order",selecteddata); // Selected date is logged
      },
    }
    var instances = M.Datepicker.init(elems_endDate, options_endDate);

  }


  render() {
    var uniquekey = 0
    const selectCounrtyOptions = this.state.countrylist.map((country) => {

      return (
        <option key={uniquekey++} value={country}>{country}</option>
      )
    })

    const discount_table = this.state.discountData.map((discount, index) => {
      return (
        <Fragment key={discount.id}>
          <tr>
            <td>{index+1}</td>
            <td>{ this.state.countryNameList[discount.country] }</td>
            <td>{discount.discount_name}</td>
            <td>{discount.start_date}</td>
            <td>{discount.end_date}</td>
            <td>{discount.discount_percentage}</td>
            <td onClick={this.handleEditOption}><a title = "Edit"><EditOutlined/></a></td>
            <td className="hide">{discount.id}</td>
          </tr>
        </Fragment>

      )
    })

    const table_render = <Table hover >
      <thead>
        <tr>
          <th>Sr. No.</th>
          <th>Country</th>
          <th>Promotion Name</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Discount (%)</th>
          <th>Edit</th>
        </tr>
      </thead>
      <tbody>
        {discount_table}
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
        <div id="addDiscountModal" className="modal modal-fixed-footer">
          <div className="modal-content">

          <h4 className="center orange-text"> {this.state.editRow ? "Update Discount Details" : "Add Discount Details"}</h4>

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
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name="discount_name" id="discount_name" type="text" 
                          value={this.state.discountName} onChange={this.handleDiscountNameChange} className="" />
                        <label htmlFor="discount_name" className="black-text">Promotion Name</label>
                        <span className="helper-text left" data-error="wrong" data-success="">Optional</span>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name="startDate" id="start_date" type="text" className="datepicker" 
                          value = { this.state.startDate } onChange={this.handleDateChange} />
                        <label htmlFor="start_date" className="black-text">Start Date</label>
                        <span className="helper-text left" data-error="wrong" data-success=""></span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name="endDate" id="end_date" type="text"  className="" 
                          value = { this.state.endDate } onChange={this.handleDateChange} />
                        <label htmlFor="end_date" className="black-text">End Date</label>
                        <span className="helper-text left" data-error="wrong" data-success=""></span>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name="discount" id="discountValue" type="text" 
                          value={this.state.discountValue} onChange={this.handleDiscountChange} className="" />
                        <label htmlFor="discountValue" className="black-text">Enter Discount Value</label>
                        <span className="helper-text left" data-error="wrong" data-success="">Discount %</span>
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
              <Button id='cancelDiscountBtn' variant="outline-secondary" className="mr-4 btn modal-close "  >Cancel</Button>
              {
              this.state.editRow
              ?<Button id="updateDiscountBtn" variant="outline-primary" className="mr-2 btn" onClick = {this.updateDiscountDB}>Update</Button>
              :<Button id="addDiscountBtn" variant="outline-primary" className="mr-2 btn" onClick={this.addDiscountToDB}> Add</Button>
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
                <Nav.Link className="red-text modal-trigger " href="" onClick={this.openAddDiscountModal}>
                  Add Discount Details<Image className="red-text mr-auto" src="assets/images/plus-circle-red-m.svg" /></Nav.Link>
              </Nav>


            </Col>
          </Row>
        </div>


      </Fragment>
    )
  }

}


export default DiscountFrag;