import "bootstrap/dist/css/bootstrap.min.css"
import React, { Component, Fragment } from 'react';
import { Redirect } from "react-router-dom"
import { Navbar, Container,Button,Nav,Image,NavDropdown} from 'react-bootstrap';

import './css/customnavbar.css';


class CustomNavBar extends Component {
    constructor(props) {
        super(props);
        let loggedIn = false

        const token = localStorage.getItem("token")
        if (token) loggedIn = true
        this.logout = this.logout.bind(this)
        this.state = {
            loggedIn
        }
        
    }

    logout() {
        this.setState({
            loggedIn: false
        })
    }

   
    render() {
        if (this.state.loggedIn === false) {
            return <Redirect to = "/logout" />
        }
        return ( <Fragment> <div className = "" >
   
  <Navbar className='navbar-default' expand="lg" variant="light" bg="white">
  <Nav className='mr-3'>
     
      <Image src="assets/images/more.png"/>
    </Nav>
    <Navbar.Brand  color="blue" href="#">
        {/* <h1 className="compamny_title"color="primary ">EzzyShip</h1> */}
        <Image src="assets/images/logo.png" className="companylogo"/>
        </Navbar.Brand>
    <Nav className='ml-auto'>
      <Nav.Link onClick = { this.logout }  href="#logout">
        <h6>Logout</h6> 
        {/* <Image src="assets/images/logout.png" className="avatar maringtop"/> */}
      </Nav.Link>
    </Nav>
    {/* <Button onClick = { this.logout }  color=" btn-flat" size="sm">Logout</Button> */}
  </Navbar>

            </div>
            </Fragment>
        )
    }
}

export default CustomNavBar;