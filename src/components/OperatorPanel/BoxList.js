import React, { Component, Fragment, useContext } from 'react';
import { Spinner, Card, ButtonGroup, Button, Nav, Image, Row, Col, Container, Accordion, Table, InputGroup, FormControl, Modal } from 'react-bootstrap';
import Axios from "axios";
import M from "materialize-css";
import { Close, Print, Search, NavigateBefore, NavigateNext} from "@material-ui/icons";
import DoneIcon from '@material-ui/icons/Done';
import EditBox from './EditBoxModal';
import ProductItemsList from './ProductItemListCard';
import ClearIcon from '@material-ui/icons/Clear';
import { base_url } from '../../globalConstants';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
//using ordlistcss
import './orderlist.css';
import context from 'react-bootstrap/esm/AccordionContext';


// class Queue {
//   constructor(){
//     this.data=[];
//     this.rear=0;
//     this.size=

//   }
// }


const useStyles = theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
});


// const styleBackdrop = {
//   zIndex:  "1",
//   position: 'relative',
//   color: '#fff',
// }

var otherBoxes=async()=>{};
class BoxList extends Component {

  
  constructor(props) {

   

    super(props);

    //  this.state=({country:<CountryFrag countrytable = {this.props.countrydata}/>})
    // this.fetchCountryData =  this.fetchCountryData.bind(this)
    // console.log(this.props.boxdata);

    
    this.state = ({
      boxlist: this.props.boxdata,
      previouSelectedBox: "",
      orderweights: {},
      totalweight: 0,
      boxselectedlist: [],
      boxforedit: null,
      parentboxSelected: null,
      customerinfo: {},
      productlist: null,
      productlisthtml: <div></div>,
      checkTotalWeight: 0,

      boxWeightList: {},
      thresholdList: {},
      // boxlistWithRatedWeight = {box}

      tempBoxId: "",
      tempBoxId2: "",
      remarksTextValue: "",
      OnHoldValue: {},
      remarksOnHoldList: {},
      checkedTrueFalse: "",
     ParentBoxFreightSuccess: false,
     ParentBoxCustomSuccess: false,
     ParentFreightCharge:null,
     ParentCustomCharge: null,
     FreightChargeSuccess:[],
     CustomSuccess:[],
     AllSuccess:[],
     FreightFail:[],
     CustomFail:[],
     FreightCharge:[],
     CustomCharge:[],
      boxselecteddata:{},
     AlterFreightCharge:[],
     AlterCustomCharge:[],

     FedExTrackingData:[],
     AlternateBoxData:[],
     RatedWeight:[],
     TotalRatedWeight:0,

     Loader:false,

     box_response: this.props.boxResponse,

     previousPageUrl: this.props.boxResponse.previous,
     nextPageUrl: this.props.boxResponse.next,
     currentPageNumber: 1,

     currentBoxListCount: this.props.boxdata.length,
     searchResultsCount: -1,
     totalBoxListCount: this.props.boxResponse.count,

     isTotalBoxWeight: false,
     remainingSpace: 0,
     freedSpace: 0,
     countryThreshold: 0,

     isBackdrop: false,
     isFedexSuccess: false,
     showPaymentProcess: false,
     errorType:"",
     failureErrorMessage: "",
     filterBoxlistString: "",

    })

    this.handleChangeRemarksText = this.handleChangeRemarksText.bind(this);
    this.handleChangeRemarksTextEdit = this.handleChangeRemarksTextEdit.bind(this);

  }


  

    // Threshold check start

  getBoxWeight = (selectedBoxId, selectedCountry, checkedValue) => {

    var thresholdValue = this.state.thresholdList[selectedBoxId]
    var total_weight = this.state.checkTotalWeight 
    var boxWeight = this.state.boxWeightList[selectedBoxId]
    var remainingSpace = thresholdValue - total_weight
    console.log(thresholdValue);

    this.setState({countryThreshold: thresholdValue})
    
    if(thresholdValue != null){
      this.setState({isTotalBoxWeight: true})
            
      if (checkedValue) {

        console.log("Selected box weight:", boxWeight);

        total_weight = total_weight + boxWeight
        remainingSpace = remainingSpace - boxWeight
        this.setState({
          checkTotalWeight: total_weight,
          remainingSpace: remainingSpace,
          freedSpace: 0
        })
        console.log("TOTAL WEIGHT::", total_weight);
        console.log("TOTAL WEIGHT::", this.state.checkTotalWeight);
        console.log("REMAINING SPACE::", remainingSpace);

        if (total_weight == thresholdValue) {
          M.toast({
            html: `Threshold (${selectedCountry}): ${thresholdValue} <br/>
                Total Weight: ${total_weight}; ✓  <br/>`,
            classes: "white-text lime rounded"
          })
        } else {
          total_weight < thresholdValue
            ? M.toast({
              html: `Threshold (${selectedCountry}): ${thresholdValue} <br/>
                More boxes can be added for weigth: ${remainingSpace}; ✓  <br/>`,
              classes: "white-text green rounded"
            })
            // ? M.toast({ html: `✓ Threshold (${countryOfSelectedOrder}): more boxes can be added `, classes: "white-text lime rounded" })
            : M.toast({
              html: `Threshold (${selectedCountry}): ${thresholdValue} <br/>
                Total weight: ${total_weight}; remove some boxes ✗  `,
              classes: "white-text orange rounded"
            })
        }

      } else {

        console.log("Selected box weight:", boxWeight);

        total_weight = total_weight - boxWeight
        remainingSpace = remainingSpace + boxWeight
        this.setState({
          checkTotalWeight: total_weight,
          remainingSpace: remainingSpace,
          freedSpace: boxWeight
        })

        console.log("TOTAL WEIGHT::", total_weight);
        console.log("TOTAL WEIGHT::", this.state.checkTotalWeight);
        console.log("REMAINING SPACE::", remainingSpace);

        if (total_weight > thresholdValue) {
          M.toast({
            html: `Freed space: ${boxWeight} <br/> Weight that can be added: 0`,
            classes: "white-text blue rounded"
          })
        } else {
          M.toast({
            html: `Freed space: ${boxWeight} <br/> Weight that can be added: ${remainingSpace}`,
            classes: "white-text blue rounded"
          })
        }

      }
    }else{
      M.toast({
        html: `Invalid selection`,
        classes: "white-text red rounded"
      })
    }

  }

  clearWeightCalculations = () =>{

    this.setState({
      isTotalBoxWeight: true
    })
    
  }

  // Threshold check end

  ////On HOLD check 

  handleChangeRemarksText(event) {
    this.setState({ remarksTextValue: event.target.value });
  }

  handleChangeRemarksTextEdit(event) {
    this.setState({ remarksTextValue: event.target.value });
  }

  onChangeOnHold = (event) => {

    this.setState({
      tempBoxId: event.target.value,
      checkedTrueFalse: event.target.checked
    })

    var weight = event.target.name
    var totWeight

    if (event.target.checked) {
      // alert(event.target.checked)
      // alert(event.target.value)


      var shipChecked = document.getElementById(`ship${event.target.value}`)

      if (shipChecked.checked) {
        shipChecked.checked = false
        console.log("event.target.name", event.target.name)
        console.log("weight", weight)

        totWeight = this.state.checkTotalWeight - weight
        console.log("weight", weight)

        this.setState({ checkTotalWeight: totWeight }, () => {
          console.log("this.state.checkTotalWeight", this.state.checkTotalWeight)
        });

        M.toast({
          html: `Freed space: ${weight} <br/> Total weight: ${totWeight}`,
          classes: "white-text blue rounded"
        })
      }
      document.getElementById(`ship${event.target.value}`).disabled = true

      this.checkedOnHold(event.target.value, event.target.checked)


      var elems = document.getElementById("remarksForOnHold");
      var instance = M.Modal.init(elems);
      instance.open()
      return;

    } else {
      // alert(event.target.checked)
      // alert(event.target.value)
      document.getElementById(`ship${event.target.value}`).disabled = false

      this.checkedOnHold(event.target.value, event.target.checked)

    }

  }

  saveOnHoldRemarks = () => {

    // alert(this.state.tempOrderId)
    // console.log(this.state.tempOrderId);

    var temp_boxId = this.state.tempBoxId

    this.statusOnHoldRemarks(temp_boxId)

  }

