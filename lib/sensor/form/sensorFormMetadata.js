import React from 'react';
import PropTypes from 'prop-types';

import {SensorPropTypes} from 'istsos3-core';

import Humans from '../../humans/humans';

// Semantic UI components
import {
    Form,
    Header,
    Input,
    Divider,
    TextArea,
    Label,
    Icon
} from 'semantic-ui-react'


class SensorFormMetadata extends React.Component {

    constructor(props) {
        super(props);
        this.checkname = false;
        this.state = {

            validatingName: false,
            nameValid: false,
            validated: false,

            // General Info
            name: '',
            alias: '',
            keyword: '',
            keywords: [],
            description: '',

            // Identification
            manufacturer: null,
            modelNumber: '',
            serialNumber: '',

            // Capabilities
            samplingTimeResolution: '',
            samplingTimeResolutionValid: true,
            acquisitionTimeResolution: '',
            acquisitionTimeResolutionValid: true,
            storageCapacity: '',
            batteryCapacity: '',

            // Contacts
            owner: null,
            operator: null,
            ...this.sensor2state()
        };
    }

    componentDidMount(){
        // If the sensor name is given throught props, the check is done
        if(this.state.name != ''){
            let sn = this.state.name.replace(/[^\w]/gi, '');
            this.setState({
                ...this.state,
                name: sn,
                validated: false,
                nameValid: false,
                validatingName: true
            }, () => {
                this.checkname = false;
                if(sn.length > 0){
                    this.checkname = setTimeout(function(){
                        if(this.state.name.length > 0){
                            this.props.checkSensorName(
                                this.state.name,
                                function(dispatch, json){
                                    this.setState({
                                        validatingName: false,
                                        nameValid: !json.data.exists,
                                        validated: true
                                    }, this._onChange.bind(this));
                                }.bind(this)
                            );
                        }
                    }.bind(this), 1000);
                }
            });
        }
    }

    sensor2state(){
        const {
            sensor
        } = this.props;
        let data = {};
        if (sensor){
            if(sensor.hasOwnProperty('name')){
                data.name = sensor.name;
            }
            if(sensor.hasOwnProperty('procedure_description')){
                debugger;
                const pd = sensor.procedure_description;
                if(pd.hasOwnProperty('general_info')){
                    const gi = pd.general_info;
                    data = {
                        ...data,
                        alias: gi.alias,
                        keywords: gi.keywords? gi.keywords: [],
                        description: gi.description
                    }
                }
                if(pd.hasOwnProperty('identification')){
                    const id = pd.identification;
                    data = {
                        ...data,
                        manufacturer: id.manufacturer,
                        modelNumber: id.model_number,
                        serialNumber: id.serial_number
                    }
                }
                if(pd.hasOwnProperty('capabilities')){
                    const ca = pd.capabilities;
                    data = {
                        ...data,
                        samplingTimeResolution: ca.sampling_time_resolution,
                        samplingTimeResolutionValid: this.checkISOinterval(
                            ca.sampling_time_resolution
                        ),
                        acquisitionTimeResolution: ca.acquisition_time_resolution,
                        acquisitionTimeResolutionValid: this.checkISOinterval(
                            ca.acquisition_time_resolution
                        ),
                        storageCapacity: ca.storage_capacity,
                        batteryCapacity: ca.battery_capacity,
                    }
                }
                if(pd.hasOwnProperty('contact')){
                    const con = pd.contact;
                    data = {
                        ...data,
                        owner: con.owner,
                        operator: con.operator
                    }
                }
            }
        }
        return data;
    }

    handleChange(event) {
        switch (event.target.id) {
            case "sensorFormName":
                let sn = event.target.value.replace(/[^\w]/gi, '');
                this.setState({
                    name: sn,
                    validated: false,
                    nameValid: false,
                    validatingName: true
                }, this._onChange.bind(this));
                if(this.checkname){
                    clearTimeout(this.checkname);
                    this.checkname = false;
                }
                if(sn.length > 0){
                    this.checkname = setTimeout(function(){
                        if(this.state.name.length > 0){
                            this.props.checkSensorName(
                                this.state.name,
                                function(dispatch, json){
                                    this.setState({
                                        validatingName: false,
                                        nameValid: !json.data.exists,
                                        validated: true
                                    }, this._onChange.bind(this));
                                }.bind(this)
                            );
                        }
                    }.bind(this), 1000);
                }
                break;

            case "sensorFormDescription":
                this.setState({
                    description: event.target.value
                }, this._onChange.bind(this));
                break;

            case "sensorFormKeywords": {
                let keyword = event.target.value;
                let keywords = this.state.keywords;
                if(keyword.indexOf(',')>=0){
                    keywords = keyword.split(",");
                    if(keywords.length>1){
                        keyword = keywords.pop();
                        keywords = this.state.keywords.concat(keywords);
                    }else{
                        keyword = keywords[0];
                    }
                }
                this.setState({
                    keyword: keyword,
                    keywords: keywords
                }, this._onChange.bind(this));
                break;
            }
            default: {
                let meta = {};
                let key = event.target.id.replace('sf-', '');
                meta[key] = event.target.value;
                if([
                    'samplingTimeResolution',
                    'acquisitionTimeResolution'
                ].indexOf(key) > -1){
                    meta[key+'Valid'] = this.checkISOinterval(meta[key]);
                }
                this.setState(meta, this._onChange.bind(this));
                break;
            }
        }
    }

