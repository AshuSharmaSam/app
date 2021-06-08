import React ,{Component} from 'react';

import {Alert} from 'react-bootstrap';


class Success extends Component{
constructor(props){
    super (props);
}

    render(){
        return(
            <Alert variant="success">
  <Alert.Heading>YAY! Operation Successful!</Alert.Heading>
  <p>
  {this.props.message}
  </p>
 

</Alert>
        )
    }
}

export default Success;