  statusOnHoldRemarks = async (tempId) => {

    console.log(tempId);

    let remarksData = this.state.remarksTextValue
    console.log(remarksData);

    let token = localStorage.getItem("token")
    let header = {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Token ' + token,

    }
    var config = {
      headers: { 'Content-Type': 'multipart/form-data', 'Authorization': 'Token ' + token },

    };

    try {

      var remarksOnHold = new FormData()
      remarksOnHold.append("remarks", remarksData)

      let remarksOnHoldurl = base_url+`boxes_out/${tempId}/`

      const remarksOnHold_response = await Axios.patch(remarksOnHoldurl, remarksOnHold, config)
      console.log(remarksOnHold_response.data.remarks)
      M.toast({
        html: 'Remarks added for BoxID: ' + tempId + '<br/> Please refresh' , classes: "white-text blue rounded"
      })

    } catch (error) {
      console.log(error)
      M.toast({ html: 'Failed to add remarks', classes: "white-text orange rounded" });
    }

  }

  checkedOnHold = async (tempId, checkedValue) => {

    console.log(tempId);
    console.log(checkedValue);

    let token = localStorage.getItem("token")
    let header = {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Token ' + token,
    }
    var config = {
      headers: { 'Content-Type': 'multipart/form-data', 'Authorization': 'Token ' + token },

    };
    

    if( checkedValue ){


      try {

        var remarksOnHold = new FormData()
        // remarksOnHold.append("remarks", "")
        remarksOnHold.append("on_hold", "true")
  
        let remarksOnHoldurl = base_url+`boxes_out/${tempId}/`
  
        const remarksOnHold_response = await Axios.patch(remarksOnHoldurl, remarksOnHold, config)
        console.log(remarksOnHold_response.data.on_hold)
        M.toast({
          html: 'On Hold added for BoxID: ' + tempId + '<br/> Please refresh' , classes: "white-text blue rounded"
        })
  
      } catch (error) {
        console.log(error)
        M.toast({ html: 'Failed to add On Hold status', classes: "white-text orange rounded" });
      } 
  

      

    }else{

      try {

        var remarksOnHold = new FormData()
        // remarksOnHold.append("remarks", "On Hold Removed")
        remarksOnHold.append("on_hold", "false")
  
        let remarksOnHoldurl = base_url+`boxes_out/${tempId}/`
  
        const remarksOnHold_response = await Axios.patch(remarksOnHoldurl, remarksOnHold, config)
        console.log(remarksOnHold_response.data.on_hold)
        M.toast({
          html: 'On Hold removed for BoxID: ' + tempId + '<br/> Please refresh', classes: "white-text orange rounded"
        })
  
      } catch (error) {
        console.log(error)
        M.toast({ html: 'Failed to remove On Hold status', classes: "white-text orange rounded" });
      }
  
    }

  }

  onHoldRemarksEdit = (boxIdTemp) => {


    // alert("edit remarks")

    this.setState({
      tempBoxId2 : boxIdTemp
    })    
    
    var textField = document.getElementById("remarksTextEdit");
    textField.value = this.state.remarksOnHoldList[boxIdTemp]
    textField.name = boxIdTemp

    var elems = document.getElementById("updateRemarksOnHold");
    var instance = M.Modal.init(elems);
    instance.open()
    return;

  }


  updateOnHoldRemarks = async (tempId) => {

    console.log(tempId);

    let remarksData = this.state.remarksTextValue
    console.log(remarksData);

    let token = localStorage.getItem("token")
    let header = {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Token ' + token,

    }
    var config = {
      headers: { 'Content-Type': 'multipart/form-data', 'Authorization': 'Token ' + token },

    };

    try {

      var remarksOnHold = new FormData()
      remarksOnHold.append("remarks", remarksData)

      let remarksOnHoldurl = base_url+`boxes_out/${tempId}/`

      const remarksOnHold_response = await Axios.patch(remarksOnHoldurl, remarksOnHold, config)
      console.log(remarksOnHold_response.data.remarks)
      M.toast({
        html: 'Update Remarks for BoxID: ' + tempId + '<br/> Please refresh' , classes: "white-text blue rounded"
      })

    } catch (error) {
      console.log(error)
      M.toast({ html: 'Failed to add remarks', classes: "white-text orange rounded" });
    }

  }

  
 OpenVisualiser=()=>{
  var elems = document.getElementById("TransactionboxModel");
  var instance = M.Modal.init(elems,{
    dismissible: false
  });
  instance.open()
}

  ////On HOLD check

  //UPDATE BOX LIST
  updateBoxList = async (updatedUrl, pg) => {

    var context = this
    var tempPageNumber = this.state.currentPageNumber

    this.setState({
      showSpinner: true,
    })

    let response_data = []
    var prevUrl 
    var nextUrl 

    await Axios({
      method: "GET",
      url: updatedUrl
    }).then(function(response){
      console.log("response",response);
      console.log("response.data.results",response.data.results);
      response_data = response.data.results
      // context.setState({ updatedOrdersList: response.data.results })
      // console.log("UPDATED ORDELIST",this.state.updatedOrdersList);      
      console.log("UPDATED ORDELIST",response_data);   
      prevUrl = response.data.previous   
      nextUrl = response.data.next   

      // tempPageNumber = updatedUrl.toString().split('=')[4]??1

      if(pg === '+')
        tempPageNumber = tempPageNumber + 1
      else if(pg === '-')
        tempPageNumber = tempPageNumber - 1
      else
        tempPageNumber = ''

      context.setState({
        showSpinner: false,
        currentPageNumber: tempPageNumber
      })

    }).catch(function(response){
      console.log("response",response);
      console.log("ERROR UPDATING ORDERLIST");
    })

    await this.setState({boxlist: response_data})
    this.setState({previousPageUrl: prevUrl})
    this.setState({nextPageUrl: nextUrl})

  }
  //UPDATE BOX LIST END

  handleProgressModal = () => this.setState({ showPaymentProcess: false })

  //FedExAPi call

  FedExModelOpen = () => {
    // M.toast({html: 'Selected :-  '+this.state.boxselectedlist,classes:"white-text orange rounded"})
    var elems = document.getElementById("FedExTracker");
    var instance = M.Modal.init(elems,{
      dismissible: false
    });
    instance.open()
  }

  BackToBoxList=()=>{
    var elems = document.getElementById("AlterBoxModel");
    var instance = M.Modal.init(elems,{
      dismissible: false
    });
    instance.open()
  }

  CloseParentBoxModel=async()=>{
    await this.setState({parentboxSelected: " "});
    await this.setState({boxSelectedlist: []});
  }

  CancelShippingTransaction=async()=>{
    
    this.setState({
      showPaymentProcess: true,
      failureErrorMessage: '',
      errorType:''
    })

    var context = this

   await Axios({
      url: base_url+'refund',
      method:'post',
      data:{
        "box_list": this.state.AllSuccess
      }
    }).then(async(response)=>{
      console.log(response);

      context.setState({
        showPaymentProcess: false
      })

      M.toast({
        html: `Transactions refund successfull  `,
        classes: "center white-text green rounded"
      })

     await this.setState({parentboxSelected: " "});
      await this.setState({boxSelectedlist: [] });
      await this.setState({TotalRatedWeight: 0 });
      await this.setState({RatedWeight: [] });

    }).catch(function(response){
      console.log(response);

      M.toast({
        html: `Transactions refund failure `,
        classes: "center white-text orange rounded"
      })
    })
  }

  CancelShipping=async()=>{
    
    this.setState({
      showPaymentProcess: true,
      failureErrorMessage: '',
      errorType:''
    })

    var context = this

    console.log(this.state.parentboxSelected)
    console.log('I am about to cancel shipping');
    
    try{

      
   await Axios({
    method:'post',
    url: base_url+'cancel_shipping',
    data:{
      "box_id": this.state.AllSuccess
    }
  }).then(async(response)=>{
    console.log(response);

    console.log(this.state.AllSuccess);
  
      await Axios({
        method:'post',
        url: base_url+'refund',
        data:{
          "box_list": this.state.AllSuccess
        }
      }).then(async (response)=>{
        console.log(response);

        context.setState({
          showPaymentProcess: false
        })
  
        M.toast({
          html: `Shipping cancel & payment refund success `,
          classes: "center white-text green rounded"
        })
  
        await this.setState({parentboxSelected: " ", boxSelectedlist:[] });
        await this.setState({TotalRatedWeight: 0 });
        await this.setState({RatedWeight: [] });

      
      }).catch(function(response){
        console.log(response);
  
        M.toast({
          html: ` Shipping cancellation & refund failed `,
          classes: "center white-text orange rounded"
        })
      })

    

   

  })

    }catch(err){
      console.log(err);
    }




  }


