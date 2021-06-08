import React, { Component } from 'react';
import { Row, Col, ButtonGroup, Button, Spinner } from 'react-bootstrap';
import M from 'materialize-css';
import Axios from "axios";
import { base_url } from '../../globalConstants';

//css is in orderlist.css

class EditProduct extends Component {
    constructor(props) {
        super(props);
        this.state = ({

            row_number: this.props.rowNumber,
            product_details: {},
            product_category_options: [],
            product_name: "",
            product_price: 0,
            product_quantity: 0,
            product_category: "",

        })

    }

    componentDidMount() {
        M.AutoInit()
    }

    componentDidUpdate(prevProps) {


        if (this.props.productDetails !== prevProps.productDetails) {
            let product = this.props.productDetails;
            this.setState({
                row_number: this.props.rowNumber,
                product_details: this.props.productDetails,
                product_category_options: this.props.productcategory,
                product_name: product.productName,
                product_price: product.productPrice,
                product_quantity: product.productQuantity,
                product_category: product.productCategory,

            })
            console.log("Row for updatation", this.props.rowNumber)
            product = this.props.productDetails;
        }
    }
    openModal = (rowNum, prodDetails, countryoptions) => {
        console.log("inside update Product no. ", rowNum);
        //  console.log(orderdata);
        var elems = document.getElementById("updateProductModal");
        var instance = M.Modal.init(elems);
        // console.log("categlry", this.state.countryoptions)
        console.log(this.props.rowNumber);
        this.setState({
            row_number: this.props.rowNumber,
            product_details: prodDetails,
            product_category_options: countryoptions
        })
        instance.open()
        // orderselectionmodal
    }
    closeModal = () => {
        var elems = document.getElementById("updateProductModal");
        var instance = M.Modal.init(elems);
        instance.close()
    }

    handleFormChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        console.log(value)
        this.setState(
            { [name]: value }
        )

    }
    updateItemInlist = () => {

        // M.toast({html: 'item updation clicked'+this.state.product_details.id,classes:"white-text blue rounded"});
        let rowNum = this.state.row_number
        console.log("ID OF proudct", this.state.product_details.id)
        let updatedItem = {
            id: this.state.product_details.id,
            productName: this.state.product_name,
            productPrice: this.state.product_price,
            productQuantity: this.state.product_quantity,
            productCategory: this.state.product_category,

        }
        // M.toast({html: 'item updation clicked'+rowNum + updatedItem,classes:"white-text blue rounded"})
        this.props.updateBtnClick(rowNum, updatedItem)

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

    deleteItemInlist = () => {
        // console.log("PRODUCT DETAILS",this.state.product_details)
        // alert(`delete product id ${tempProductId}` )
        // let rowNum = this.state.row_number
        // let updatedProductList=this.state.productlist.splice(rowNum, 1)
        // this.setState({productlist: updatedProductList})
        // this.deleteProductFromDB(this.state.product_details.id)

        let rowNum = this.state.row_number
        let delete_ItemId = this.state.product_details.id
        this.props.deleteBtnClick(rowNum, delete_ItemId)

    }

    render() {
        const product = this.state.product_details;
        // console.log(product);
        // console.log("categlry", this.state.product_category_options)
        const catlist = this.state.product_category_options;
        var categoryList;
        try {


            if (catlist.length > 0) {
                categoryList = catlist.map((item, i) => {
                    return (
                        <option className="black-text" key={i} value={item.category_id}>{item.category_name}</option>
                    )
                }, this);
            }

        } catch (error) {
            console.log("categories can't be added in product")
        }




        return (

            <div id="updateProductModal" className="modal modal-fixed-footer">
                <div className="modal-content">
                    <h4 className="center orange-text"> Edit Product Details </h4>
                    <Row>
                        <Col xs={12} >
                            <form>
                                <Row>
                                    <Col className=" rowdivPading " xs={12}>
                                        <div className="input-field col s6 offset-s3 center">
                                            <input name="product_name" id="product_name" type="text" value={this.state.product_name} onChange={this.handleFormChange} className="" />

                                            <span className="helper-text left" data-error="wrong" data-success="">Enter a valid Product Name</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className=" rowdivPading ">
                                        <div className="input-field col s6 offset-s3 center">
                                            <label className="active" htmlFor="product_quantity"  style={{ marginLeft: '20%' }}>Quantity</label>
                                            <input name="product_quantity" id="product_quantity" min="0" type="number" value={this.state.product_quantity} onChange={this.handleFormChange} className="" />

                                            <span className="helper-text left" data-error="wrong" data-success="">Enter number of products items</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className=" rowdivPading ">
                                        <div className="input-field col s6 offset-s3 center">
                                            <label className="active" htmlFor="product_price" style={{ marginLeft: '20%' }}>Product Price</label>
                                            <input name="product_price" disabled={this.props.status === "IM"} id="product_price" min="0" type="number" value={this.state.product_price} onChange={this.handleFormChange} className="" />

                                            <span className="helper-text left" data-error="wrong" data-success="">Enter Price</span>
                                        </div>
                                    </Col>
                                </Row>
                                


                                <Row>
                                    <Col>

                                        <div id="categroydiv" className="input-field col s6 offset-s3 center">
                                            {/* <p>Select Category</p> */}
                                            <select id='category_name_select' value={this.state.product_category} name="product_category" className="browser-default" onChange={this.handleFormChange}>
                                                <option value="" disabled selected>Choose Category</option>

                                                {categoryList}

                                            </select>
                                            {/* <label>Select Category</label> */}

                                        </div>


                                    </Col>

                                </Row>


                            </form>
                        </Col>
                    </Row>
                </div>
                <div className="modal-footer" >
                    {/* <a href="#!" className="modal-close waves-effect waves-green btn-flat">Agree</a> */}



                    <ButtonGroup className="mr-2" aria-label="First group">
                        <Button id="cancelItemAddBtn" variant="outline-secondary" className="mr-4 btn modal-close "  >Cancel</Button>
                        <Button id="addItemBtn" variant="outline-primary" className="mr-2 btn modal-close" onClick={this.updateItemInlist}> Update</Button>{' '}
                        {
                            this.state.product_details.id
                            ?<Button id="deleteItemBtn" variant="outline-primary" className="mr-2 btn modal-close" onClick={this.deleteItemInlist}> Delete</Button>
                            :""
                        }
                        

                    </ButtonGroup>

                </div>
            </div>


        )
    }

}
export default EditProduct;