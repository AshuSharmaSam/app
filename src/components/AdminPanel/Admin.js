import React, {Component,Fragment} from 'react';
import { base_url } from '../../globalConstants';
import {Redirect} from 'react-router-dom';
import Axios from "axios"
import DbCountry from './CountryDetails';
import Error from './Error';
import M from "materialize-css";
import { Image,Nav,Container} from 'react-bootstrap';



class Admin extends Component {

  constructor(props) {
    super(props);
    let loggedIn = false
    let dboptionselected =<div></div>
    const token = localStorage.getItem("token")
    if (token) loggedIn = true
    this.logout = this.logout.bind(this)
     
    this.state = {
        loggedIn:loggedIn,
        dboptionselected:dboptionselected,
        error:""
    }
    
}

logout() {
  this.setState({
      loggedIn: false
  })
}
databaseOption(){
//   this.setState({
//     dboptionselected: <DbCountry countrydata="CountrydatafromParent"/>
// })
this.getCountryData()
}

getCountryData = async ()=> {
       
  try{
  const response = await Axios.get(base_url+'countries/')

this.setState({
  dboptionselected: <DbCountry countrydata={response.data}/>
  ,})

}
catch(error){
 console.log("Error",error);
 this.setState({error:<Error/>})
}

  

}



componentDidMount() {
  // Auto initialize all the things!
  M.AutoInit();
  const token = sessionStorage.getItem("token")
  console.log("super token admin",token)
}
functionalityNotAvailable= ()=>{

  M.toast({html: 'Functionality Not Available',classes:"white-text red rounded"})




}
    render() {
      
        // if(sessionStorage.getItem('user_type')==="Operator"){
        // this.setState({loggedIn:false})
        // }
    
        {
          if(sessionStorage.getItem('user_type')==="Operator"){
            return <Redirect to = "/logout"/>
          }
        }

      if (this.state.loggedIn === false){
        return <Redirect to = "/logout"/>
      }
      
        return(
        <Fragment>
           {/* Dropdown Structure */}
<ul id="profile" className="dropdown-content">
  <li><a onClick = { this.logout }href="">Logout</a></li>
</ul>
    <nav className="white black-text " role="navigation">
    <ul className="left ">
        <li><a href="#" data-target="slide-out" className="sidenav-trigger show-on-large">
          <i className="material-icons black-text">menu</i></a>
        </li>
        </ul>
    {/* <div className="nav-wrapper "><p id="logo-container"  className="brand-logo center  compamny_title indigo-text ">Ezzy<span className="orange-text">Ship</span></p> */}
    <div className="nav-wrapper "><p id="logo-container"  className="brand-logo center  compamny_title orange-text ">Admin</p>
<ul className="right ">
  <li className="grey-text text-darken-4">{sessionStorage.getItem('user_id')}</li>
<li><a className="dropdown-trigger " href="#!" data-target="profile">
  <Image src="assets/images/avatar.svg" className="" /></a></li>

  </ul>      
    </div>
  </nav>
  <ul id="slide-out" className="sidenav sidenav-fixed ">
    <br></br>
      <li style={{ textAlign: 'center' }} ><Image src="assets/images/Ezzyship.png" className="" /></li>
  
      <Fragment> 
      <br></br>
              

  <Nav defaultActiveKey="/Dashboard" className="flex-column">
            <Nav.Link href="" onClick={this.functionalityNotAvailable} className="sidenav_item_hover sidenav-close"><Image className="mr-2 " src = "assets/images/dashboard.png"/>Dashboard</Nav.Link>
                <Nav.Link href="" onClick={this.databaseOption.bind(this)} className="sidenav_item_hover sidenav-close"><Image className="mr-2 " src = "assets/images/database.png"/>Database</Nav.Link>
                <Nav.Link onClick={this.functionalityNotAvailable} eventKey="link-1" className="sidenav_item_hover sidenav-close"><Image className="mr-2 "  src = "assets/images/user.png"/>Access Control</Nav.Link>
                <Nav.Link onClick={this.functionalityNotAvailable} eventKey="link-2" className="sidenav_item_hover sidenav-close"> <Image className="mr-2 " src = "assets/images/analytics.png"/>Analytics</Nav.Link>
                
                </Nav>
 
                <Image src="assets/images/ShopIllus.png" className="sidenav_botom_Image"/>
            
            </Fragment>
    </ul>
    <main>
  <Container>
  <div  id =""className="flex-container ">
    <br></br>
    <div className="flex-item" >
    <br></br>
    
           {this.state.dboptionselected}
           {this.state.error}


    </div>
   <br></br>
  </div>
    </Container>  
      </main>
  
        </Fragment>
        )
    }
}

export default Admin;