  FinishShipping=async()=>{
    console.log('I am about to Finish the shipping');

    this.setState({ showPaymentProcess: true })

    this.setState({
      isTotalBoxWeight: false,
      checkTotalWeight: 0,
      remainingSpace: 0,
      freedSpace: 0,
      countryThreshold: 0
    })

    var context = this

    console.log(this.state.AllSuccess);
        Axios({
          method:'POST',
            url: base_url+'fedex_notification',
           
            data: {
              "box_id": this.state.AllSuccess
            }
          }).then(response=>{
            console.log(response);
            console.log('fedex notification worked!!!');
            M.toast({
              html: `Send email Successful!  `,
              classes: "center white-text green rounded"
            })
          this.setState({ showPaymentProcess: false })

          }).catch(error=>{
            console.log(error);

            //ERROR
            context.setState({
              errorType: 'Fedex Notification' ,
              failureErrorMessage: 'ERROR'
              // failureErrorMessage: `${response.Data}. ${response.Box_excluded}`
            })
            M.toast({
              html: `Send email failed!  `,
              classes: "center white-text red rounded"
            })



          })       
  }



  FedExAPI=async()=>{

    var context = this
    
    this.setState({
      failureErrorMessage: '',
      errorType:''
    })

    await this.FedExModelOpen();
    const dataObj={
      // "owner": "EBSNP",              //TEST-SERVER
      // "owner": "owner_1",               //PROD-SERVER TEMP CODED
      "box_id": this.state.AllSuccess
    }

    await Axios({
      method:'post',
      url: base_url+'fedex',
      data: dataObj
      
    }).then(async(response)=>{
      console.log(response);
      console.log(response.data.Data);
    
    //  await this.setState(prevState=>({
    //     FedExTrackingData: [...prevState.FedExTrackingData, this.state.AllSuccess]
    //   }));

    this.setState({ showPaymentProcess: false })

   await this.setState({FedExTrackingData: response.data.Data});

      // M.toast({
      //   html: `FedEx API ran `,
      //   classes: "center white-text green rounded"
      // })

      M.toast({
        html: `FEDEX success  `,
        classes: "white-text green rounded"
      })

      this.setState({isFedexSuccess: true})
      // context.setState({                
      //   failureErrorMessage: ''
      // })

    }).catch(async(response)=>{
      console.log(response);
      console.log(response.response);

      // {"Data":resultant_box, "Box_excluded":box_excluded}

      this.setState({showPaymentProcess: true })

      //CATCH FEDEX
      // if (response.response.data.Error) {
      //   context.setState({
      //     errorType: 'Fedex',
      //     // failureErrorMessage: 'TEST MESSAGE FEDEX FAIL 1',
      //     failureErrorMessage: response.response.Error
      //   })
      // }
      // else {
      //   context.setState({
      //     errorType: 'Fedex',
      //     // failureErrorMessage: 'TEST MESSAGE FEDEX FAIL 2',
      //     failureErrorMessage: `${response.Data}. ${response.Box_excluded}`
      //   })
      // }

      context.setState({
        errorType: 'Fedex Fail .',
        failureErrorMessage: `Fedex Fail`
      })

      M.toast({
        html: `FEDEX api failed. ${response} `,
        classes: "white-text orange rounded"
      })
    })
  }

  ProceedTransaction=async()=>{

    // this.setState({isBackdrop:false})

    this.setState({
      showPaymentProcess: true,
      failureErrorMessage: '',
      errorType:''
    })

    var context = this

    console.log(this.state.AlternateBoxData);

    console.log(this.state.AlterFreightCharge,'alter freight charge is here');
    console.log(this.state.AlterCustomCharge, 'alter custom is here')

    // setTimeout(() => {
      
      await this.setState({

        boxselectedlist: this.state.boxselectedlist.concat( this.state.AlternateBoxData)
        

      })
    // }, 1000);
    const selected = this.state.AlternateBoxData.length > 0?true:false
    this.OpenVisualiser();

    console.log('selected????????',selected)

    if(!selected){
      this.setState({
        showPaymentProcess: false
      })
    }

 if(selected)  {  try{

     

      await Promise.all(this.state.AlternateBoxData.map(async(key,index)=>{
        console.log(index, 'index is here');
        // this.setState({TotalRatedWeight:0})
        if(key!=this.state.parentboxSelected){
          await Axios({
            method:'post',
            url: base_url+'payment_by_id',
            data:{
              "box_id": key,
              "amount" : this.state.AlterFreightCharge[index].toString()
            }
          }).then(async(response)=>{
            console.log(response);

            this.setState({
              showPaymentProcess: false
            })

            this.setState(prevState=>({
              FreightChargeSuccess : [...prevState.FreightChargeSuccess, key],
            }))

            this.setState({isBackdrop:false})
           
            await Axios({
              method:'post',
              url: base_url+'hold_amount',
              data:{
                "box_id": key,
                "amount": this.state.AlterCustomCharge[index].toString()
              }
            }).then(async(response)=>{
              console.log(response);

              await this.setState(prevState=>({
                CustomSuccess: [...prevState.CustomSuccess, key]
              }))
             
              this.setState(prevState=>({
                AllSuccess: [...prevState.AllSuccess, key],
                
              showPaymentProcess: false

              }))

              M.toast({
                html: `Hold success `,
                classes: "white-text green rounded"
              })

            }).catch(async(response)=>{
              console.log(response);
              console.log(response.response);

              //CATCH hold_amount
              context.setState({
                errorType: 'Hold Amount',
                failureErrorMessage: 'Hold Amount Fail',
                // failureErrorMessage: `${response.response.data.Message}. ${response.response.data.Description}.`,
                // failureErrorMessage: response.response.data.Description,
              })

              M.toast({
                html: `Hold fail. ${response.Message} `,
                classes: "white-text red rounded"
              })

              this.setState(prevState=>({
                CustomFail: [...prevState.CustomFail, key]
              }))

              M.toast({
                html: `Hold failure `,
                classes: "white-text orange rounded"
              })

            })

          


          }).catch(async(response)=>{
            console.log(response);
            console.log(response.response);

            //CATCH payment_by_id
            // if (response.response.data.Error) {
            //   context.setState({
            //     errorType: 'Payment',
            //     // failureErrorMessage: 'TEST MESSAGE 3.1',
            //     failureErrorMessage: response.response.data.Error
            //   })
            // }
            // else {
            //   context.setState({
            //     errorType: 'Payment',
            //     // failureErrorMessage: 'TEST MESSAGE 3.2',
            //     failureErrorMessage: response.response.data.Message + " " + response.response.data.Description
            //   })
            // }

            context.setState({
              errorType: 'Payment post backtoboxlist',
              failureErrorMessage: 'payment fail',
              // failureErrorMessage: response.response.data.Message + " " + response.response.data.Description
            })

            this.setState({isBackdrop:false})
            M.toast({
              html: response.description,
              classes: "white-text red rounded"
            })

            await this.setState(prevState=>({
              FreightFail: [...prevState.FreightFail, key]
            }))

            this.setState(prevState=>({
              CustomFail: [...prevState.CustomFail, key]
            }))           
          })

          await Axios({
            method:'post',
            url: base_url+'max_fedex_charge',
            data:{
              "box_id": key
            }
          }).then(response=>{
            this.state.boxselecteddata[key] =response.data.data
            console.log(response.data.data, 'alter boxes ');
            this.setState(prevState=>({
              RatedWeight:[...prevState.RatedWeight, response.data.data]
            }))
            
            this.setState({TotalRatedWeight: this.state.TotalRatedWeight+response.data.data,
            
            
            })

          }).catch(err=>console.log(err));

           //CATCH rated weight 
          //  context.setState({
          //   errorType: 'rated weight fail',
          //   failureErrorMessage: 'rated error',
            // failureErrorMessage: err
          // })

        }
      }))

    }catch(err){
      console.log(err)   
      M.toast({
        html: err,
        classes: "white-text red rounded"
      })  
    }}
  
  }

  OpenVisualiser=()=>{
    var elems = document.getElementById("TransactionboxModel");
    var instance = M.Modal.init(elems,{
      dismissible:false
    });
    instance.open()
  }


  