    checkISOinterval(interval){
        if(interval==='' || !interval){
            return true;
        }else{
            let re = /^(-?)P(?=\d|T\d)(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)([DW]))?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/;
            let res = re.exec(interval);
            return res !== null;
        }
    }

    _onChange() {
        // state to sensor
        const {
            onChange
        } = this.props;
        if(onChange!==undefined){
            let pd = {}; // procedure description
            let hasPd = false;

            // General Info
            if((this.state.keywords.length
                + this.state.alias.length
                + this.state.description.length) > 0){
                pd["general_info"] = {};
                if (this.state.keywords.length>0){
                    hasPd = true;
                    pd["general_info"]["keywords"] = this.state.keywords;
                }
                if (this.state.alias.length>0){
                    hasPd = true;
                    pd["general_info"]["alias"] = this.state.alias;
                }
                if (this.state.description.length>0){
                    hasPd = true;
                    pd["general_info"]["description"] = this.state.description;
                }
            }

            // Identification
            if(this.state.manufacturer != null || (
                    (
                        this.state.modelNumber.length
                        + this.state.serialNumber.length
                    ) > 0
                )){
                pd["identification"] = {};
                if (this.state.manufacturer != null){
                    hasPd = true;
                    pd["identification"][
                        "manufacturer"] = this.state.manufacturer;
                }
                if (this.state.modelNumber.length>0){
                    hasPd = true;
                    pd["identification"][
                        "model_number"] = this.state.modelNumber;
                }
                if (this.state.serialNumber.length>0){
                    hasPd = true;
                    pd["identification"][
                        "serial_number"] = this.state.serialNumber;
                }
            }

            // Capabilities
            if((this.state.samplingTimeResolution.length
                + this.state.acquisitionTimeResolution.length
                + this.state.storageCapacity.length
                + this.state.batteryCapacity.length) > 0){
                pd["capabilities"] = {};
                if (this.state.samplingTimeResolution.length>0){
                    hasPd = true;
                    pd["capabilities"][
                        "sampling_time_resolution"] = this.state.samplingTimeResolution;
                }
                if (this.state.acquisitionTimeResolution.length>0){
                    hasPd = true;
                    pd["capabilities"][
                        "acquisition_time_resolution"] = this.state.acquisitionTimeResolution;
                }
                if (this.state.storageCapacity.length>0){
                    hasPd = true;
                    pd["capabilities"][
                        "storage_capacity"] = this.state.storageCapacity;
                }
                if (this.state.batteryCapacity.length>0){
                    hasPd = true;
                    pd["capabilities"][
                        "battery_capacity"] = this.state.batteryCapacity;
                }
            }

            // Contacts
            if(this.state.owner != null ||
                    this.state.operator != null){
                pd["contact"] = {};
                if (this.state.owner != null){
                    hasPd = true;
                    pd["contact"][
                        "owner"] = this.state.owner;
                }
                if (this.state.operator != null){
                    hasPd = true;
                    pd["contact"][
                        "operator"] = this.state.operator;
                }
            }
            onChange({
                "name": this.state.name,
                "procedure": this.state.name,
                "procedure_description_format": [
                    "http://www.opengis.net/sensorML/1.0.1"
                ],
                ...(
                    hasPd? {
                        "procedure_description": pd
                    }: null
                )
            }, (
                this.state.nameValid
                && this.state.acquisitionTimeResolutionValid
                && this.state.samplingTimeResolutionValid
            ));
        }
    }

    render() {
        return (
            <Form widths='equal'>
                <Form.Field required>
                    <label>Sensor name</label>
                    <Input
                        iconPosition='left'
                        icon={
                            this.state.validated === true && this.state.nameValid === true?
                            'check': 'delete'
                        }
                        loading={this.state.validatingName}
                        id="sensorFormName"
                        placeholder='Give this sensor a name'
                        onChange={
                            this.handleChange.bind(this)
                        }
                        value={this.state.name}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"/>
                    {
                        this.state.validated && !this.state.nameValid?
                        <Label
                            basic
                            color='red'
                            pointing>
                            <Icon name='warning sign' />
                            Sensor name already exists
                        </Label>:
                        <Label
                            basic
                            color='blue'
                            pointing>
                            <Icon name='info circle' />
                            No special characters: only alfanumeric and underscore are permitted characters.
                        </Label>
                    }
                </Form.Field>
                <Divider horizontal>
                    Optional metadata
                </Divider>
                <Header as='h3'>
                    General info
                </Header>
                <Form.Field>
                    <label>Alias</label>
                    <Input
                        id="sf-alias"
                        placeholder='Give this sensor an alias'
                        onChange={
                            this.handleChange.bind(this)
                        }
                        value={this.state.alias}/>
                </Form.Field>
                <Form.Field>
                    <label>Keywords</label>
                    {
                        this.state.keywords.length>0?
                        <div style={{paddingBottom: '0.5em'}}>
                            {
                                this.state.keywords.map((keyword, index) => (
                                    <Label key={'sfd-kw-'+index} color='black'>
                                        {keyword}
                                        <Icon name='delete' onClick={(e)=>{
                                            this.setState((state)=>{
                                                let kw = [
                                                    ...state.keywords
                                                ];
                                                kw.splice(index, 1);
                                                return {
                                                    keywords: kw
                                                };
                                            }, this._onChange.bind(this));
                                        }}/>
                                    </Label>
                                ))
                            }
                        </div>: null
                    }
                    <Input
                        id="sensorFormKeywords"
                        placeholder='Add some keywords that describe this sensor'
                        onChange={
                            this.handleChange.bind(this)
                        }
                        onKeyPress={(e)=>{
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                this.handleChange({
                                    target: {
                                        id: "sensorFormKeywords",
                                        value: e.target.value + ","
                                    }
                                })
                            }
                        }}
                        value={this.state.keyword}/>
                </Form.Field>
                <Form.Field>
                    <label>Description</label>
                    <TextArea
                        id="sf-description"
                        placeholder='Describe in details this sensor'
                        onChange={
                            this.handleChange.bind(this)
                        }
                        value={this.state.description}/>
                </Form.Field>

                <Header as='h3'>
                    Identification
                </Header>
                <p>
                    Means of providing various identity values
                </p>
                <Form.Field>
                    <label>Manufacturer</label>
                    <Humans
                        layout="dropdown"
                        selected={
                            this.state.manufacturer
                        }
                        onSelected={(human) => {
                            this.setState({
                                manufacturer: human.username
                            }, this._onChange.bind(this))
                        }}
                        value={this.state.manufacturer}/>
                </Form.Field>
                <Form.Field>
                    <label>Model number</label>
                    <Input
                        id="sf-modelNumber"
                        placeholder='What is the model number?'
                        onChange={
                            this.handleChange.bind(this)
                        }
                        value={this.state.modelNumber}/>
                </Form.Field>
                <Form.Field>
                    <label>Serial number</label>
                    <Input
                        id="sf-serialNumber"
                        placeholder='What is the serial number?'
                        onChange={
                            this.handleChange.bind(this)
                        }
                        value={this.state.serialNumber}/>
                </Form.Field>

                <Header as='h3'>
                    Capabilities
                </Header>
                <p>
                    Capability list for quick discovery
                </p>
                <Form.Field
                    error={!this.state.samplingTimeResolutionValid}>
                    <label>
                        Sampling time resolution
                        (ISO 8601 time intervals)
                    </label>
                    <Input
                        id="sf-samplingTimeResolution"
                        placeholder='What is the frequency?'
                        onChange={
                            this.handleChange.bind(this)
                        }
                        value={this.state.samplingTimeResolution}/>
                </Form.Field>
                <Form.Field
                    error={!this.state.acquisitionTimeResolutionValid}>
                    <label>
                        Acquisition time resolution
                        (ISO 8601 time intervals)
                    </label>
                    <Input
                        id="sf-acquisitionTimeResolution"
                        placeholder='How often are the data sent?'
                        onChange={
                            this.handleChange.bind(this)
                        }
                        value={this.state.acquisitionTimeResolution}/>
                </Form.Field>
                <Form.Field>
                    <label>
                        Storage capacity
                    </label>
                    <Input
                        id="sf-storageCapacity"
                        placeholder='What is the storage capacity?'
                        onChange={
                            this.handleChange.bind(this)
                        }
                        value={this.state.storageCapacity}/>
                </Form.Field>
                <Form.Field>
                    <label>
                        Battery capacity
                    </label>
                    <Input
                        id="sf-batteryCapacity"
                        placeholder='How is the battery capacity?'
                        onChange={
                            this.handleChange.bind(this)
                        }
                        value={this.state.batteryCapacity}/>
                </Form.Field>

                <Divider section/>

                <Header as='h3'>
                    Contacts
                </Header>
                <Form.Field>
                    <label>Owner</label>
                    <Humans
                        layout="dropdown"
                        selected={
                            this.state.owner
                        }
                        label="owner"
                        onSelected={(human) => {
                            this.setState({
                                owner: human.username
                            }, this._onChange.bind(this))
                        }}
                        value={this.state.owner}/>
                </Form.Field>
                <Form.Field>
                    <label>Operator</label>
                    <Humans
                        layout="dropdown"
                        selected={
                            this.state.operator
                        }
                        onSelected={(human) => {
                            this.setState({
                                operator: human.username
                            }, this._onChange.bind(this))
                        }}
                        value={this.state.operator}/>
                </Form.Field>
            </Form>
        )
    }
};

SensorFormMetadata.propTypes = {
    sensor: SensorPropTypes,
    onChange: PropTypes.func
}

export default SensorFormMetadata;
