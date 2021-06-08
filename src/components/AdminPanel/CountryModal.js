import React,{Component,Fragment} from 'react';
import {Modal,Button} from 'react-bootstrap';

class  AddCountry extends Component {
    constructor(props){
        super(props);
        this.state = ({
            open: false
        })
    }
    // const [show, setShow] = useState(false);
  
    handleClose = () => this.setState({open: !this.state.open});
     handleShow = () => this.setState({open: !this.state.open});
 
   render()
   { return (
      <div className="">
        {/* <Button variant="primary" onClick={handleShow}>
          Launch demo modal
        </Button> */}   
        
        <Modal show={this.state.open} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );}
  }
  export default AddCountry;