  componentDidMount() {
    // Auto initialize all the things!
    // @TODO: fetch data from server to show list and update the state boxlist
    M.AutoInit();

    otherBoxes=async() =>{
      // this.setState({Loader: !this.state.Loader});
  
     

      try{


        // this.setState({
        //   showPaymentProcess: true
        // })
        
        var context = this
       
        await Promise.all(this.state.boxselectedlist.map(async (key,index)=>{
          
if(key !==this.state.parentboxSelected || this.state.FreightCharge[index]!== this.state.ParentFreightCharge && this.state.CustomCharge[index]!==this.state.ParentCustomCharge )
              {
                console.log(this.state.FreightCharge[index], 'freight payment here');
                console.log(this.state.CustomCharge[index],'Custom payment here')
          await Axios({
            method:'post',
            url: base_url+'payment_by_id',
            data:{
              "box_id": key,
              "amount": this.state.FreightCharge[index].toString()
            }
          }).then(async (response)=>{
            console.log(response);
            console.log('innerSuccess');

            // this.setState({
            //   showPaymentProcess: false
            // })

          this.setState(prevState=>({
            FreightChargeSuccess : [...prevState.FreightChargeSuccess, key]
          }))
            await Axios({
             method:'post',
             url: base_url+'hold_amount',
             data :{
               "box_id": key,
               "amount": this.state.CustomCharge[index].toString()
             }
           }).then( async (response)=>{
            console.log(response);
            console.log('hold Works');

           await this.setState(prevState=>({
              CustomSuccess: [...prevState.CustomSuccess, key]
            }))
           
            this.setState(prevState=>({
              AllSuccess: [...prevState.AllSuccess, key]
            }))

           }).catch(async (response)=>{
            console.log('hold fails');
            console.log(response);
          //CustomFail.push(key);
          
          //CATCH hold_amount
          // context.setState({
          //   // failureErrorMessage: 'TEST MESSAGE 2',
          //   // failureErrorMessage: `${response.response.data.Message}. ${response.response.data.Description}.`,
          //   failureErrorMessage: response.response.data.Description,
          // })

           this.setState(prevState=>({
            CustomFail: [...prevState.CustomFail, key]
          }))
           })
     
     
          }).catch(async (response)=>{
            console.log(response);
            console.log('outerFailed');
          //FreightChargeFail.push(key);

            //CATCH payment_by_id
            // if (response.response.data.Error) {
            //   context.setState({
            //     // failureErrorMessage: 'TEST MESSAGE 3',
            //     failureErrorMessage: response.response.Error
            //   })
            // }
            // else {
            //   context.setState({
            //     // failureErrorMessage: 'TEST MESSAGE 3',
            //     failureErrorMessage: response.response.data.Message + " " + response.response.data.Description
            //   })
            // }

            await this.setState(prevState=>({
              FreightFail: [...prevState.FreightFail, key]
            }))

            this.setState(prevState=>({
              CustomFail: [...prevState.CustomFail, key]
            }))
          
     
        
          })

          await Axios({
            method:'post',
            url: base_url+'max_fedex_charge',
            data:{
              "box_id": key
            }
          }).then(response=>{
            console.log(response.data.data, 'I handle Others boxes Rated weight');
            this.state.boxselecteddata[key] = response.data.data
         
            this.setState(prevState=>({
             RatedWeight:[...prevState.RatedWeight, response.data.data],
            
            }))

            this.setState({TotalRatedWeight: this.state.TotalRatedWeight+response.data.data})

          }).catch(err=>console.log(err));

          
     
     //Now Hold API
     //custom charge is nested. comes after frieght.
     //User has to select parentBox if failed on run. 
     //print label later priority.
     //if freight charged earlier. charge custom from now.
     //after transactions. check if boxes are beyond threshold or not. 
     //total rated weight. colom to be added.
     //frieght and custom nested.
         
            console.log('inside hold api');
           
      
       
         
        
     
         }
        }))

      }catch(error){
        console.log(error);
      }
      
      

  //  console.log('Printing All success list');
  //  console.log();

  //  console.log('printing hold failed');
  //  console.log(holdPay);

  //  console.log('printing all failed/ freight');
  //  console.log(paymentIDf);

   
    }


 
  }

  printLabelManually = (box) => {

    // M.toast({
    //   html: `not functional box id: ${box_id}`,
    //   classes: "white-text brown rounded"
    // })

    Axios({
      method: 'post',
      url: base_url+'status_printer',
      data: {
        "box_id": box.box_id
      }
    }).then(function (response) {
      console.log(response)
      console.log("printer API success");
      M.toast({
        html: `Print Label successful for boxId: ${box.box_id} `,
        classes: "center white-text green rounded"
      })
    }).catch(function (response) {
      console.log(response)
      console.log('printer API failed');
      M.toast({
        html: `Print Label failed. `,
        classes: "white-text orange rounded"
      })
    })

  }

 

  ShipAlternateBoxes=async(event, freight, custom)=>{
    

    console.log(event.target.getAttribute("value"));
    console.log(freight, 'Here is the freight Charge of me');
    console.log(custom, 'here is the custom charge');

    if(event.target.checked){
      let elem=event.target.getAttribute("value");

   await this.setState(prevData=>({
        AlternateBoxData: [...prevData.AlternateBoxData, elem ]
    }));

   await this.setState(prevData=>({
      AlterFreightCharge: [...prevData.AlterFreightCharge, freight]
    }))

    this.setState(prevData=>({
      AlterCustomCharge: [...prevData.AlterCustomCharge, custom]
    }))
    // await this.setState(prevData=>({
    //   boxselectedlist: [...prevData.boxSelectedlist, elem]
    // }));

   // this.state.boxSelectedlist.push(elem);

    }else{
      let elem=event.target.getAttribute("value");

      this.setState({AlternateBoxData: this.state.AlternateBoxData.filter(key=> !key.includes(elem))});
      this.setState({boxselectedlist : this.state.boxselectedlist.filter(key=> !key.includes(elem))});

      this.setState({AlterFreightCharge: this.state.AlterFreightCharge.filter(function(item){return item !== freight})});
            this.setState({AlterCustomCharge: this.state.AlterCustomCharge.filter(function(item){return item !==custom}) });
    }

    

  

  }

  onChangeSelectShip = (event, freight,custom) => {
    console.log(event.target.checked, event.target.value);
    console.log(event.target.name);
    console.log(freight, 'Freight charge of current box is this')
    console.log(custom, 'custom charge of current box is this')
    if (this.state.previouSelectedBox === "" && event.target.name) {

      this.state.boxselectedlist.push(event.target.value)

      this.setState({ boxselectedlist: this.state.boxselectedlist })
      console.log("Selected " + this.state.boxselectedlist)

      this.setState({ previouSelectedBox: event.target.name })

      this.setState(prevState=>({
        FreightCharge: [...prevState.FreightCharge, freight],
        CustomCharge: [...prevState.CustomCharge, custom]
      }));

      //threshold check
      this.getBoxWeight(event.target.value, event.target.name, event.target.checked)

    }
    else {

      if (this.state.previouSelectedBox === event.target.name) {
        // selected id code starts here

        if (event.target.checked) {
          this.state.boxselectedlist.push(event.target.value)

          this.setState({ boxselectedlist: this.state.boxselectedlist })
          console.log("Selected " + this.state.boxselectedlist)

          this.setState(prevState=>({
            FreightCharge: [...prevState.FreightCharge, freight],
            CustomCharge: [...prevState.CustomCharge, custom]
          }));

          this.getBoxWeight(event.target.value, event.target.name, event.target.checked)


        } else {
          let selectedlist = this.state.boxselectedlist
          //remove unselected

          let removedUnselected = selectedlist.filter(function (item) { return item != event.target.value; })
          this.setState({ boxselectedlist: removedUnselected })

          // this.setState({FreightCharge: this.state.FreightCharge.filter(key=> !key.includes(freight) ), 
          //   CustomCharge: this.state.CustomCharge.filter(key=> !key.includes(custom) )})


            this.setState({FreightCharge: this.state.FreightCharge.filter(function(item){return item !== freight})});
            this.setState({CustomCharge: this.state.CustomCharge.filter(function(item){return item !==custom}) });

          this.getBoxWeight(event.target.value, event.target.name, event.target.checked)


          // this.getBoxWeight(event.target.value, event.target.name)


        }

      } else {
        if (event.target.checked && this.state.previouSelectedBox !== event.target.name) {
          M.toast({ html: 'Select Order for same country ', classes: "white-text red rounded" })
        }

      }
    }
  }


  openeditboxmodal = async (boxid) => {
    // this.state.productlist=[]
    //  await this.getproducts(order.order_id)
    //  await this.getcustomer(order.ezz_id)
    console.log(boxid);
    await this.setState({ boxforedit: boxid });

    this.refs.editbox.openModal();
    // this.refs.editorder.openModal(order);

  }

  handleParentBoxChange = async (event) => {
    const name = event.target.name
    const value = event.target.value
    this.setState({ [name]: value })
    console.log(name);
    console.log(value, 'Parent Box ID' );

await this.state.boxlist.map(key=>{
    if(key.box_id===value){
      this.setState({ParentFreightCharge: key.freight_charge, ParentCustomCharge: key.custom_duty})
    }
})





console.log(this.state.FreightCharge);
console.log(this.state.CustomCharge);
console.log(this.state.ParentFreightCharge);
console.log(this.state.ParentCustomCharge);







  }

  readyToShipOrders = () => {
    // M.toast({html: 'Selected :-  '+this.state.boxselectedlist,classes:"white-text orange rounded"})
    var elems = document.getElementById("parentboxModel");
    var instance = M.Modal.init(elems,{
      dismissible: false
    });
    instance.open();
    
  }

