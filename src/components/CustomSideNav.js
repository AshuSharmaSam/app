import React, { Component,Fragment } from 'react';
import { Redirect } from "react-router-dom"
import { Navbar,Nav,Image} from 'react-bootstrap';
import "./css/customsidenav.css"

class SideNavBar extends Component{
    constructor(props){
        super (props);

        this.state = {
            contentfragment:"<div>Hey</div>",
          };

    }

    DatabaseClick(){
        return  
    }

    render(){

        return (
            <Fragment> 
            
              

  <Nav defaultActiveKey="/Dashboard" className="flex-column">
            <Nav.Link href="/Dashboard" className="sidenav_item_hover"><Image className="mr-2 " src = "assets/images/dashboard.png"/>Dashboard</Nav.Link>
                <Nav.Link href="/Database" className="sidenav_item_hover"><Image className="mr-2 " src = "assets/images/database.png"/>Database</Nav.Link>
                <Nav.Link eventKey="link-1" className="sidenav_item_hover"><Image className="mr-2 "  src = "assets/images/user.png"/>Access Control</Nav.Link>
                <Nav.Link eventKey="link-2" className="sidenav_item_hover"> <Image className="mr-2 " src = "assets/images/analytics.png"/>Analytics</Nav.Link>
                
                </Nav>
 
                <Image src="assets/images/ShopIllus.png" className="sidenav_botom_Image"/>
            
            </Fragment>
        )
    }
}

export default SideNavBar;