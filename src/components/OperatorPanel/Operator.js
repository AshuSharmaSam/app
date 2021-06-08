// @ts-nocheck
import React, {Component,Fragment} from 'react';
import {Redirect} from 'react-router-dom';
import 'materialize-css/dist/css/materialize.min.css';
import M from "materialize-css";
import Axios from "axios";
import Error from '../AdminPanel/Error'
import { Image,Nav,Row,Col,Card,Container,Spinner} from 'react-bootstrap';
import { Switch, Route } from 'react-router-dom'
import Dashboard from './Dashboard';
import CreateOrder from './CreateOrder';
import OrderList from './OrderList';
import ReadyShip from './ReadyToShip';
import BoxList from './BoxList';
import CustomSettlement from './CustomSettlement';
import Shipped from "./Shipped";
import Reports from './Reports'
import PropTypes from 'prop-types';
import { base_url } from '../../globalConstants'
import './operator.css';
import { subject } from '../../service';
import IdleTimer from 'react-idle-timer'
import { ModalHeader, ModalBody, ModalFooter, Modal,Button  } from 'reactstrap';
import { ListAlt } from "@material-ui/icons";

import { IdleTimeOutModal } from './IdleTimeModal';
import Logout from '../Logout';

class Operator extends Component {

  constructor(props) {
    super(props)

console.log(sessionStorage.getItem('user_type'))
// dummy Dashboard rows




    // var loggedIn = false
     let dummydashboard =<Dashboard/>
  
    this.logout = this.logout.bind(this)
    // let order = [{ordernumber:'9874434',customerid:'Ezzy000111',country:"India",
    // inboundnumber:"1232400000434",outboundnumber:"0871111166"}]
  
      //  this.timeout= 1000 * 10
      if(sessionStorage.getItem('user_type')==="Operator"){

      }
    this.state = {
      loggedIn:false,
      // timeout:1000 * 1 ,
        displayContent:<Dashboard/>,
        dummydashboard:dummydashboard,
        showSpinner:false,
        // operatorId: this.props.location.state.operator_id
        redirectoLogin:false
    }

    // console.log("USER_ID", this.props.location.state.operator_id)
    // console.log("USER_ID", this.state.operatorId)

    this.state = {
      
      showModal: false,
      userLoggedIn: false,
      isTimedOut: false,
      sessionTimeoutModalOpen:false
    }

    this.idleTimer = null
        this.onAction = this._onAction.bind(this)
        this.onActive = this._onActive.bind(this)
        this.onIdle = this._onIdle.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    
}

_onAction(e) {
  // console.log('user did something', e)
  this.setState({isTimedOut: false})
}

_onActive(e) {
  // console.log('user is active', e)
  this.setState({isTimedOut: false})
}

_onIdle(e) {
  // console.log('user is idle', e)
  const isTimedOut = this.state.isTimedOut
  if (isTimedOut) {
      this.props.history.push('/logout')
  } else {
    this.setState({sessionTimeoutModalOpen: true})
    this.idleTimer.reset();
    this.setState({isTimedOut: true})
  }
  
}


handleLogout() {
  this.setState({sessionTimeoutModalOpen: false})
  this.props.history.push('/logout')

  localStorage.removeItem('token')
  window.location.reload()
}

componentDidMount() {
  // Auto initialize all the things!
  const token = sessionStorage.getItem("token")
  console.log("super token operator",token)
  console.log(token !== null)
  if (token!== null) {this.setState ({
    loggedIn:true
  })
  }else{
    this.setState ( {
      loggedIn:false
    })
  }
  M.AutoInit();
    // this.subscription = subject.subscribe(res => 
    // console.log('RECEIVED TOKEN',res))


}

componentWillUnmount(){
  // this.subscription.unsubscribe()

}



logout() {
  this.setState({
      loggedIn: false
  })
}

dashboardDummy = ()=>{
  
  this.setState({displayContent:<Dashboard/>})
}

getReports = async ()=>{

  let url = base_url+`countries/?list=True/`

  const response_countrylist = await Axios.get(url)
  console.log(response_countrylist.data)
  let countrylist = []
  for (var key in response_countrylist.data) {
    countrylist.push(response_countrylist.data[key].name)
  }
  console.log('countrylist',countrylist)
  this.setState({displayContent:<Reports countryList = {countrylist} />})
}

createOrder = ()=>{
  this.setState({displayContent:<CreateOrder refresh={this.createOrder}/>})
}

