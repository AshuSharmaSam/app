
import React, { Component, Fragment } from 'react';
import { base_url } from '../../globalConstants'
import { Table, Row, Col, Image, Nav, ButtonGroup, Button } from 'react-bootstrap';
import M from "materialize-css";
import { EditOutlined } from "@material-ui/icons";
import Axios from 'axios';
import './addprinterIP.css';


export default class PrinterFrag extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            countryId: "", warehouseId: "", portNumber: "", IPaddress: "",
            printerIPdata: this.props.printerIPdata,
            countrylist: this.props.countrylist, countrycodelist: this.props.country_code_list,
            warehouseIDlist: this.props.warehouseIDList,
            error: "",
            editRow: false, printerId: "", countryName: "", editRowNumer: "", mainId:""
        })

    }

    handleCountryNameChange = (e) => {

        let selected_countryName = this.state.countrycodelist[this.state.countrylist.indexOf(e.target.value)]
    
        this.setState({ countryName: e.target.value})
        this.setState({ countryId: selected_countryName})
    }

    handleWarehouseIdChange = async (e) => {
        // console.log("WarehouseID selected:- " + e.target.value) 
        this.setState({ warehouseId: e.target.value })
    }

    handlePortNumber = (e) => {
        this.setState({ portNumber: e.target.value })
    }
    handleIPaddress = (e) => {
        this.setState({ IPaddress: e.target.value })
    }

    //EDIT OPTION START
    handleEditOption = (e) => {
        this.setState({ editRow: true })
        var elems = document.getElementById("addPrinterDetailsModal");
        var instance = M.Modal.init(elems);
        instance.open()

        let selectedRowIndex;
        e = e || window.event;
        var data = [];
        var target = e.srcElement || e.target;
        // console.log(target.nodeName)
        while (target && target.nodeName !== "TR") {
            target = target.parentNode;
            selectedRowIndex = target.sectionRowIndex
            console.log("Clicked row", target.sectionRowIndex)
            // console.log(target.parentNode.index)
        }
        if (target) {
            var cells = target.getElementsByTagName("td");
            for (var i = 0; i < cells.length; i++) {
                data.push(cells[i].innerHTML);
            }
        }
        let country_name = this.state.countrylist[this.state.countrycodelist.indexOf(data[4])]
        // let country_name = this.state.countrylist[this.state.countrycodelist.indexOf(data[3])]

        this.setState({ editRowNumer: selectedRowIndex })
        console.log(selectedRowIndex);
        this.setState({ mainId: data[0] })
        this.setState({ printerId: data[1] })
        this.setState({ countryName: country_name, warehouseId: data[5], portNumber: data[3], IPaddress: data[2] })
        console.log(data);
        console.log(country_name);
        console.log(data[5]);

    }
    openAddPrinterDetailsModal = () => {
        this.setState({ editRow: false })

        var elems = document.getElementById("addPrinterDetailsModal");
        var instance = M.Modal.init(elems);
        instance.open()

    }
    closeModal = () => {
        var elems = document.getElementById("addPrinterDetailsModal");
        var instance = M.Modal.init(elems);
        instance.close();
        this.setState({ editRow: false })
        this.setState({
            countryId: "", countryName: "", warehouseId: "",
            portNumber: "", IPaddress: "",
            error: ""
        })
    }
    updatePrinterDetailsDB = async () => {

        let country_code = this.state.countrycodelist[this.state.countrylist.indexOf(this.state.countryName)]
        let url = base_url+`printer_ip/${this.state.printerId}/`

        // console.log(this.state.statename + this.state.statecode + this.state.countryname)
        var printerformdata = new FormData()
        printerformdata.append("printer_id", this.state.printerId)
        printerformdata.append("ip_address", this.state.IPaddress)
        printerformdata.append("port_number", this.state.portNumber)
        printerformdata.append("country_id", country_code)
        printerformdata.append("warehouse_id", this.state.warehouseId)


        // @Todo: APi to be called to save data for state

        try {
            let token = localStorage.getItem("token")
            var config = {
                headers: { 'Content-Type': 'multipart/form-data', 'Authorization': 'Token ' + token },

            };
            const response = await Axios.put(url, printerformdata, config)

            let itemIndex = parseInt(this.state.mainId) - 1
            this.state.printerIPdata.splice(itemIndex, 1, response.data)

            // this.state.printerIPdata.unshift(response.data)
            var elem = document.getElementById('addPrinterDetailsModal')
            var instance = M.Modal.getInstance(elem);
            instance.close();
            M.toast({ html: 'Updated Printer Successfully.', classes: "white-text orange rounded" })
            this.setState({
                countryId: "", countryName: "", warehouseId: "",
                portNumber: "", IPaddress: "",
                error: ""
            })
            this.setState({
                error: "",
                editRow: false
            })
        } catch (err) {
            this.setState({
                error: "OH Snap! Something is Wrong.Please try again",
                editRow: false
            })
            M.toast({ html: 'Please Try Again!', classes: "white-text red rounded" });

            console.log(err.message)
        }

    }
    //EDIT OPTION END

    addPrinterDetailsToDB = async () => {
   
        let num = Math.floor(Math.random() * Math.floor(10000));

        var printerformdata = new FormData()
        printerformdata.append("printer_id", num.toString())
        printerformdata.append("ip_address", this.state.IPaddress)
        printerformdata.append("port_number", this.state.portNumber)
        printerformdata.append("country_id", this.state.countryId)
        printerformdata.append("warehouse_id", this.state.warehouseId)

        let url = base_url+'printer_ip/'

        try {
            let token = localStorage.getItem("token")

            var config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Token ' + token
                },
            };

            const response = await Axios.post(url, printerformdata, config)
            this.state.printerIPdata.unshift(response.data)
            var elem = document.getElementById('addPrinterDetailsModal')
            var instance = M.Modal.getInstance(elem);
            instance.close();
            this.setState({
                countryId: "", countryName: "", warehouseId: "",
                portNumber: "", IPaddress: "",
                error: ""
            })
            // @Todo: APi to be called to save data for SLAB
            M.toast({ html: 'Added Printer Details successfully ', classes: "white-text orange rounded" })


        } catch (err) {
            this.setState({
                error: "OH Snap! Something is Wrong.Please try again"
            })
            M.toast({ html: 'Please Try Again!', classes: "white-text red rounded" });


        }



    }



    componentDidMount() {
        // Auto initialize all the things!
        M.AutoInit();
    }


    render() {
        var uniquekey = 0
        var warehouseIDkey = 0

        const selectCounrtyOptions = this.state.countrylist.map((country) => {

            return (
                <option key={uniquekey++} value={country}>{country}</option>
            )
        })


        const selectWarehouseIDOptions = this.state.warehouseIDlist.map((wID) => {

            return (
                <option key={warehouseIDkey++} value={wID}>{wID}</option>
            )
        })

        var sr_no = 0;  
        const printerIPtable = this.state.printerIPdata.map((printer) => {
        sr_no=sr_no+1            
            return (
                <Fragment key={sr_no}>
                    <tr>
                        <td>{sr_no}</td>
                        <td>{printer.printer_id}</td>
                        <td>{printer.ip_address}</td>
                        <td>{printer.port_number}</td>
                        <td>{printer.country_id}</td>
                        <td>{printer.warehouse_id}</td>
                        <td><a title="Edit" onClick={this.handleEditOption}><EditOutlined /></a></td>
                        <td className="hide">{printer.id}</td>

                    </tr>
                </Fragment>

            )
        })

        const table_render = <Table hover >
            <thead>
                <tr>
                    <th>Sr.No.</th>
                    <th>Printer ID</th>
                    <th>IP Address</th>
                    <th>Port No.</th>
                    <th>Country ID</th>
                    <th>Warehouse ID</th>
                    <th>Edit</th>
                </tr>
            </thead>
            <tbody>
                {printerIPtable}

            </tbody>
        </Table>

        return (
            <Fragment>
                <br></br>
                <br></br>
                {/* <div className="">
    <AddCountry ref="child"/>
        </div> */}




                {/* <!-- Modal Trigger --> */}
                <div id="addPrinterDetailsModal" className="modal modal-fixed-footer">
                    <div className="modal-content">

                        <h4 className="center orange-text"> {this.state.editRow ? "Update Printer Details" : "Add Printer Details "}</h4>

                        <Row>
                            <Col xs={12} >
                                <form>
                                    <p className="center red-text">{this.state.error}</p>

                                    <Row>
                                        <Col className=" rowdivPading " xs={12}>
                                            <div className="input-field col s6 offset-s3 center">
                                                <div id=''>

                                                    {
                                                        this.state.editRow
                                                        ? <select id="country_name_select" name="country_name" className="browser-default country_name_select" value={this.state.countryName} onChange={this.handleCountryNameChange}>
                                                            <option value="" disabled >Choose Country</option>
                                                            {selectCounrtyOptions}

                                                        </select>
                                                        : <select id="country_name_select" name="country_name" className="browser-default country_name_select" defaultValue={'DEFAULT'} onChange={this.handleCountryNameChange}>
                                                            <option value="DEFAULT" disabled >Choose Country</option>
                                                            {selectCounrtyOptions}

                                                        </select>
                                                    }
                                                    <label>Select Country</label>

                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className=" rowdivPading " xs={12}>
                                            <div className="input-field col s6 offset-s3 center">
                                                <div id=''>
                                                    {
                                                        this.state.editRow
                                                        ? <select id="warehouse_id_select" name="warehouseId_select" className="browser-default warehouse_id_select" value={this.state.warehouseId} onChange={this.handleWarehouseIdChange}>
                                                            <option value="" disabled >Choose Warehouse ID</option>
                                                            {selectWarehouseIDOptions}
                                                        </select>
                                                        : <select id="warehouse_id_select" name="warehouseId_select" className="browser-default warehouse_id_select" defaultValue={'DEFAULT'} onChange={this.handleWarehouseIdChange}>
                                                            <option value="DEFAULT" disabled >Choose Warehouse ID</option>
                                                            {selectWarehouseIDOptions}
                                                        </select>
                                                    }
                                                    <label>Select Warehouse ID</label>

                                                </div>
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col className=" rowdivPading ">
                                            <div className="input-field col s6 offset-s3 center">
                                                <input name="IPaddress" id="IP_address" type="text" className="" value={this.state.IPaddress}
                                                    onChange={this.handleIPaddress} />
                                                <label htmlFor="IP_address" className="black-text">Enter IP Address</label>
                                                <span className="helper-text left" data-error="wrong" data-success=""></span>
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col className=" rowdivPading ">
                                            <div className="input-field col s6 offset-s3 center">
                                                <input name="portNumber" id="port_number" type="text" className="" value={this.state.portNumber}
                                                    onChange={this.handlePortNumber} />
                                                <label htmlFor="port_number" className="black-text">Enter Port Number</label>
                                                <span className="helper-text left" data-error="wrong" data-success=""></span>
                                            </div>
                                        </Col>
                                    </Row>

                                </form>
                            </Col>
                        </Row>
                    </div>
                    <div className="modal-footer">
                        {/* <a href="#!" className="modal-close waves-effect waves-green btn-flat">Agree</a> */}

                        <ButtonGroup className="mr-2" aria-label="First group">
                            <Button id='cancelPrinterBtn' variant="outline-secondary" className="mr-4 btn modal-close " onClick={this.closeModal} >Cancel</Button>
                            {
                                this.state.editRow
                                    ? <Button id="updatePrinterBtn" variant="outline-primary" className="mr-2 btn" onClick={this.updatePrinterDetailsDB}>Update</Button>
                                    : <Button id="addPrinterBtn" variant="outline-primary" className="mr-2 btn" onClick={this.addPrinterDetailsToDB}> Add</Button>
                            }
                        </ButtonGroup>

                    </div>
                </div>

                <div className="">
                    <Row>
                        <Col xs={12} md={12} lg={12} >
                            <div className="tableheight">
                                {table_render}
                            </div>
                        </Col>

                    </Row>
                    <Row>
                        <Col >

                            <Nav className="right">
                                <Nav.Link className="red-text modal-trigger " href="" onClick={this.openAddPrinterDetailsModal}>
                                    Add Printer Details<Image className="red-text mr-auto" src="assets/images/plus-circle-red-m.svg" /></Nav.Link>
                            </Nav>


                        </Col>
                    </Row>
                </div>


            </Fragment>
        )
    }

}

