import React ,{Component} from 'react';

import {Alert} from 'react-bootstrap';


class Error extends Component{

    render(){
        return(
            <Alert variant="danger">
  <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
  <p>
  Please check your connectivity and retry again!. There may be chances of server being down.
  </p>
 

</Alert>
        )
    }
}

export default Error;

