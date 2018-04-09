import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash'

import Materials from '../../material/materials';
import DateInput from '../../date/dateInput';
import SamplingMethod from '../../samplingMethod/samplingMethod';
import Uoms from '../../uoms/uomsContainer';

import {
    SpecimenPropTypes
} from 'istsos3-core';

import {
    Form,
    Input,
    TextArea,
    Popup
} from 'semantic-ui-react';

class SpecimenFormMetadata extends React.Component {

    constructor(props) {
        super(props);
        this.checkidentifier = false;

        this.handleChange = this.handleChange.bind(this);
        this.dateChange = this.dateChange.bind(this);
        this.setMaterial = this.setMaterial.bind(this);
        this.setMethod = this.setMethod.bind(this);
        this.setUom = this.setUom.bind(this);
        this.state = {
            valid: false,
            hidden: [],

            // Identifier validation
            validatingIdentifier: false,
            identifierValid: false,
            identifierValidated: false,

            // Sampling Time validation
            samplingTimeValid: false,

            // Metadata
            identifier: "",
            name: "",
            description: "",
            sampledFeature: "",
            materialClass: null,
            time: "",
            date: "",
            samplingTime: {
                timeInstant: {
                    instant: null
                }
            },
            samplingMethod: null,
            //samplingLocation: "",
            processingDetails: [],
            size: {
                value: 0,
                uom: ""
            },
            currentLocation: "",
            specimenType: "",
            ...this.specimen2state()
        }
    }

    componentDidMount(){
        // If the specimen identifier is given throught props,
        // the check is done.
        if(this.state.identifier != ''){
            let identifier = this.state.identifier.replace(/[^\w-]/gi, '');
            this.setState({
                valid: false,
                identifierValid: false,
                validatingIdentifier: identifier.length>0,
                identifier: identifier
            }, ()=>{
                // Notify changes
                this._onChange();
                // Server side validation
                this.validateIdentifier(identifier);
            });
        }
    }

    specimen2state(){
        const {
            specimen
        } = this.props;
        let data = {};
        if (specimen){
            data = {
                identifier: specimen.identifier || '',
                name: specimen.name || '',
                description: specimen.description || '',
                samplingMethod: specimen.samplingMethod || '',
                size: {
                    value: 0,
                    uom: ''
                }
            };
            if(_.has(specimen, 'specimenType.href')){
                data.specimenType = specimen.specimenType.href;
            }
            if(_.has(specimen, 'currentLocation.href')){
                data.currentLocation = specimen.currentLocation.href;
            }
            if(_.has(specimen, 'sampledFeature.href')){
                data.sampledFeature = specimen.sampledFeature.href;
            }
            if(_.has(specimen, 'materialClass.href')){
                data.materialClass = specimen.materialClass.href;
            }
            if(_.has(specimen, 'samplingTime.timeInstant.instant')){
                let dt = moment(specimen.samplingTime.timeInstant.instant);
                if(dt.isValid()){
                    data.date = dt.format("YYYY-MM-DD");
                    data.time = dt.format("HH:mm:ss");
                }
            }
            if(_.has(specimen, 'size.value')){
                data.size.value = _.toNumber(specimen.size.value);
            }
            if(_.has(specimen, 'size.uom')){
                data.size.uom = specimen.size.uom;
            }
        }
        return data;
    }

    setMaterial(material){
        this.setState({
            materialClass: material.definition
        }, this._onChange);
    }

    setMethod(method){
        this.setState({
            samplingMethod: method.identifier
        }, this._onChange);
    }

    setUom(uom){
        this.setState({
            size: {
                ...this.state.size,
                uom: uom.name
            }
        }, this._onChange);
    }

    dateChange(date){
        let timeInstant = {
            instant: date + "T" + this.state.time + "+00:00"
        }
        this.setState({
            date: date,
            samplingTime: {
                ...timeInstant
            },
            samplingTimeValid: moment(
                timeInstant.instant,
                moment.ISO_8601
            ).isValid()
        }, this._onChange);
    }

    /*
        Server side validation of the sensor name
    */
    validateIdentifier(identifier){
        const {
            checkSpecimenIdentifier
        } = this.props;
        if(checkSpecimenIdentifier!==undefined){
            if(this.checkidentifier){
                clearTimeout(this.checkidentifier);
                this.checkidentifier = false;
            }
            if(identifier.length > 0){
                this.checkidentifier = setTimeout(function(){
                    if(this.state.identifier.length > 0){
                        checkSpecimenIdentifier(
                            this.state.identifier,
                            function(dispatch, json){
                                this.setState({
                                    validatingIdentifier: false,
                                    identifierValid: !json.data.exists,
                                    identifierValidated: true
                                }, this._onChange);
                            }.bind(this)
                        );
                    }
                }.bind(this), 1000);
            }
        }
    }

    _onChange() {
        // state to specimen
        const {
            onChange,
            hidden
        } = this.props;
        if(onChange!==undefined){
            let data = {
                identifier: this.state.identifier,
                name: this.state.name,
                description: this.state.description,
                samplingMethod: this.state.samplingMethod,
                size: {
                    ...this.state.size
                },
                currentLocation: {
                    href: this.state.currentLocation
                },
                specimenType: {
                    href: this.state.specimenType
                },
                sampledFeature: {
                    href: this.state.sampledFeature
                },
                materialClass: {
                    href: this.state.materialClass
                },
                ...(
                    hidden.indexOf('time')==-1?
                    {
                        samplingTime: {
                            ...this.state.samplingTime
                        }
                    }: null
                )
            };
            onChange(
                data,
                this.state.identifierValid
                && (
                    this.state.samplingTimeValid
                    || hidden.indexOf('time')>-1
                )
                && !_.isNull(this.state.materialClass)
                && _.isNumber(this.state.size.value)
                && this.state.size.uom !== ''
            );
        }
    }