 customSettlement=()=>{
  this.setState({displayContent: <CustomSettlement refresh={this.customSettlement}/>})
}


shipped=()=>{
  this.setState({displayContent: <Shipped refresh={this.shipped}/>})
}

readyToShip= ()=>{

  this.setState({displayContent: <ReadyShip/>})
}

orderList = async (props)=>{
  await this.setState({
    showSpinner:true
  })

  // const operatorId = this.state.operatorId
  // const operatorId = this.props.location.state.operator_id
  // console.log('OPT ID', operatorId);

try{
  const response = await Axios.get(base_url+"boxes_received/")
      // console.log(response.data.results)
      // console.log("COutnry data"+response.data )
      this.setState({
        displayContent: <OrderList orderdata = {response.data.results} orderResponse = {response.data} />,
        showSpinner:false
      })
}catch(err){
 
  M.toast({html: 'Please Try Again!',classes:"white-text red rounded"});
  
  console.log(err)
  this.setState({error:<Error/>})
      }
    
}


boxList = async ()=>{
  await this.setState({
    showSpinner:true
  })

try{
  // const response = await Axios.get(base_url+"boxes_out/")
  const response = await Axios.get(base_url+"boxes_out/?box_id=&ezz_id=&not_shipped=Shipped")
      // console.log(response.data)
      // console.log("COutnry data"+response.data )
      this.setState({
        displayContent: <BoxList boxdata = {response.data.results} boxResponse = {response.data} />,
        showSpinner:false
      })
}catch(err){
 
  M.toast({html: 'Please Try Again!',classes:"white-text red rounded"});
  
  console.log(err)
  this.setState({error:<Error/>})
      }
    
}







functionalityNotAvailable= ()=>{

    M.toast({html: 'Functionality Not Available',classes:"white-text red rounded"})
  
 


}

login=()=>{
  localStorage.removeItem("token")
  console.log('token',localStorage.getItem("token"))
this.logout()
  // this.setState({redirectoLogin:true})

  // this.setState({
  //   redirectoLogin:true
  // })
  // window.location.reload();
}


  
    
