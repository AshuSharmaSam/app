
import React,{Component,Fragment} from 'react';
import { base_url } from '../../globalConstants'
import Axios from "axios"
import {Table,Row,Col,Image,Nav,ButtonGroup,Button} from 'react-bootstrap';
import M from "materialize-css";
import { EditOutlined } from "@material-ui/icons";

// import AddCountry from './CountryModal';
import './addcountry.css';



class CountryFrag extends Component{

constructor(props){
    super (props);
    this.state=({countryname:"",countrycode:"",countrytelecode:"",fexdexcode:"" , 
    countrytelelength:10,
    countrydata:this.props.countrytable,error:"",newCountrycode:"",
    editRow: false, main:"", keyId:"", thresh_value:"", def_language:""
  })
  console.log("in add country")
console.log(this.props.countrytable)
}   
handleCountryNameChange =  (e)=> {
  e.preventDefault()
    this.setState({countryname: e.target.value})
 }

 handleContryCodeChange= (e)=>{
    this.setState({countrycode: e.target.value})
 }
 handleFedecCodeChange= (e)=>{
    this.setState({fexdexcode: e.target.value})
 }
handleCountryTeleCode= (e) =>{
  this.setState({countrytelecode:e.target.value})
}

handleCountryTeleLength= (e) =>{
  this.setState({countrytelelength:e.target.value})
}
handleThresholdChange= (e) =>{
  this.setState({thresh_value:e.target.value})
}

handleLanguageChange = e => {
  this.setState({def_language: e.target.value})
}

//EDIT OPTION START
handleEditOption = (e) => {
  this.setState({editRow:true})
  var elems = document.getElementById("addCountryModal");
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
              // let country_name = this.state.countrylist[this.state.countrycodelist.indexOf(data[0])]
              console.log(data);              
              this.setState({mainId: data[0], keyId: data[4]})
              this.setState({
                countrycode:data[4], countryname:data[1],
                countrytelecode:data[2],fexdexcode:data[4],
                countrytelelength: data[3], thresh_value: data[5]
              })
}
openCountryDetailsModal =  ()=>{
  this.setState({editRow:false})

  var elems = document.getElementById("addCountryModal");
  var instance = M.Modal.init(elems);
  instance.open()
    
}
closeModal = ()=>{
  var elems = document.getElementById("addCountryModal");
  var instance = M.Modal.init(elems);
  instance.close();
  this.setState({editRow:false})
  this.setState({countryname:"",countrycode:"",countrytelecode:"",fexdexcode:"",thresh_value:"", def_language:"" })

}
updateCountryDetailsDB = async () => {

  // let country_code = this.state.countrycodelist[this.state.countrylist.indexOf(this.state.countryName)]
  let url = base_url+`countries/${this.state.keyId}/`

  // console.log(this.state.statename + this.state.statecode + this.state.countryname)
  var countryformdata = new FormData()
    countryformdata.append('country_id',this.state.fexdexcode)
    countryformdata.append('name',this.state.countryname)
    countryformdata.append('telecode',this.state.countrytelecode)
    countryformdata.append('tele_length',this.state.countrytelelength.toString())
    countryformdata.append('fedex_code',this.state.fexdexcode)
    countryformdata.append('threshold_weight',this.state.thresh_value)
    countryformdata.append('default_language',this.state.def_language)
    countryformdata.append('status',"Active")



  // @Todo: APi to be called to save data for state

  try {
    let token = localStorage.getItem("token")
    var config = {
      headers: { 
        'Content-Type': 'multipart/form-data' , 
        'Authorization':'Token '+token},
      
    };
    const response = await Axios.put(url, countryformdata, config)

    let itemIndex = parseInt(this.state.mainId) - 1
    this.state.countrydata.splice(itemIndex, 1, response.data)
    
    // this.state.countrydata.unshift(response.data)
    var elem = document.getElementById('addCountryModal')
    var instance = M.Modal.getInstance(elem);
    instance.close();
    M.toast({ html: 'Updated Country Successfully.' , classes: "white-text orange rounded" })
    this.setState({countryname:"",countrycode:"",countrytelecode:"",fexdexcode:"", thresh_value:"", def_language:"" })
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


addcountryToDB = async (event)=>{
    event.preventDefault();
    console.log(this.state.countryname + this.state.countrycode+ this.state.countrytelecode +this.state.fexdexcode)
    var countryformdata = new FormData()
    countryformdata.append('country_id',this.state.fexdexcode)
    countryformdata.append('name',this.state.countryname)
    countryformdata.append('telecode',this.state.countrytelecode)
    countryformdata.append('tele_length',this.state.countrytelelength.toString())
    countryformdata.append('fedex_code',this.state.fexdexcode)
    countryformdata.append('threshold_weight',this.state.thresh_value)
    countryformdata.append('default_language',this.state.def_language)
    countryformdata.append('status',"Active")
 
    let url = base_url+'countries/'
    
    try{
      let token = localStorage.getItem("token")
      var config = {
        headers: { 
        'Content-Type': 'multipart/form-data' , 
        'Authorization':'Token '+ token},        
      };
      const response = await Axios.post(url, countryformdata, config)
      console.log(response)
      this.state.countrydata.unshift(response.data)
      var elem = document.getElementById('addCountryModal')
      var instance = M.Modal.getInstance(elem);
      instance.close();
      this.setState({countryname:"",countrycode:"",countrytelecode:"",fexdexcode:"",thresh_value:"", def_language:"" })
      // @Todo: APi to be called to save data
      M.toast({html: 'Added Country Successfully',classes:"white-text orange rounded"})


    }catch(err){
this.setState({
  error:"OH Snap! Something is Wrong.Please try again"
})
M.toast({html: 'Please Try Again!',classes:"white-text red rounded"})

console.log(err.message)
    }

    

}

componentDidMount() {
    // Auto initialize all the things!
    M.AutoInit();
}
render(){

    var sr_no = 0
    const countrytable = this.state.countrydata.map((country)=>{
       sr_no=sr_no+1
      return(
        <Fragment key={sr_no}>
       <tr  >
        <td>{sr_no}</td>
        {/* <td>{country.country_id}</td> */}
        <td>{country.name}</td>
        <td>{country.telecode}</td>
        <td>{country.tele_length}</td>
        <td>{country.fedex_code}</td>
        <td>{country.threshold_weight}</td>
        <td onClick={this.handleEditOption}><a title = "Edit"><EditOutlined/></a></td>   
        <td className="hide">{country.id}</td>
      </tr>
        </Fragment>
      
      )
    })

    const table_render =  <Table hover> 
    <thead>
      <tr>        
        <th>Sr. No.</th>
        {/* <th>Country ID</th> */}
        <th>Country Name</th>
        <th>Country ISD</th>
        <th>Tele length</th>
        <th>Fedex Code</th>
        <th>Threshold</th>
        <th>Edit</th>                 

      </tr>
    </thead>
    <tbody>
    {countrytable}

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
        <div id="addCountryModal" className="modal modal-fixed-footer">
          <div className="modal-content">
            <h4 className="center orange-text"> Add Country </h4>
            <Row>
              <Col xs={12} >
                <p className="center red-text">{this.state.error}</p>
                <form>
                  <Row>
                    <Col className=" rowdivPading " xs={12}>
                      <div className="input-field col s6 offset-s3 center">
                        <input id="country_name" type="text" value={this.state.countryname} onChange={this.handleCountryNameChange} className="" />
                        <label htmlFor="country_name" className="black-text" >Country Name</label>
                        <span className="helper-text left" data-error="wrong" data-success="">Enter a valid Country Name</span>
                      </div>
                    </Col>
                  </Row>
                  {/* <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input id="country_code" type="text" value={this.state.countrycode} onChange={this.handleContryCodeChange} className="" />
                        <label htmlFor="country_code" className="black-text">Country Code</label>
                        <span className="helper-text left" data-error="wrong" data-success="">Enter alphanumeric code</span>
                      </div>
                    </Col>
                  </Row> */}
                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input id="country_telecode" type="text" value={this.state.countrytelecode} onChange={this.handleCountryTeleCode} className="" />
                        <label htmlFor="country_telecode" className="black-text">ISD Code</label>
                        <span className="helper-text left" data-error="wrong" data-success="">Enter Country ISD code ex:0091 for India</span>
                      </div>
                    </Col>
                  </Row>


                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input id="fedex_code" type="text" value={this.state.fexdexcode} onChange={this.handleFedecCodeChange} className="" />
                        <label htmlFor="fexdex_code" className="black-text">FedEx Code</label>
                        <span className="helper-text left" data-error="wrong" data-success="">Enter two digit FedEx code</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input id="country_tele_length" type="number" value={this.state.countrytelelength} onChange={this.handleCountryTeleLength} className="" />
                        <label htmlFor="country_tele_length" className="black-text">Phone number length</label>
                        <span className="helper-text left" data-error="wrong" data-success="">Enter total digits</span>
                      </div>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col className=" rowdivPading ">
                      <div className="input-field col s6 offset-s3 center">
                        <input id="threshValue" type="text" value={this.state.thresh_value} onChange={this.handleThresholdChange} className="" />
                        <label htmlFor="threshValue" className="black-text">Threshold</label>
                        <span className="helper-text left" data-error="wrong" data-success="">Threshold weight for the country</span>
                      </div>
                    </Col>
                  </Row>

                  {
                    this.state.editRow
                    ?""
                    :
                      <Row>
                        <Col className=" rowdivPading ">
                          <div className="input-field col s6 offset-s3 center">
                            {/* <input id="defLanguage" type="text" value={this.state.def_language} onChange={this.handleLanguageChange} className="" /> */}
                            {/* <label htmlFor="defLanguage" className="black-text">Default Languauge</label> */}
                            {/* <span className="helper-text left" data-error="wrong" data-success="">Default Language</span> */}
                            <select id="deflanguage" name="lang" className="black-text" value={this.state.defaultLangauage} onChange={this.handleLanguageChange}>
                              <option value="English" >English</option>
                              <option value="Spanish" >Spanish</option>
                              {/* {selectCounrtyOptions} */}
                            </select>
                          
                          </div>
                        </Col>
                      </Row>
                  }

                  

                </form>
              </Col>
            </Row>
          </div>
          <div className="modal-footer">
            {/* <a href="#!" className="modal-close waves-effect waves-green btn-flat">Agree</a> */}

            <ButtonGroup className="mr-2" aria-label="First group">
              <Button id="cancelCountryBtn" variant="outline-secondary" className="mr-4 btn modal-close " onClick={this.closeModal} >Cancel</Button>
              {
                this.state.editRow
                  ? <Button id="updateCountryBtn" variant="outline-primary" className="mr-2 btn" onClick={this.updateCountryDetailsDB}>Update</Button>
                  : <Button id="addCountryBtn" variant="outline-primary" className="mr-2 btn" onClick={this.addcountryToDB}> Add</Button>
              }
            </ButtonGroup>

          </div>
        </div>



        <div className="">
          <Row>
            <Col xs={12} md={12} lg={12} >
              <div className="tableheight">
                {/* {this.props.countrytable} */}
                {table_render}
              </div>
            </Col>

          </Row>
          <Row>
            <Col >

              <Nav className="right">
                <Nav.Link className="red-text modal-trigger " onClick={this.openCountryDetailsModal}>
                  Add Country Details<Image className="red-text ml-1" src="assets/images/plus-circle-red-m.svg" /></Nav.Link>
              </Nav>


            </Col>
          </Row>
        </div>


</Fragment>

    )
}

}

export default CountryFrag;