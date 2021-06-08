import React,{Fragment} from "react"
import { Redirect } from "react-router-dom"
import CustomNavBar from "./CustomNavBar"
import {Container,Row,Col} from "react-bootstrap"
import SideNavBar from "./CustomSideNav"
import './css/user.css';
export default class User extends React.Component {

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
        return ( 
            
            <div className=''> < CustomNavBar />
                <Fragment >
                    <Row  className="fullheight ">
                        <Col md={2} lg={2} className="" >
                            <div className="sidenav-shadow card fullheight">
                            <SideNavBar />
                            
                            </div>
                        
                        </Col>
                        {/* <Col xs={1} md={1} lg={1}>
                            <div className="v-divider"></div>
                        </Col> */}
                        <Col md={9} lg={9}>
                        <Container className=" fullheight">
                            <div><h2 className="center">User Authenticated</h2></div>
                        </Container>
                        </Col>
                    </Row>
              
                </Fragment>
                
            </div>
        )
    }
}