
import React, { Component, Fragment } from 'react';
import { base_url } from '../../globalConstants'
import { Table, Row, Col, Image, Nav, ButtonGroup, Button } from 'react-bootstrap';
import M from "materialize-css";
import { EditOutlined } from "@material-ui/icons";
import Axios from 'axios';
import './addlanguage.css';


class LanguageFrag extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      languageData: this.props.languageData, selectedCountry: "",
      defaultLangauage: "", defaultLangauageList: this.props.default_langList,
      countrylist: this.props.countrylist, countrycodelist: this.props.country_code_list, error: "",
      countryName:"", editRow: false, mainId:"", keyId:""
    })

  }

  handleCountryNameChange = (e) => {

    let selected_countryName = this.state.countrycodelist[this.state.countrylist.indexOf(e.target.value)]

    this.setState({ countryName: e.target.value})
    this.setState({ countryId: selected_countryName})
  }

  handleLanguageChange = e => {
    this.setState({
      defaultLangauage: e.target.value
    })
  }

//EDIT OPTION START
handleEditOption = (e) => {
  this.setState({editRow:true})
  var elems = document.getElementById("addLanguageModal");
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
              this.setState({mainId: data[0], keyId: data[4]})
              this.setState({
                countryName: country_name,
                selectedCountry: data[1],
                defaultLangauage: data[2]
              })

}
openAddLanguageModal =  ()=>{
  this.setState({editRow:false})

  var elems = document.getElementById("addLanguageModal");
  var instance = M.Modal.init(elems);
  instance.open()
        
}
closeModal = ()=>{
  var elems = document.getElementById("addLanguageModal");
  var instance = M.Modal.init(elems);
  instance.close();
  this.setState({error: "", editRow:false})
  this.setState({
    countryId: "", countryName:""
  })  
}
updateLanguageDB = async () => {

  // let country_code = this.state.countrycodelist[this.state.countrylist.indexOf(this.state.countryName)]
  let url = base_url+`countries/${this.state.keyId}/`

  // let num = Math.floor(Math.random() * Math.floor(10000));

  var languageformdata = new FormData()
  languageformdata.append('default_language', this.state.defaultLangauage)

  try{
    let token = localStorage.getItem("token")
      var config = {
        headers: { 'Content-Type': 'multipart/form-data' , 'Authorization':'Token '+token},
        
      };
      const response = await Axios.patch(url, languageformdata, config)

      let itemIndex = parseInt(this.state.mainId) - 1
      this.state.languageData.splice(itemIndex, 1, response.data)
  
      var elem = document.getElementById('addLanguageModal')
      var instance = M.Modal.getInstance(elem);
      instance.close();
      M.toast({ html: 'Updated Language Details Successfully.' , classes: "white-text orange rounded" })
      this.setState({        
        countryId: "", countryName:"",
        defaultLangauage:""
      })
      this.setState({
        error: "",
        editRow: false
      })

  }catch(err){
      this.setState({
        error: "OH Snap! Something is Wrong.Please try again",
        // editRow: false
      })
      M.toast({ html: 'Please Try Again!', classes: "white-text red rounded" });

      console.log(err.message)

  }
}
//EDIT OPTION END


  addLanguageToDB = async () => {
    console.log('add lang');


    // var languageformdata = new FormData()

    // let url = base_url+'categories/'  


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
    const languagetable = this.state.languageData.map((language, index) => {
      return (
        <Fragment key={language.id}>
          <tr>
            <td>{index+1}</td>
            <td>{language.name}</td>
            <td>{language.default_language}</td>
            <td onClick={this.handleEditOption}><a title = "Edit"><EditOutlined/></a></td>
            <td className="hide">{language.country_id}</td>
          </tr>
        </Fragment>

      )
    })

    const table_render = <Table hover >
      <thead>
        <tr>
          <th>Sr.No.</th>
          <th>Country</th>
          <th>Default Language</th>
          {/* <th>Other Language</th> */}
          <th>Edit</th>
        </tr>
      </thead>
      <tbody>
        {languagetable}
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
        <div id="addLanguageModal" className="modal modal-fixed-footer">
          <div className="modal-content">

          <h4 className="center orange-text"> {this.state.editRow ? "Update Language Details" : "Add Language"}</h4>

            <h4 className="center orange-text">   </h4>


            <Row>
              <Col xs={12} >
                <form>
                  <p className="center red-text">{this.state.error}</p>

                  {/* <Row>
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
                  </Row> */}

                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input name="country" id="countryName" type="text" value={this.state.selectedCountry}
                          disabled className="" />
                        {/* <label htmlFor="countryName" className="black-text">Country</label> */}
                        <span className="helper-text left" data-error="wrong" data-success="">Country</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col className=" rowdivPading " xs={12}>
                      <div className="input-field col s6 offset-s3 center">
                        {/* <input name="language" id="def_language" type="text" value={this.state.defaultLangauage} className="" 
                          onChange={this.handleLanguageChange} />
                        {/* <label htmlFor="def_language" className="black-text">Enter Default Language</label> */}
                        {/* <span className="helper-text left" data-error="wrong" data-success=""> Language</span>  */}

                        <select id="def_language" name="language" className="" value={this.state.defaultLangauage} onChange={this.handleLanguageChange}>
                              <option value="English" >English</option>
                              <option value="Spanish" >Spanish</option>
                              {/* {selectCounrtyOptions} */}
                            </select>

                    
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
              <Button id='cancelLanguageBtn' variant="outline-secondary" className="mr-4 btn modal-close "  >Cancel</Button>
              {
              this.state.editRow
              ?<Button id="updateLanguageBtn" variant="outline-primary" className="mr-2 btn" onClick = {this.updateLanguageDB}>Update</Button>
              :<Button id="addLanguageBtn" variant="outline-primary" className="mr-2 btn" onClick={this.addLanguageToDB}> Add</Button>
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

              {/* <Nav className="right">
                <Nav.Link className="red-text modal-trigger " href="" onClick={this.openAddLanguageModal}>
                  Add Language Details<Image className="red-text mr-auto" src="assets/images/plus-circle-red-m.svg" /></Nav.Link>
              </Nav> */}


            </Col>
          </Row>
        </div>


      </Fragment>
    )
  }

}


export default LanguageFrag;