    render() {
      const { match } = this.props
      // if (this.state.redirectoLogin === true ){
      //   return <Redirect to = "/"/>
      // }
      {
        if(sessionStorage.getItem('user_type')==="Admin"){
          return <Redirect to = "/logout"/>
        }
      }
      
      if (this.state.loggedIn === false ){
        return <Redirect to = "/logout"/>
      }
      
        return(
        <Fragment>
           {/* Dropdown Structure */}

            <IdleTimer
              ref={ref => { this.idleTimer = ref }}
              element={document}
              onActive={this.onActive}
              onIdle={this.onIdle}
              onAction={this.onAction}
              debounce={250}
              timeout={1000 * 600}  
              // timeout={1000 * 6000}             //WHEN TESTING/DEV 
            />          
            <IdleTimeOutModal
                    showModal={this.state.sessionTimeoutModalOpen} 
                    // handleClose={this.handleClose}
                    handleLogout={this.handleLogout}
                />
   <Switch>
                    <Route 
                        exact path={`${match.path}logout`}
                        render={(props) => <Logout {...props} /> }/>
                  
                </Switch>
<ul id="profile" className="dropdown-content">
  <li><a onClick = { this.logout }href="">Logout</a></li>
</ul>
    <nav className="white black-text " role="navigation">
    <ul className="left ">
        <li><a href="#" data-target="slide-out" className="sidenav-trigger show-on-large">
          <i className="material-icons black-text">menu</i></a>
        </li>
      </ul>

    {/* <div className="nav-wrapper  "><p id="logo-container"  className="brand-logo center compamny_title indigo-text ">Ezzy<span className="orange-text">Ship</span></p> */}
    <div className="nav-wrapper  "><p id="logo-container"  className="brand-logo center compamny_title orange-text ">Operator</p>
<ul className="right ">
  <li className="grey-text text-darken-4">{sessionStorage.getItem('user_id')}</li>
<li><a className="dropdown-trigger " href="#!" data-target="profile">
  <Image src="assets/images/avatar.svg" className="" /></a></li>

  </ul>      
    </div>
  </nav>
  <ul id="slide-out" className="sidenav sidenav-fixed ">
    <br></br>
      <li style={{ textAlign: "center" }}><Image src="assets/images/Ezzyship.png" className="" /></li>
  
      <Fragment> 
      <br></br>
              

  <Nav defaultActiveKey="/Dashboard" className="flex-column ">
            <Nav.Link href="" onClick={this.dashboardDummy} className="sidenav_item_hover sidenav-close black-text"><Image className="mr-2 " src = "assets/images/dashboard.png"/>Dashboard</Nav.Link>
                <Nav.Link href=""
                //  onClick={this.databaseOption.bind(this)} 
                onClick={this.functionalityNotAvailable}
                className="sidenav_item_hover sidenav-close black-text"><Image className="mr-2 " src = "assets/images/userprofile.svg"/>Users</Nav.Link>
                
                <ul className="collapsible collapsible-accordion">
          <li className="sidenav_item_hover ">
            <Nav.Link className="collapsible-header sidenav_item_hover black-text "><Image className="mr-1"  src = "assets/images/ls_dropdown.svg"/><Image className="mr-2 "  src = "assets/images/shopping-bags.svg"/>Orders</Nav.Link>
            <div className="collapsible-body">
              <ul className="center grey lighten-2">
                <li ><Nav.Link id="createorder" onClick={this.createOrder} className="ml-3" href="" >Create Order</Nav.Link></li>
                <li ><Nav.Link  onClick={this.orderList}>Order List</Nav.Link></li>
                <li><Nav.Link onClick={this.boxList} className="mr-3" href="">Box List</Nav.Link></li>
                {/* <li><Nav.Link onClick={this.readyToShip} className="ml-3" href="">Ready to Ship</Nav.Link></li> */}
                <li><Nav.Link onClick={this.customSettlement} className="ml-3" href="">Custom Settlement</Nav.Link></li>
                <li><Nav.Link onClick={this.shipped} className="ml-3" href="">Shipped</Nav.Link></li>
              </ul>
            </div>
          </li>
        </ul>
                {/* <Nav.Link eventKey="link-1" className="sidenav_item_hover sidenav-close"><Image className="mr-2 "  src = "assets/images/shopping-bags.svg"/>Orders</Nav.Link> */}
       
                
                </Nav>
            <Nav.Link href="" onClick={this.getReports} className="sidenav_item_hover sidenav-close black-text"><ListAlt/> Reports</Nav.Link>
 
                {/* <Image src="assets/images/operatorside.png" className="sidenav_botom_Image"/> */}
            
            </Fragment>
    </ul>
    <main>
    <div className=" ">
    <br></br>
    <div className="" >
    {
          this.state.showSpinner
            ? < div className="center">
          
            <Spinner animation="grow" variant="primary" size="sm" />
            <Spinner animation="grow" variant="success" size="sm" />
            <Spinner animation="grow" variant="warning" size="sm" />
          </div>
            : null
        }
           {this.state.displayContent}
   

    </div>
   <br></br>
  </div>  
      </main>
  
        </Fragment>
        )
    }
}
Operator.propTypes = {
  match: PropTypes.any.isRequired,
  history: PropTypes.func.isRequired
}

export default Operator;