  // BackToBoxList=async()=>
  // {
  //   await Axios({
  //       method:'get',
  //       url:base_url+'boxes_out/'
  //   }).then(function(response){
  //       console.log(response);
        
  //   }).catch(function(response){
  //       console.log(response);
  //   })
  // }

  



  

  shipOrder =async() => {
    // TODO: call django api for each box and sent email to each customer 
   // M.toast({ html: 'Pending shipping  ' + this.state.boxselectedlist, classes: "white-text red rounded" })

    this.setState({
      showPaymentProcess: true,
      failureErrorMessage: '',
      errorType:''
    })

    var context = this

    let  parentFrieght=this.state.ParentFreightCharge;
    let parentcustom=this.state.ParentCustomCharge;
   

      await Axios({
        method: 'POST',
        url: base_url+'payment_by_id',
        data: {
          "box_id": this.state.parentboxSelected,
          "amount": parentFrieght.toString()
        }
      }).then(async (response)=>{
        console.log(response);
        
        this.setState({
          showPaymentProcess: false,
          failureErrorMessage: ''
        })

        this.OpenVisualiser();
        this.setState({ParentBoxFreightSuccess: !this.state.ParentBoxFreightSuccess });
  
        await Axios({
          method:"post",
          url: base_url+'hold_amount',
          data:{
            "box_id": this.state.parentboxSelected,
            "amount": parentcustom.toString()
          }, 
        }).then(async(response)=>{
          console.log(response);
         

          await Axios({
            method: 'post',
            url: base_url+'max_fedex_charge',
            data:{
              "box_id": this.state.parentboxSelected,
            }
          }).then(response=>{
            console.log(response.data.data,'Parent Rated Weight');
           this.state.boxselecteddata[this.state.parentboxSelected] =response.data.data
            this.setState(prevState=>({
              RatedWeight: [...prevState.RatedWeight, response.data.data]
            }))

            this.setState({TotalRatedWeight: this.state.TotalRatedWeight+response.data.data})
          }).catch(err=>{
            console.log(err);

            //CATCH rated weight 
            context.setState({
              errorType: 'Rated Weight',
              failureErrorMessage: 'TEST MESSAGE 3',
              // failureErrorMessage: err
            })


          })
          
          this.setState(prevState=>({
            AllSuccess: [...prevState.AllSuccess, this.state.parentboxSelected]
          }))
        

           this.setState({ParentBoxCustomSuccess: !this.state.ParentBoxCustomSuccess});
          
           await otherBoxes();
        }).catch(function(response){
          console.log(response.response);
      

          // M.toast({ html: 'Green', classes: "white-text green rounded", inDuration: 4000, outDuration: 5000  })

          //CATCH hold_amount
          context.setState({
            errorType: 'Hold Amount',
            failureErrorMessage: 'hold err',
            // failureErrorMessage: `${response.response.data.Message}. ${response.response.data.Description}.`,
            // failureErrorMessage: response.response.data.Description,
          })


          M.toast({
            html: `Parent Box (${context.state.parentboxSelected}) failed! <br/>
              Kindly Select a different Box. ✗  `,
            classes: "white-text orange rounded"
          })

          // this.readyToShipOrders();
        })
  
  
  
      }).catch(function(response){
        console.log(response.response);
        
        //CATCH payment_by_id
        if(response.response.data.Error){
          context.setState({
            errorType: 'Payment',
            // failureErrorMessage: 'TEST MESSAGE 3.1',
            failureErrorMessage: response.response.data.Error
          })
        }
        else{
          context.setState({
            errorType: 'Payment',
            // failureErrorMessage: 'TEST MESSAGE 3.2',
            failureErrorMessage: 'payment: ' + response.response.data.Message + " " + response.response.data.Description
          })
        }
        

        M.toast({
          html: `Parent Box (${context.state.parentboxSelected}) failed! <br/>
            Kindly Select a different Box. ✗  `,
          classes: "white-text orange rounded"
        })

        // this.readyToShipOrders();

       

      })    
        // this.readyToShipOrders();
    

      }
        
    
         
         
      
  handleKeyDownSearch = (eventKey) => {
  //  console.log('orderfilterString',this.state.filterBoxlistString);
    var filterString = this.state.filterBoxlistString
    let context = this
  
    if (eventKey.key === "Backspace") {
      this.setState({
        showSpinner: true,
      })

      this.setState({currentPageNumber: 1})

      var boxCount
      var prevUrl
      var nextUrl
      var search_results

      let searchUrl = base_url + `boxes_out/?box_id=&ezz_id=&not_shipped=Shipped`
      Axios({
        method: 'GET',
        url: searchUrl
      }).then(async (response) => {
        // console.log(response);
        // console.log(response.data.results);
        // console.log(response.data.count);
        // console.log(response.data.next);
        // console.log(response.data.previous);

        boxCount = response.data.count
        prevUrl = response.data.previous
        nextUrl = response.data.next
        search_results = response.data.results
        context.setState({currentPageNumber: 1})

        if (!response.data.results) {
          this.setState({ boxlist: [] })
          this.setState({ searchResultsCount: boxCount })
          this.setState({ currentBoxListCount: response.data.resultslength })
          return
        }

        this.setState({ boxlist: search_results })
        this.setState({ previousPageUrl: prevUrl })
        this.setState({ nextPageUrl: nextUrl })
        this.setState({ searchResultsCount: boxCount, showSpinner: false })

        console.log('boxlist.length', this.state.boxlist.length);
        this.setState({ currentBoxListCount: response.data.results.length })

      }).catch((response) => {
        console.log(response)
        this.setState({ showSpinner: false })
        // M.toast({ html: response.Error, classes: "white-text red rounded" })

      })
    }

    if (eventKey.key === "Enter") {
      // var filterString = this.state.filterBoxlistString
      // if (filterString.trim() === "") {
      //   return
      // }
      this.setState({
        showSpinner: true,  
        currentPageNumber: 1
      })

      var boxCount
      var prevUrl
      var nextUrl
      var search_results

      let searchUrl = base_url + `boxes_out/?box_id=&ezz_id=&not_shipped=Shipped&search=${filterString}`
      Axios({
        method: 'GET',
        url: searchUrl
      }).then(async (response) => {
        // console.log(response);
        // console.log(response.data.results);
        // console.log(response.data.count);
        // console.log(response.data.next);
        // console.log(response.data.previous);

        boxCount = response.data.count
        prevUrl = response.data.previous
        nextUrl = response.data.next
        search_results = response.data.results

        context.setState({currentPageNumber: 1})

        if (!response.data.results) {
          this.setState({ boxlist: [] })
          this.setState({ searchResultsCount: boxCount })
          this.setState({ currentBoxListCount: response.data.resultslength })
          return
        }

        
        this.setState({ boxlist: search_results })
        this.setState({ previousPageUrl: prevUrl })
        this.setState({ nextPageUrl: nextUrl })
        this.setState({ searchResultsCount: boxCount, showSpinner: false })
        
        console.log('boxlist.length', this.state.boxlist.length);
        this.setState({ currentBoxListCount: response.data.results.length })
        
      }).catch((response) => {
        console.log(response)
        this.setState({ showSpinner: false })
        // M.toast({ html: response.Error, classes: "white-text red rounded" })

      })
    }
  }
  

