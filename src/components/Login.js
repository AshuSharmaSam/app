import React from "react"
import { Redirect } from "react-router-dom"
import Axios from "axios"

// import { Button,  } from 'react-materialize';
import {  Container, Row, Col, Card, Image } from 'react-bootstrap';
import './css/login.css';
import { base_url } from "../globalConstants";
import { subject } from "../service";

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        let loggedIn = false

        const token = localStorage.getItem("token")
        if (token) loggedIn = true

        this.state = {
            username: "",
            password: "",
            loggedIn,
            error: "",
            userType: "",
            userId: ""
        }
        this.onChange = this.onChange.bind(this)
        this.formSubmit = this.formSubmit.bind(this)
    }

    onChange(ev) {
        this.setState({
            [ev.target.name]: ev.target.value
        })
    }

    async formSubmit(ev) {
        ev.preventDefault()
        // const { username, password } = this.state
    
        var bodyFormData = new FormData()
        bodyFormData.append('email', this.state.username)
        bodyFormData.append('password', this.state.password) 
        const config={
            headers: {'Content-Type': 'multipart/form-data' }
        }
        // const headers= {'Content-Type': 'multipart/form-data' }
    
        try {
      
            const token = await Axios.post(base_url+"obtain_token/",bodyFormData, 
            config
            );
            console.log(token.data)
                        
            localStorage.setItem("token", token.data.token)
            sessionStorage.setItem("token", token.data.token)
            sessionStorage.setItem("user_id", token.data.user.Id)
            sessionStorage.setItem("user_type",token.data.user.Type)
            this.setState({
                loggedIn: true,
                userType: token.data.user.Type,
                userId: token.data.user.Id
            })  
            this.sendMessage(token.data.token)
        } catch (err) {
            this.setState({
                // error: err.message
                error: "Invalid Username/ Password"
            })
        }
    }

    sendMessage = (tempToken) => {
        subject.next(tempToken)
    }

    render() {
        // @TODO add fucntionality of routing respectively to admin or operator
        //Hey...fd
        //  let panel ="Operator"
         let panel = this.state.userType
        if (this.state.loggedIn === true && panel=== "Operator" ) {

            // return <Redirect to = "/Operator" />
            return <Redirect to={{
                pathname: "/Operator",
                state: { operator_id: this.state.userId }
              }} />
        }
        if (this.state.loggedIn === true && panel=== "Admin" ) {

            return <Redirect to = "/Admin" />
        }
        return ( < Container className = "" > 
        <div className="grandParentContaniner">

            <div className="parentContainer ">

            <Row>
            <Col className = "card-center" style={{ textAlign: "center", marginTop: "10px" }}>
            {/* <Image  src = "assets/images/logo.png"className = "align-row imgsize" /> */}
            <Image  src = "assets/images/Ezzyship.png" className = "" />
            </Col>
            
        </Row>
        <Row>
        <Col>
            <h5 className="text-purple align-row">Please Login to your Ezzyship Account</h5>
            </Col>

        </Row>
   <Row>
       <Col>
       
       <Card className = "" 
            style = {
                { width: '19rem' }

            } >
            
          
            <Card.Body >  
            <form onSubmit = { this.formSubmit } > < Row > < Col > 
            {/* <p>UserName</p>  */}
            <input type = "email" placeholder = "Username" className = "input-text"
            value = { this.state.username } onChange = { this.onChange } name = "username" id = 'username' /> 
            </Col>  </Row > < Row > < Col > 
            {/* <p>Password</p>    */}
            <input id = "password"   type = "password" className = "input-text" placeholder = "Password" value = { this.state.password }
            onChange = { this.onChange } name = "password" />
            </Col> 
            </Row> <Row>
            <Col >
            <input id = "submit" className = "btn  submit btn-md btn-block" type = "submit" block=
            "true" value="Login" />
            </Col> </Row>




            <p className="red-text">{ this.state.error }</p> </form> <p className="center">Copyright © EzzyShip { new Date().getFullYear() }</p>  </Card.Body > </Card>

       
       </Col>
   </Row>
        





            </div>

        </div>
       


            </Container>



        )
    }
}