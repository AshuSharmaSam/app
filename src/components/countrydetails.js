import React, {Component,Fragment} from 'react';
import {ButtonToolbar,ButtonGroup,Button} from 'react-bootstrap';

class DbCountry extends Component{
    constructor(props){
        super (props);
    }


    render(){
        return(
<Fragment>
<ButtonToolbar aria-label="Toolbar with button groups">
  <ButtonGroup className="mr-2" aria-label="First group">
    <Button variant="outline-primary" className="mr-2">Country</Button> <Button> State</Button> <Button>Operator</Button> <Button>Rules</Button>
    <Button>Category</Button><Button>Warehouse</Button>
  </ButtonGroup>

</ButtonToolbar>
</Fragment>
        )
    }
}

export default DbCountry;