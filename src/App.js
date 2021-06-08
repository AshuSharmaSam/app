import React from 'react';
// import logo from './logo.svg';

import './App.css';

import { BrowserRouter,Switch, Route } from "react-router-dom"
import Login from './components/Login';

//  import User from './components/User';
import PropTypes from 'prop-types';
import Logout from './components/Logout';
import Admin from './components/AdminPanel/Admin';
import Operator from './components/OperatorPanel/Operator'
import Viewer, { Worker } from '@phuocng/react-pdf-viewer';

class App extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return (
        
            <>
    
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js"></Worker>
    <BrowserRouter>
    
    <Switch >
            
            <Route exact path = "/"
            component = { Login }
            /> 
            <Route path = "/Admin"
            component = { Admin }
            /> 
             {/* <Route path = "/Operator"
            component = { Operator }
            />  */}
            <Route path = "/logout"
            component = { Logout }
            /> 
             <Route path='/Operator' render={(props) => <Operator {...props} /> } />
            </Switch >
    </BrowserRouter>
    
    
            </>
            
            
        )
    }
}

App.propTypes = {
    match: PropTypes.any.isRequired,
    history: PropTypes.func.isRequired
}
export default App;