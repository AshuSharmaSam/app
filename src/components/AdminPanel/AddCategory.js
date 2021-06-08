
import React, { Component, Fragment } from 'react';
import { base_url } from '../../globalConstants'
import { Table, Row, Col, Image, Nav, ButtonGroup, Button } from 'react-bootstrap';
import M from "materialize-css";
import { EditOutlined } from "@material-ui/icons";
import Axios from 'axios';
import './addcategory.css';


class CategoryFrag extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      categoryId: "", categoryName: "", customDuty: "",
      vat: "", countryId: "", categorydata: this.props.categorydata
      , countrylist: this.props.countrylist, countrycodelist: this.props.country_code_list, error: "",
      countryName:"", editRow: false, mainId:"", keyId:""
    })

  }

  handleCountryNameChange = (e) => {

    let selected_countryName = this.state.countrycodelist[this.state.countrylist.indexOf(e.target.value)]

    this.setState({ countryName: e.target.value})
    this.setState({ countryId: selected_countryName})
  }

  handleCategoryIdChange = (e) => {
    this.setState({ categoryId: e.target.value })
  }
  handleCategoryNameChange = (e) => {
    this.setState({ categoryName: e.target.value })
  }
  handleCountryIdChange = (e) => {
    this.setState({ countryId: this.state.countrycodelist[this.state.countrylist.indexOf(e.target.value)] })
  }


  handleCustomDutyChange = (e) => {
    this.setState({ customDuty: e.target.value })
  }
  handleVatChange = (e) => {
    this.setState({ vat: e.target.value })
  }

