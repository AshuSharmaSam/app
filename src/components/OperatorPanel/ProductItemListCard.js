import React, {Component} from 'react';
import {Table} from 'react-bootstrap';
import M from "materialize-css";
import './productlistitemcard.css'
import DeleteIcon from '@material-ui/icons/Delete';
import Axios from 'axios';
import { base_url } from '../../globalConstants';
// import {ReactTable} from  'react-table'

class ProductItemsList extends Component{
    constructor(props){
        super (props);
        this.state=({productlist: this.props.products})
    }
    componentDidMount() {
        M.AutoInit();
    }

    componentDidUpdate(prevProps) {
        if (this.props.orderid !== prevProps.orderid || this.props.products !== prevProps.products) {
        this.setState({productlist: this.props.products})
    
        }
    }
    handleRowClick = (e) => {
        // const data = event.target.getAttribute('data-item');
        // var row = this.parentNode.rowIndex;
        // console.log("row",row)
        // console.log("row i",e)

            // console.log('We need to get the details for ', data);
            // var table = document.getElementsByTagName("productTable");
            // var tbody = document.getElementsByTagName("productTableBody");
                let selectedRowIndex ;
                e = e || window.event;
                var data = [];
                var target = e.srcElement || e.target;
                // console.log(target.nodeName)
                while (target && target.nodeName !== "TR") {
                    target = target.parentNode;
                    selectedRowIndex= target.sectionRowIndex
                    // console.log("Clicked row",target.sectionRowIndex)
                    // console.log(target.parentNode.index)
                }
                if (target) {
                    var cells = target.getElementsByTagName("td");
                    for (var i = 0; i < cells.length; i++) {
                        data.push(cells[i].innerHTML);
                    }
                }
                console.log(data, 'Here DATA is DISPLAYING');
          




        this.props.rowclick(selectedRowIndex);
    }

    deleteProductFromDB = async (tempProductId) =>{
        // alert(`delete product id ${tempProductId}` )

        await Axios({
            method: 'DELETE',
            url: base_url+`products/${tempProductId}/`
        }).then(function(response){
            // console.log(`DELETED${tempProductId}`, response);
            M.toast({html: `Product deleted successfully`,classes: "white-text blue rounded"})
        }).catch(function(response){
            // console.log("NOT DELETED ERROR",response);
            M.toast({html: `Product deletion failed`,classes: "white-text red rounded"})
        })
    }

    deleteProduct = (tempProductId, clickedRow) => {
        // alert(`delete product id ${tempProductId}` )
        let updatedProductList=this.state.productlist.splice(clickedRow, 1)
        // this.setState({productlist: updatedProductList})
        this.deleteProductFromDB(tempProductId)
    }

    render(){
        
            

        var itemrows = this.state.productlist.map((item,index)=>
        {
            // console.log("CLICKED ROW", index)
            return(
                

            <tr key={item.id} data-item={item} onClick={this.handleRowClick}>
    
                <td>{item.productName}</td>
                <td>{item.productQuantity}</td>                
                <td>{parseFloat(item.productPrice).toFixed(2)}</td>          
                <td>{item.productCategory}</td>
                {/* {
                    item.id != ""
                    ?<td onClick={()=>this.deleteProduct(item.id,index)} style={{ cursor: "pointer" }}><DeleteIcon/></td>
                    :""
                } */}
                
            </tr>

             

            )
        })

        return(
            <> 
            {/* <Accordion>

                {itemcards}     
            </Accordion> */}
            <Table id="productTable" striped bordered hover size="sm" >
  <thead>
    <tr>
      
      <th>Name</th>
      <th>Quantity</th>
      <th>Price ($)</th>
      <th>Category</th>
  
    </tr>
  </thead>
  <tbody id='productTableBody'>
            {itemrows}
 
  </tbody>
</Table>




            </>
        )
    }
}

export default ProductItemsList;