  editSearchTerm = async (e) => {

      // console.log(e.target.value)
      
      let word = e.target.value
      let bucket = word.split(' ')
      
      // console.log(bucket)
      
      let searchString = bucket.reduce((prevVal, currVal)=>{ return prevVal+=currVal+' ' }, ' ')

      // console.log('searchString',searchString);
      this.setState({
        filterBoxlistString:searchString
      })
      
    
      
      // console.log('URL', base_url+`boxes_received/?search=${searchString}`);
      
      // const response=await Axios.get(searchUrl)
      // const {data}=response.results;

      if(searchString ===""){
        this.setState({
          showSpinner: true,
        })
      
        var boxCount
        var prevUrl    
        var nextUrl    
        var search_results
  
        let searchUrl = base_url+`boxes_out/?box_id=&ezz_id=&not_shipped=Shipped&search=${searchString}`   
        await  Axios({
          method: 'GET',
          url: searchUrl
        }).then( async (response) =>{
          // console.log(response);
          // console.log(response.data.results);
          // console.log(response.data.count);
          // console.log(response.data.next);
          // console.log(response.data.previous);
          
          boxCount = response.data.count
          prevUrl = response.data.previous   
          nextUrl = response.data.next  
          search_results = response.data.results
  
          if(!response.data.results){
            this.setState({boxlist: []}) 
            this.setState({searchResultsCount: boxCount})
            this.setState({currentBoxListCount: response.data.resultslength})
            return
          }
  
          this.setState({searchResultsCount: boxCount})
          this.setState({boxlist: search_results})
          this.setState({previousPageUrl: prevUrl})
          this.setState({nextPageUrl: nextUrl})
          this.setState({currentBoxListCount: boxCount, showSpinner: false})
          
          console.log('boxlist.length', this.state.boxlist.length);
          this.setState({currentOrderListCount: response.data.results.length})
          
        }).catch(  (response) =>{
          console.log(response)
         this.setState({showSpinner:false})
         this.setState({boxlist: []}) 
        //  M.toast({ html: ""+response.Error, classes: "white-text red rounded" })
       
        })
      }


    // console.log(this.state.boxlist)
    // console.log(event.target.value)
    // console.log(event.target.type)

    // if (event.target.value.includes(' ') || event.target.value !== null) {
    //   let words = event.target.value;


    //   let keyword = words.trim().split(' ');
    //   console.log(keyword)
    //   console.log(keyword)
    //   keyword.forEach(element => {
    //     this.setState({
    //       boxlist: this.state.boxlist.filter(name => (
    //         (name.ezz_id !== null && name.ezz_id.includes(element.toUpperCase())) ||
    //         (name.box_id !== null && name.box_id.includes(element)) ||

    //         (name.country !== null && name.country.toLowerCase().includes(element)) ||
    //         (name.box_creation_date !== null && name.created_at.includes(element.toUpperCase())) ||
    //         (name.box_status !== null && name.box_status.includes(element.toUpperCase())) ||
    //         (parseInt(name.box_weight) === parseInt(element))


    //       )

    //       )
    //     })
    //   });
    // }

  }



  
  render() {
    const { classes } = this.props;
    
    if(this.state.Loader === true){
      return (
        <div className="loader" >
        <CircularProgress disableShrink />
        </div>
      )
    }

    // const BoxCardList = this.state.boxlist.filter(filterkey => filterkey.box_status_name !== "Shipped").map((box) => {
    const BoxCardList = this.state.boxlist.map((box) => {
      

      //   this.state.orderweights[order.order_id] = order.weight
           this.state.boxWeightList[box.box_id] = box.box_weight
           this.state.remarksOnHoldList[box.box_id] = box.remarks
           this.state.thresholdList[box.box_id] = box.threshold_value

       

      return (
        <Card key={box.id} className="orderItemdetailsCard">
          <Card.Header className="smallheader">
            <Row >
              <Col >
                <Card.Text>{box.box_id}</Card.Text>
              </Col>
              <Col >
                <Card.Text>{box.ezz_id}</Card.Text>
              </Col>
              <Col  >
                <Card.Text >
                  {box.country}
                </Card.Text>
              </Col>
              <Col>
                <Card.Text>
                  {box.created_at}
                </Card.Text>
              </Col>
              <Col>
                <Card.Text>
                  {box.box_weight}
                </Card.Text>
              </Col>

              <Col>
                <Card.Text>
                  {box.outbound_tracking_number}
                </Card.Text>
              </Col>
            </Row>
            <Row className="mordetail_row">
              <Col>


                {(() => {
                  // Function to set icons with respect to order status
                  if (box.box_status === "DISC") {
                    return (<p className="red-text"><Image className="ml-1" src="assets/images/wrong.svg" /> {box.box_status_name}</p>)
                  } else {
                    return (<p className="black-text"><Image className="ml-1" src="assets/images/dot.svg" /> {box.box_status_name}</p>)
                  }
                })()}
              </Col>
              <Col className=" ">

                <Accordion.Toggle className="right inline alignmore_details" as={Nav.Link} variant="link" eventKey={box.id}>
                  More Details<Image className="ml-1 " src="assets/images/plus-circlesmall.svg" />
                </Accordion.Toggle>


                {/* @TODO loading for manifest must be implemented */}
                {
                  (() => {
                    // function to disable Select button if already shipped
                    if (box.box_status !== "NEW") {
                      return (<>
                        <p className="right red-text">
                          <label>
                            <input type="checkbox" disabled={true} name={box.country} value={box.box_id} onChange={(e)=>this.onChangeSelectShip(e, box.custom_duty, box.freight_charge)} />
                            <span className="grey-text">Select to Ship</span>
                          </label>
                        </p>
                        {/* <ManifestButton disabled="disabled" name="Manifest" ordernumber={order.ordernumber}></ManifestButton> */}
                      </>)
                    }
                    else {
                      return (
                        <>
                        {
                          box.on_hold
                          ?
                          <p className="right red-text">
                          <label>
                            <input type="checkbox" id={`hold${box.box_id}`} checked={true} name={box.box_weight} value={box.box_id} onChange={this.onChangeOnHold} />
                            <span className="orange-text">On Hold</span>
                          </label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          <label>
                            <input type="checkbox" id={`ship${box.box_id}`} disabled={true} name={box.country} value={box.box_id} onChange={(e)=>this.onChangeSelectShip(e,box.freight_charge, box.custom_duty)} />
                            <span className="red-text">Select to Ship</span>
                          </label>
                          </p>
                          :
                          <p className="right red-text">
                          <label>
                            <input type="checkbox" id={`hold${box.box_id}`} name={box.box_weight} value={box.box_id} onChange={this.onChangeOnHold} />
                            <span className="orange-text">On Hold</span>
                          </label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          <label>
                            <input type="checkbox" id={`ship${box.box_id}`} name={box.country} value={box.box_id} onChange={(e)=>this.onChangeSelectShip(e,box.freight_charge, box.custom_duty)} />
                            <span className="red-text">Select to Ship</span>
                          </label>
                          </p>
                        }
                        </>
                        
                        // <ManifestButton disabled="" name="Manifest" ordernumber={order.ordernumber}></ManifestButton>

                      )
                    }
                  })()
                }


              </Col>
            </Row>

          </Card.Header>


          <Card.Body>



            <Accordion.Collapse eventKey={box.id}>

              <Card.Body>

                <Row>
                  <Col>
                    <div>
                      <ul>
                        <li>
                          Custom Charge: { box.custom_duty } <br/>
                          Freight Charge: { box.freight_charge }
                        </li>
                        <li>
                          {
                            (() => {
                              if (box.box_status === "NEW" && box.on_hold) {

                                return (
                                  <>
                                    <h6>Remarks: </h6>
                                    <p>{box.remarks}
                                      <span className="blue-text ml-1" >
                                        <a
                                          id={box.box_id}
                                          style={{ cursor: "pointer" }}
                                          onClick={() => this.onHoldRemarksEdit(box.box_id)}  >
                                          <Image title="Add or Update Remarks" src="assets/images/edit.svg" /></a></span>
                                    </p>
                                  </>
                                )

                              }
                            })()
                          }
                        </li>
                      </ul>
                    </div>                  
                    
                  </Col>
                  <Col>
                      <ul>
                        <li>
                          Customer Name: { box.customer_name }<br/>
                          Shipper Order no.:  { box.shipper_number ? box.shipper_number : ''}
                        </li>
                      </ul>
                  </Col>
                  <Col>
                    <Nav className="right">

                            <ul>
                              {
                                box.box_status !== "DISC"
                                ?
                                  <li><Nav.Link className="red-text modal-trigger "
                                  onClick={() => this.openeditboxmodal(box.box_id)}>
                                  Edit BOX <Image className="red-text ml-1" src="assets/images/edit.svg" /></Nav.Link></li>
                                :
                                  ""
                              }
                              {
                                box.box_status === "F"
                                ?
                                  <li><Nav.Link className="green-text modal-trigger " onClick={() => this.printLabelManually(box)} >
                                    Print Label <Print /></Nav.Link></li>
                                :''
                              }   
                            </ul>

                      
                    </Nav>
                  </Col>
                </Row>
                <Row>
                  <Col>

                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>Product Name</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Category</th>
                          <th>Order Id</th>
                        </tr>
                      </thead>
                      <tbody>

                        {(() => {


                          return box.products.map((product) => {
                              // console.log(box.products)
                            return (
                              <tr key={product.id} >
                                <td>{product.description}</td>
                                <td >{product.quantity}</td>
                                <td>{parseFloat(product.unit_price) * parseFloat(product.quantity)}</td>
                                <td>{product.category}</td>
                                <td>{product.order_id}</td>
                              </tr>


                            )

                          })


                        })()}


                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </Card.Body>
            </Accordion.Collapse>

          </Card.Body>

        </Card>
      );
    });

    return (
      <Container>
        <>
    {/* Visualizer*/}

        {
          this.state.showSpinner
            ? < div className="center">

              <Spinner animation="grow" variant="primary" size="sm" />
              <Spinner animation="grow" variant="success" size="sm" />
              <Spinner animation="grow" variant="warning" size="sm" />
            </div>
            : null
        }

    <div id="TransactionboxModel" className="modal TransactionboxModel  modal-fixed-footer" backdrop="static" keyboard={false}>
    <div className="modal-content ">
      <div className="">


        <h4 className="center orange-text"> Transactions </h4>



        <form >


          <div className="row ">
            <div className="col  s6 l6">
              {/* Order Status Radio Buttons */}
              <h5>Ongoing Transactions</h5>
              {(() => {

          return(
                <Table striped bordered hover>
                  <thead>
                    <tr>
                    <th>Box ID</th>
                    
                      <th>Freight Charge</th>
                      <th>Custom Charge</th>
                      <th>Rated Weight</th>
                    </tr>
                  </thead>
                  <tbody>
               
                  {
                  Object.keys(this.state.boxselecteddata).map((key,index)=>{
                    console.log(this.state.boxselecteddata,"boxdata_rate")
                    const parentBoxID = this.state.parentboxSelected
               
                    if(key !== parentBoxID ){
                      return(
                        <tr>
                        <td>{key}</td>
                      
                        {
                          this.state.FreightChargeSuccess.includes(key) ?  <td>{<DoneIcon/>}</td>: this.state.FreightFail.includes(key) ? <td>{<ClearIcon/>}</td> :   <td>{<Spinner animation="border" />}</td>
                          
                        }
                        
                        {
                          this.state.CustomSuccess.includes(key) ? <td>{<DoneIcon/>}</td> : this.state.CustomFail.includes(key) ? <td>{<ClearIcon/>}</td>  :  <td>{<Spinner animation="border" />}</td>
                        }

                        
                          {/* <td>{this.state.RatedWeight[index] }</td> */}
                          <td>{this.state.boxselecteddata[key] }</td>
                        
                        
                         
                        </tr>
                        
                        
                      )
                    } else{

                      return(
                        <tr className="orange lighten-5">
                        <td>{this.state.parentboxSelected}</td>
                        
                        <td>{this.state.ParentBoxFreightSuccess ? <DoneIcon/> : <Spinner animation="border" />}</td>
                        <td>{this.state.ParentBoxCustomSuccess ? <DoneIcon/> : <Spinner animation="border" />}</td>
                        <td>{this.state.RatedWeight[0]}</td>
                      </tr>
                      )
                    }
                    
                   })}
                   
                   
                  <tr>
                    <td colspan='4'>
                      <h5>Total Rated Weight: { this.state.TotalRatedWeight.toFixed(2) }</h5>
                    </td>
                  </tr>
                </tbody>
                </Table>
              )
              })()}
              {/* { this.state.parentboxSelected} */}

            </div>
          </div>


        </form>
      </div>
    </div>
    <div className="modal-footer">

      <ButtonGroup className="mr-2" aria-label="First group">
      <Button id="backToBoxListBtn" variant="outline-secondary" className="mr-4 btn modal-close " onClick={this.BackToBoxList}>Back to Box list</Button>
        <Button id="cancelShippingBtn" variant="outline-secondary" className="mr-4 btn modal-close " onClick={this.CancelShippingTransaction} >Cancel Shipping</Button>
        <Button id="continueShippingBtn" variant="outline-primary" className="mr-2 btn modal-close"
          onClick={this.FedExAPI}
        > Continue Shipping</Button>

      </ButtonGroup>
    </div>
  </div>

  {/* Visualizer*/}

  {/* FEDEX tracking Status */}

  <div id="FedExTracker" className="modal FedExboxModel  modal-fixed-footer" backdrop="static" keyboard={false}>
  <div className="modal-content ">
    <div className="">


      <h4 className="center orange-text"> Transactions </h4>



      <form >


        <div className="row ">
          <div className="col  s6 l6">
            {/* Order Status Radio Buttons */}
            <h5>FedEx Tracking Status</h5>
            {(() => {

        return(
              <Table striped bordered hover>
                <thead>
                  <tr>
                  <th>Box ID</th>
                    <th>Tracking No.</th>
                    
               
                  </tr>
                </thead>
                <tbody>
                
                {this.state.AllSuccess.map((key)=>{
                  return(
                    <tr>
                    <td>
                      {key}
                    </td>
                    <td>
                    {/* {this.state.FedExTrackingData[key]} */}
                    {this.state.FedExTrackingData[key] ? this.state.FedExTrackingData[key] : <Spinner animation="border" /> }
                   
                    </td>
                    </tr>
                  )
                })}

           
          

               
                </tbody>
              </Table>

                        )
            })()}
            {/* { this.state.parentboxSelected} */}

          </div>
        </div>


      </form>
    </div>
  </div>
  <div className="modal-footer">

    <ButtonGroup className="mr-2" aria-label="First group">

      {/* {
        this.state.isFedexSuccess
        ?
          <>
            <Button id="closeEditBoxBtn" variant="outline-secondary" className="mr-4 btn modal-close "
              onClick={this.CancelShipping}
            > Cancel Shipping</Button>
            <Button id="updateBoxBtn" variant="outline-primary" className="mr-2 btn modal-close"
              onClick={this.FinishShipping}
            > Finish Shipping</Button>
          </>
        :
          <>
            <Button id="closeEditBoxBtn" variant="outline-secondary" className="mr-4 btn modal-close " disabled
              onClick={this.CancelShipping}
            > Cancel Shipping</Button>
            <Button id="updateBoxBtn" variant="outline-primary" className="mr-2 btn modal-close" disabled
              onClick={this.FinishShipping}
            > Finish Shipping</Button>
          </>
      } */}
    
      <Button id="closeEditBoxBtn" variant="outline-secondary" className="mr-4 btn modal-close " 
        onClick={this.CancelShipping} 
      > Cancel Shipping</Button>
      <Button id="updateBoxBtn" variant="outline-primary" className="mr-2 btn modal-close"
        onClick={this.FinishShipping}
      > Finish Shipping</Button>

    </ButtonGroup>
  </div>
</div>







  {/* FEDEX tracking Status */}

  {/* Alternate Box select */ }
  
  <div id="AlterBoxModel" className="modal AlterboxModel  modal-fixed-footer" backdrop="static" keyboard={false}>
  <div className="modal-content ">
    <div className="">


      <h4 className="center orange-text"> Add More Box </h4>



      <form >


        <div className="row ">
          <div className="col  s6 l6">
            {/* Order Status Radio Buttons */}
            <h5>Select Boxes to ship</h5>
            {(()=>{
              return(
                <Table striped bordered hover>
                <thead>
                <tr>
                <th>
                Box ID
                </th>

                <th>
                Customer Id
                </th>

                <th>
                Country
                </th>

                <th>
                Select to Ship
                </th>
                </tr>
                </thead>
                <tbody>
                {this.state.boxlist.map(key=>{
                 if(!this.state.boxselectedlist.includes(key.box_id) && key.box_status_name ==='New'){
                   return(
                     <tr>
                     <td>{key.box_id}</td>
                     <td>{key.ezz_id}</td>
                     <td>{key.country}</td>
                     <td>
                     <p className="right red-text">
                          <label>

                      <input type="checkbox"  value={key.box_id} onChange={(e)=>this.ShipAlternateBoxes(e, key.freight_charge, key.custom_duty)} /> 
                      <span>Select to ship</span>
                      </label>
                      </p>
                  
                  
                    </td>
                     </tr>

                   )
                 }
                })} </tbody>

                </Table>
              )
            })()}
            {/* { this.state.parentboxSelected} */}

          </div>
        </div>
      


      </form>
    </div>
  </div>
  <div className="modal-footer">

    <ButtonGroup className="mr-2" aria-label="First group">
    
      
      <Button id="updateBoxBtn" variant="outline-primary" className="mr-2 btn modal-close"
        onClick={this.ProceedTransaction}
      > Proceed</Button>

    </ButtonGroup>
  </div>
</div>

  {/* Alternate Box select */ }





          <div id="parentboxModel"  className="modal parentboxModel  modal-fixed-footer">
            <div className="modal-content ">
              <div className="">


                <h4 className="center orange-text"> Parent Box </h4>



                <form >


                  <div className="row ">
                    <div className="col  s6 l6">
                      {/* Order Status Radio Buttons */}
                      <h5>Select Parent Box</h5>
                      {(() => {


                        return this.state.boxselectedlist.map((box, index) => {
                          
                          return (
                            <p key={index}>
                              <label>
                                <input name="parentboxSelected" value={box} type="radio"
                                  checked={this.state.parentboxSelected === box} onChange={this.handleParentBoxChange} />
                                <span>Box ID {box}</span>
                              </label>
                            </p>


                          )

                        })


                      })()}
                      {/* { this.state.parentboxSelected} */}

                    </div>
                  </div>


                </form>
              </div>
            </div>
            <div className="modal-footer">

              <ButtonGroup className="mr-2" aria-label="First group">
              
                <Button id="closeEditBoxBtn" variant="outline-secondary" className="mr-4 btn modal-close " onClick={this.CloseParentBoxModel} >Close</Button>
                <Button id="updateBoxBtn" variant="outline-primary" className="mr-2 btn modal-close"
                  onClick={this.shipOrder}
                > Proceed</Button>

              </ButtonGroup>
            </div>
          </div>

          {/* ON HOLD MODAL */}

          {/* ADD NEW REMARKS  */}
          <div id="remarksForOnHold" className="modal remarksForOnHold  modal-fixed-footer">
            <div className="modal-content ">
              <div className="">


                <h4 className="center orange-text"> Remarks </h4>

                <form  >
                  <div className="row ">
                    <div className="col  s6 l6">
                      <h5>Reason for On Hold <p style={{ fontSize: "11px" }} > Box Id: {this.state.tempBoxId}</p></h5>

                      {(() => {
                        return (
                          <>

                            <label htmlFor="remarksText">
                              Remarks:
                              </label>
                            <textarea
                              id="remarksText"
                              className=""
                              name=""
                              value={this.state.value}
                              onChange={this.handleChangeRemarksText}
                              placeholder={this.props.placeholder} />

                          </>
                        )
                      })()}

                    </div>
                  </div>


                </form>
              </div>
            </div>
            <div className="modal-footer">

              <ButtonGroup className="mr-2" aria-label="First group">
                <Button id="closeRemarksModalBtn" variant="outline-secondary" className="mr-4 btn modal-close "  >Cancel</Button>
                <Button id="saveRemarksModalBtn" variant="outline-primary" type="submit" className="mr-2 btn modal-close" onClick={this.saveOnHoldRemarks} >Save</Button>
              </ButtonGroup>
            </div>
          </div>

          {/* UPDATE REMARKS:::: */}

          <div id="updateRemarksOnHold" className="modal updateRemarksOnHold  modal-fixed-footer">
            <div className="modal-content ">
              <div className="">


                <h4 className="center orange-text"> Remarks </h4>

                <form  >
                  <div className="row ">
                    <div className="col  s6 l6">
                      <h5>Reason for On Hold  <p style={{ fontSize: "11px" }}  >Box Id: {this.state.tempBoxId2}</p></h5>

                      {(() => {
                        return (
                          <>

                            <label htmlFor="remarksTextEdit">
                              Remarks:
                              </label>
                              <textarea
                              id="remarksTextEdit"
                              className=""
                              name=""
                              value={this.state.value}
                              onChange={this.handleChangeRemarksTextEdit}
                              placeholder={this.props.placeholder} />

                          </>
                        )
                      })()}

                    </div>
                  </div>


                </form>
              </div>
            </div>
            <div className="modal-footer">

              <ButtonGroup className="mr-2" aria-label="First group">
              
                <Button id="closeRemarksModalBtn" variant="outline-secondary" className="mr-4 btn modal-close "  >Cancel</Button>
                <Button id="saveRemarksModalBtn" variant="outline-primary" type="submit" className="mr-2 btn modal-close"
                  onClick={() => this.updateOnHoldRemarks(document.getElementById('remarksTextEdit').name)} >Update</Button>
              </ButtonGroup>
            </div>
          </div>



          {/* ON HOLD MODAL */}

        </>

        <div className="row">
          <div className="col s3">
            <h4 className=" orange-text">Box Listing </h4>
          </div>

              {/* This will be a message text */}
              {
                this.state.isTotalBoxWeight
                ?
                  <>
                    <div className="col s3 l2">
                      <p>
                        Threshold: {this.state.countryThreshold} <br/>
                        Total weight: {this.state.checkTotalWeight}  
                      </p>
                    </div>
                    <div className="col s3 l2">
                        {
                          this.state.checkTotalWeight < this.state.countryThreshold
                          ? `Remaining Space: ${this.state.remainingSpace}`
                          : `Remaining Space: 0 `
                        }<br/>                         
                        Freed Space: {this.state.freedSpace} 
                        {/* <Button onClick={this.clearWeightCalculations()} >Clear</Button> */}
                    </div>
                  </>

                :''
              }

          {/* <div className="col s3 l3 offset-m8 offset-l8"> */}
          <div className="col s3 l3 ">
            {/* hide Manifest button because we not using selection things RN */}
            <Button variant="outline-primary " onClick={this.readyToShipOrders}>Ship</Button>
          </div>
        </div>

        <Row>
          <Col xs={6} md lg={6}>
            <div>
                {
                  this.state.previousPageUrl
                    ? <Button variant="outline-secondary " className="teal white-text mr-2" onClick={() => this.updateBoxList(this.state.previousPageUrl, '-')} ><NavigateBefore /></Button>
                    : <Button variant="outline-secondary " className="teal white-text mr-2" disabled><NavigateBefore /></Button>
                }
                {
                  this.state.nextPageUrl
                    ? <Button variant="outline-secondary " className="teal white-text mr-2" onClick={() => this.updateBoxList(this.state.nextPageUrl, '+')}><NavigateNext /></Button>
                    : <Button variant="outline-secondary " className="teal white-text mr-2" disabled><NavigateNext /></Button>
                }          
            </div><br/>
            <div>
              <h5>Page: {this.state.currentPageNumber}</h5>
            </div>
          </Col>
          <Col xs={6} md lg={6}>
            <div>
              <InputGroup className="mb-3" style={{ float: 'right', width: '270px' }}>
                <InputGroup.Prepend >
                  <InputGroup.Text style={{ border: '1px solid grey', background: 'white' }} id="inputGroup-sizing-default"><Search /></InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  style={{ border: '1px solid gray', borderRadius: '2px', paddingLeft: '10px' }}
                  aria-label="Default"
                  aria-describedby="inputGroup-sizing-default"
                  placeholder="  Search here....."
                  onChange={this.editSearchTerm.bind(this)}
                  onKeyUp={this.handleKeyDownSearch}
                />
              </InputGroup>
            </div>
            <div style={{ float: 'right', width: '270px' }}>
              {
                this.state.searchResultsCount > -1
                  // ? <h5>Found <span style={{ color: 'orange' }} >{this.state.searchResultsCount}</span> results</h5>
                  ? <h5>Showing
                    <span style={{ color: 'orange' }} > {this.state.currentBoxListCount} </span> of
                    <span style={{ color: 'orange' }} > {this.state.searchResultsCount} </span> results
                  </h5>
                  : <h5>Showing
                    <span style={{ color: 'orange' }} > {this.state.currentBoxListCount} </span> of
                    <span style={{ color: 'orange' }} > {this.state.totalBoxListCount} </span> results
                  </h5>
              }
            </div>
          </Col>
        </Row>

        <EditBox boxid={this.state.boxforedit}

          ref="editbox" />

        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div >

              <div id="boxlistdiv" >
                <Row id=" orderlistrow">
                  <Col>
                    <p> <Image className="mr-1" src="assets/images/down.svg" />Box ID</p>
                  </Col>
                  <Col>
                    <p className=""> <Image className="mr-1" src="assets/images/down.svg" />Customer Id</p>
                  </Col>
                  <Col>
                    <p> <Image className="mr-1" src="assets/images/down.svg" />Country</p>
                  </Col>
                  <Col >
                    <p className=""> <Image className="" src="assets/images/down.svg" />Create Date</p>
                  </Col>
                  <Col >
                    <p className=""> <Image className="" src="assets/images/down.svg" />Box Weight</p>
                  </Col>

                  <Col >
                    <p> <Image className="" src="assets/images/down.svg" />Outbound NO</p>
                  </Col>

                </Row>
                <div className="divider"></div>
              </div>
              <div className="orderlistwrapperdiv">

                <Accordion>
                  <form>
                    {BoxCardList}
                  </form>

                </Accordion>
              </div>

            </div>
          </Col>

        </Row>

        <Modal show= {this.state.showPaymentProcess} backdrop="static" keyboard={false}
                style={{ height: 'auto'}}
         >
           {
             this.state.failureErrorMessage
             ?<div style={{ textAlign: "right" }} ><Close onClick={this.handleProgressModal} style={{ cursor: 'pointer' }} /></div>
             :""
           }
          <Modal.Body>
            {this.state.errorType}
            {
              this.state.failureErrorMessage
                ? <h4>{this.state.failureErrorMessage}</h4>                  
                : <div style={{ textAlign: "center" }} ><CircularProgress color="inherit" /></div>
            }
          
          </Modal.Body>
        </Modal>

      </Container>
    )
  }
}

export default withStyles(useStyles)(BoxList);
