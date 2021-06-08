import React from "react"
import {Redirect} from "react-router-dom"
import Axios from "axios"

export default class Logout extends React.Component{

    constructor(props){
        super(props)
        // token removes
        localStorage.removeItem("token")
    }

   
    render(){
        return <Redirect to="/" />
    }
}