    handleChange(event){
        switch (event.target.id) {
            case "specimenIdentifier":
                let identifier = event.target.value.replace(/[^\w-]/gi, '');
                this.setState({
                    valid: false,
                    identifierValid: false,
                    validatingIdentifier: identifier.length>0,
                    identifier: identifier
                }, ()=>{
                    // Notify changes
                    this._onChange();
                    // Server side validation
                    this.validateIdentifier(identifier);
                });
                break;
            case "specimenName":
                this.setState({
                    name: event.target.value
                }, this._onChange);
                break;
            case "specimenDescription":
                this.setState({
                    description: event.target.value
                }, this._onChange);
                break;
            case "specimenSize":
                this.setState({
                    size: {
                        ...this.state.size,
                        value: _.toNumber(event.target.value)
                    }
                }, this._onChange);
                break;
            case "specimenTimeT":
                let t = event.target.value.replace(/[^0-9:]/gi, '');
                let timeInstant = {
                    instant: this.state.date + "T" + t + "+00:00"
                }
                this.setState({
                    time: t,
                    samplingTime: {
                        ...timeInstant
                    },
                    samplingTimeValid: moment(
                        timeInstant.instant,
                        moment.ISO_8601
                    ).isValid()
                }, this._onChange);
                break;
            case "specimenCurrentLocation":
                this.setState({
                    currentLocation: event.target.value
                }, this._onChange);
                break;
            case "specimenSpecimenType":
                this.setState({
                    specimenType: event.target.value
                }, this._onChange);
                break;
            default:
        }
    }

    render() {
        const {
            hidden
        } = this.props, {
            validatingIdentifier,
            identifierValid,
            identifierValidated,
            samplingTimeValid,

            // Metadata
            materialClass,
            identifier,
            name,
            description,
            time,
            date,
            size,
            samplingMethod,
            currentLocation,
            specimenType
        } = this.state;
        return (
            <Form>
                <Form.Field required>
                    <label>Material</label>
                    <Materials
                        onSelected={this.setMaterial}
                        selected={materialClass}/>
                </Form.Field>
                <Form.Field required>
                    <label>Identifier</label>
                    <Input
                        id="specimenIdentifier"
                        iconPosition='left'
                        icon={
                            identifierValidated === true
                                && identifierValid === true?
                            'check': 'delete'
                        }
                        loading={validatingIdentifier}
                        placeholder='Assign a unique identifier to this specimen'
                        onChange={this.handleChange}
                        value={identifier}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"/>
                </Form.Field>
                <Form.Field>
                    <label>Name</label>
                    <Input
                        id="specimenName"
                        placeholder='Give this specimen a name or label'
                        onChange={this.handleChange}
                        value={name}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"/>
                </Form.Field>
                <Form.Field>
                    <label>
                        Description
                    </label>
                    <TextArea
                        id="specimenDescription"
                        rows="3"
                        placeholder="Add a description"
                        onChange={this.handleChange}
                        value={description}/>
                </Form.Field>
                {
                    hidden.indexOf('time')===-1?
                    <Form.Group widths='equal'>
                        <Form.Field
                            error={!samplingTimeValid}>
                            <label>Sampling date (YYYY-MM-DD)</label>
                            <DateInput
                                value={date}
                                onChange={this.dateChange}/>
                        </Form.Field>
                        <Form.Field
                            error={!samplingTimeValid}>
                            <label>
                                Time (HH:MM:SS)
                            }</label>
                            <Input
                                icon='time'
                                iconPosition='left'
                                id="specimenTimeT"
                                placeholder='HH:MM:SS'
                                onChange={this.handleChange}
                                value={time}
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck="false"/>
                        </Form.Field>
                    </Form.Group>: null
                }
                <Form.Field>
                    <label>
                        Sampling method
                    </label>
                    <SamplingMethod
                        onSelected={this.setMethod}
                        selected={samplingMethod}/>
                </Form.Field>
                <Form.Group widths='equal'>
                    <Form.Field required>
                        <label>
                            Size
                        </label>
                        <Input
                            icon='expand'
                            iconPosition='left'
                            id="specimenSize"
                            placeholder=''
                            type='number'
                            onChange={this.handleChange}
                            value={size.value}
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"/>
                    </Form.Field>
                    <Form.Field required>
                        <label>
                            Unit of measure
                        </label>
                        <Uoms
                            selected={this.state.size.uom}
                            onSelected={this.setUom}/>
                    </Form.Field>
                </Form.Group>


                <Form.Field>
                    <label>Current location</label>
                    <Input
                        icon='archive'
                        iconPosition='left'
                        id="specimenCurrentLocation"
                        placeholder={
                            "Describe the location of a physical specimen " +
                            "(a shelf in a warehouse, a drawer in a museum)"
                        }
                        onChange={this.handleChange}
                        value={currentLocation}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"/>
                </Form.Field>

                <Form.Field>
                    <label>Form of the specimen</label>
                    <Input
                        icon='cube'
                        iconPosition='left'
                        id="specimenSpecimenType"
                        placeholder={
                            "Describe the basic form of the specimen " +
                            "(polished section, core, pulp, solution)"
                        }
                        onChange={this.handleChange}
                        value={specimenType}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"/>
                </Form.Field>
            </Form>
        )
    }

};

SpecimenFormMetadata.defaultProps = {
    hidden: []
};

SpecimenFormMetadata.propTypes = {
    specimen: SpecimenPropTypes,
    hidden: PropTypes.arrayOf(PropTypes.string),
}

export default SpecimenFormMetadata;