//EDIT OPTION START
handleEditOption = (e) => {
  this.setState({editRow:true})
  var elems = document.getElementById("addCategoryModal");
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
             
              console.log(data);
              this.setState({mainId: data[0], keyId: data[1]})
              this.setState({
                categoryId: data[1], categoryName: data[2], 
                customDuty: data[3], vat: data[4], 
                countryName: country_name
              })

}
openAddCategoryModal =  ()=>{
  this.setState({editRow:false})

  var elems = document.getElementById("addCategoryModal");
  var instance = M.Modal.init(elems);
  instance.open()
        
}
closeModal = ()=>{
  var elems = document.getElementById("addCategoryModal");
  var instance = M.Modal.init(elems);
  instance.close();
  this.setState({error: "", editRow:false})
  this.setState({
    categoryId: "", categoryName: "", customDuty: "",
    vat: "", countryId: "", countryName:""
  })  
}
updateCategoryDB = async () => {

  let country_code = this.state.countrycodelist[this.state.countrylist.indexOf(this.state.countryName)]
  let url = base_url+`categories/${this.state.keyId}/`

  // let num = Math.floor(Math.random() * Math.floor(10000));

  var categoryformdata = new FormData()
  categoryformdata.append("category_id", this.state.categoryId)
  categoryformdata.append("category_name", this.state.categoryName)
  categoryformdata.append("custom_duty", this.state.customDuty)
  categoryformdata.append("vat", this.state.vat)
  categoryformdata.append("country", country_code)
  categoryformdata.append("status", "Active")
  


  // @Todo: APi to be called to save data for state

  try {
    let token = localStorage.getItem("token")
    var config = {
      headers: { 'Content-Type': 'multipart/form-data' , 'Authorization':'Token '+token},
      
    };
    const response = await Axios.put(url, categoryformdata, config)

    let itemIndex = parseInt(this.state.mainId) - 1
    this.state.categorydata.splice(itemIndex, 1, response.data)

    var elem = document.getElementById('addCategoryModal')
    var instance = M.Modal.getInstance(elem);
    instance.close();
    M.toast({ html: 'Updated Category Details Successfully.' , classes: "white-text orange rounded" })
    this.setState({
      categoryId: "", categoryName: "", customDuty: "",
      vat: "", countryId: "", countryName:""
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


  addCategoryToDB = async () => {
    console.log(this.state.countryId + this.state.categoryId + this.state.customDuty
      + this.state.vat + this.state.categoryName)


    var categoryformdata = new FormData()
    categoryformdata.append("category_id", this.state.categoryId)
    categoryformdata.append("category_name", this.state.categoryName)
    categoryformdata.append("custom_duty", this.state.customDuty)
    categoryformdata.append("vat", this.state.vat)
    categoryformdata.append("country", this.state.countryId)
    categoryformdata.append("status", "Active")

    let url = base_url+'categories/'  

    try {
      let token = localStorage.getItem("token")
      var config = {
        headers: { 
        'Content-Type': 'multipart/form-data' , 
        'Authorization':'Token '+ token},        
      };
      const response = await Axios.post(url, categoryformdata, config)
      this.state.categorydata.unshift(response.data)

      var elem = document.getElementById('addCategoryModal')
      var instance = M.Modal.getInstance(elem);
      instance.close();
      this.setState({
        categoryId: "", categoryName: "", customDuty: "",
        vat: "", countryId: "", error: "", countryName:""
      })
      // @Todo: APi to be called to save data for SLAB
      M.toast({ html: 'Added Category Successfully PENDING', classes: "white-text orange rounded" })


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

    var sr_no = 0;
    const categorytable = this.state.categorydata.map((category) => {
      sr_no = sr_no +1; 
      return (
        <Fragment key={category.id}>
          <tr>
            <td>{sr_no}</td>
            <td>{category.category_id}</td>
            <td>{category.category_name}</td>
            <td>{category.custom_duty}</td>
            <td>{category.vat}</td>
            <td>{category.country}</td>
            <td onClick={this.handleEditOption}><a title = "Edit"><EditOutlined/></a></td>
            <td className="hide">{category.id}</td>
          </tr>
        </Fragment>

      )
    })

    const table_render = <Table hover >
      <thead>
        <tr>
          <th>Sr.No.</th>
          <th>Category ID</th>
          <th>Category Name</th>
          <th>Custom Duty (%)</th>
          <th>VAT (%)</th>
          <th>Country</th>
          <th>Edit</th>
        </tr>
      </thead>
      <tbody>
        {categorytable}

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
        <div id="addCategoryModal" className="modal modal-fixed-footer">
          <div className="modal-content">

          <h4 className="center orange-text"> {this.state.editRow ? "Update Category Details" : "Add Category"}</h4>

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
                      </div>  </Col>
                  </Row>

                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name-="categoryid" id="category_id" className="materialize-textarea" type="text" value={this.state.categoryId} onChange={this.handleCategoryIdChange} />
                        <label htmlFor="category_id" className="black-text">Enter Category ID</label>
                        <span className="helper-text left" data-error="wrong" data-success="">Unique Category ID ex: CAT_001</span>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name="categoryname" id="category_name" type="text" value={this.state.categoryName} onChange={this.handleCategoryNameChange} className="" />
                        <label htmlFor="category_name" className="black-text">Enter Category Name</label>
                        <span className="helper-text left" data-error="wrong" data-success="">Unique Category Name ex: ANT_AUTOMOBILES</span>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name="customeduty" id="custome_duty" type="text" value={this.state.customDuty} onChange={this.handleCustomDutyChange} className="" />
                        <label htmlFor="custome_duty" className="black-text">Enter Custom Duty </label>
                        <span className="helper-text left" data-error="wrong" data-success="">Custom Duty (in %) Ex: 20</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name="vat" id="vat" type="text" value={this.state.vat} onChange={this.handleVatChange} className="" />
                        <label htmlFor="vat" className="black-text">VAT </label>
                        <span className="helper-text left" data-error="wrong" data-success="">VAT (in %) Ex: 15</span>
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
              <Button id='cancelCategoryBtn' variant="outline-secondary" className="mr-4 btn modal-close "  >Cancel</Button>
              {
              this.state.editRow
              ?<Button id="updateCategoryBtn" variant="outline-primary" className="mr-2 btn" onClick = {this.updateCategoryDB}>Update</Button>
              :<Button id="addCategoryBtn" variant="outline-primary" className="mr-2 btn" onClick={this.addCategoryToDB}> Add</Button>
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
                <Nav.Link className="red-text modal-trigger " href="" onClick={this.openAddCategoryModal}>
                  Add Category Details<Image className="red-text mr-auto" src="assets/images/plus-circle-red-m.svg" /></Nav.Link>
              </Nav>


            </Col>
          </Row>
        </div>


      </Fragment>
    )
  }

}


export default CategoryFrag;