import React, {Component} from 'react';
import {Row, Col,ButtonGroup,Button,Spinner} from 'react-bootstrap';
import M from 'materialize-css';
import Axios from "axios";
import { base_url } from '../../globalConstants';

//css is in orderlist.css

class EditBox extends Component{
    constructor(props){
        super(props);
        this.state=({
            boxid:this.props.boxid,
            boxStatusSelected:"WFC",
            Products:[]
        })

    }

    componentDidMount(){
        M.AutoInit()
    }

    componentDidUpdate(prevProps) {


        if (this.props.boxid !== prevProps.boxid) {

                this.setState({
                    boxid:this.props.boxid
                })
        }}
    openModal = ()=>{
        console.log("inside editboxmodal");
       //  console.log(orderdata);
       var elems = document.getElementById("editboxModel");
       var instance = M.Modal.init(elems);
       instance.open()
       // orderselectionmodal
   }
   closeModal = ()=>{
       var elems = document.getElementById("editboxModel");
       var instance = M.Modal.init(elems);
       instance.close()
   }



   handleFormChange=(event)=>{
    const name = event.target.name
    console.log(name);
    const value = event.target.value
    console.log(value)
    this.setState(
            { [name] : value }
        )

        //console.log(this.state.boxStatusSelected, 'show status here')

   }
   updateBoxrDB = async()=>{
       let localBoxStatus=this.state.boxStatusSelected;

    
    let token =localStorage.getItem("token")
    let config = {
        headers: { 'Content-Type': 'multipart/form-data' , 'Authorization':'Token '+token}
        
      };
             Axios({
                method:"GET",
                url: base_url+`boxes_out/${this.state.boxid}/`
            })
            .then(function(response){
                console.log(response.data.products);
           // console.log(this.state.boxStatusSelected)
                var product=response.data.products;
                console.log(product);
               // this.setState({Products: product});

               product.map(key=>{
                   console.log('i am inside map')
                  // console.log(this.state.boxStatusSelected)
                    Axios({
                        method: "patch",
                        url: base_url+`boxes_received/${key.order_id}/ `,
                        data: {
                          
                            "current_status" : localBoxStatus
                            
                        },

                    

                       // headers: { 'Content-Type': 'application/json' , 'Authorization':'Token '+token}
                    }).then(function(response){
                        console.log(response);
                        console.log('updation successfull');
                        M.toast({html: 'Box updation Successfull',classes:"white-text blue rounded"});
                    
                    }).catch(function(response){
                        console.log(response);
                        console.log('failure');
                        M.toast({html: 'Box updation Failed',classes:"white-text red rounded"});
                    })
                } )

               

    }).catch(function(response){
        console.log(response);
    })

    Axios({
        method:"patch",
        url: base_url+`boxes_out/${this.state.boxid}/`,
        data: {
            "box_status" : "DISC"
        }
    }).then(function(response){
        console.log(response);
        console.log('discard success');
        //M.toast({html: 'Box Discarded Successfully',classes:"white-text blue rounded"});
    }).catch(function(response){
        console.log(response);
        console.error('discard error');
        //M.toast({html: 'Box discard failed',classes:"white-text red rounded"});
    })


}
//        try {
//            const  boxupdate = {"box_status": this.state.boxStatusSelected}
//            let urlboxUpdate = base_url+`boxes_out/${this.state.boxid}/`
//     await Axios.patch(urlboxUpdate,boxupdate, config)
//     M.toast({html: 'Box updation Successfull',classes:"white-text blue rounded"});
//        } catch (error) {
//         M.toast({html: 'Box updation failed'+error.response.status,classes:"white-text blue rounded"});
//        }
//    }
render(){
    return(
    
      
      <div id="editboxModel" className="modal editboxModel  modal-fixed-footer">
      <div className="modal-content ">
          <div className="">

        
      <h4 className="center orange-text"> Edit Box </h4>



    <form >

    
      <div className="row ">
        <div className="col  s6 l6">
            {/* Order Status Radio Buttons */}
                <h4>Order Status</h4>
                <p>
            <label>
                <input name="boxStatusSelected" value="WFC" type="radio" 
                checked={this.state.boxStatusSelected ==="WFC"} onChange={this.handleFormChange}/>
                <span>Waiting for Consolidation</span>
            </label>
            </p>
            <p> 
            <label>
                <input name="boxStatusSelected" value="RTM" type="radio" 
                 checked={this.state.boxStatusSelected ==="RTM"} onChange={this.handleFormChange}/>
                <span >Ready To Manifest</span>
            </label>
            </p>
        
        </div>
        </div>


        </form>
        </div>
      </div>
      <div className="modal-footer">
     
      <ButtonGroup className="mr-2" aria-label="First group">
      <Button id="closeEditBoxBtn" variant="outline-secondary" className="mr-4 btn modal-close "  >Close</Button> 
      <Button id ="updateBoxBtn" variant="outline-primary" className="mr-2 btn modal-close" 
       onClick={this.updateBoxrDB}
      > Update</Button>
  
    </ButtonGroup>
      </div>
      </div>

     
    )
}

}
export default EditBox;