import React,{Component} from 'react';
import {Row, Col,Card,Container, Button} from 'react-bootstrap'
import { base_url } from '../../globalConstants'
import axios from 'axios';
import { saveAs } from 'file-saver';

class Reports extends Component{
    constructor(props){
        super (props);

        this.state = {
            countryName: '',
            country_list: this.props.countryList
        }

        // console.log('selectCounrtyOptions',this.state.selectCounrtyOptions)

    }

    handleCountryChange = e => {
        console.log(e.target.value);
        this.setState({countryName: e.target.value })
    }
    
    downloadReport = async () => {
        let report_url = base_url + `get_order_csv?country=${this.state.countryName}`
        console.log('url',report_url);
        console.log('this.state.countryName',this.state.countryName);
        var FileSaver = require('file-saver');

        await axios({
            url: report_url,
            method: 'GET',
            responseType: 'arraybuffer'
        })
        .then((response)=>{
            {
                var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                FileSaver.saveAs(blob, `${this.state.countryName}.xlsx`);
            }
            console.log('response',response);
        }).catch((err)=>{
            console.log('err',err);
        })
    }

    render(){
        const selectCounrtyOptions = this.state.country_list.map((country, index) => {

            return (
              <option key={index} value={country}>{country}</option>
            )
          })
        return(
            <Container>
            <Row>
                <Col>
                    <h5>Countrywise</h5> <br/>
                </Col>
              {/* <Col >
                <div>
                    <h5>Select country</h5>
                </div>
              </Col> */}
              <Col >
                <div>
                    <select id="country_name_select" name="country_name" className="browser-default country_name_select" value={this.state.countryName} onChange={this.handleCountryChange}>
                        <option value=""  >Choose Country</option>
                        {selectCounrtyOptions}
                    </select>
                </div>
              </Col>
              <Col>
                <Button onClick={this.downloadReport}>
                    Download
                </Button>
              </Col>
            </Row>
            </Container>
        )
    }
}

export default Reports;