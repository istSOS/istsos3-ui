import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash'

import {
    FoiPropTypes,
    setting
} from 'istsos3-core';

import SamplingTypes from '../../samplingTypes/samplingTypes';

// Semantic UI components
import {
    Form,
    Header,
    Input,
    Divider,
    TextArea,
    Label,
    Icon
} from 'semantic-ui-react';

const color = "black";

class FoiFormMetadata extends React.Component {

    constructor(props) {
        super(props);

        const {
            foiType,
            foi
        } = this.props;

        this.checkname = false;
        this.checkidentifier = false;

        this.handleChange = this.handleChange.bind(this);
        this.samplingTypeSeleced = this.samplingTypeSeleced.bind(this);
        this._onChange = this._onChange.bind(this);
        this.validateName = this.validateName.bind(this);
        this.validateIdentifier = this.validateIdentifier.bind(this);

        this.state = {
            isFetching: false,
            validMeta: false,
            valid: false,

            // Name server side validation
            nameValid: false,
            validatingName: false,
            nameValidated: false,

            // Identifier server side validation
            identifierValid: false,
            validatingIdentifier: false,
            identifierValidated: false,

            description: "",
            identifier: "",
            name: "",
            type: foiType || null,

            point: {
                x: '',
                y: '',
                z: ''
            },
            pointXValid: false,
            pointYValid: false,
            pointZValid: false,

            ...this.foi2state(foi)
        };
        // this._onChange();
    }

    foi2state(foi){
        let data = {};
        if (foi){
            data = {
                name: foi.name || '',
                identifier: foi.identifier || '',
                description: foi.description || '',
                type: foi.type || '',
                pointXValid: false,
                pointYValid: false,
                pointZValid: false
            };
            if(_.has(foi, 'shape.coordinates')){
                switch (foi.type) {
                    case setting._SAMPLING_POINT:
                        if(foi.shape.coordinates.length===3){
                            data.point = {
                                x: foi.shape.coordinates[0],
                                y: foi.shape.coordinates[1],
                                z: foi.shape.coordinates[2]
                            };
                        }else if (foi.shape.coordinates.length===2) {
                                data.point = {
                                    x: foi.shape.coordinates[0],
                                    y: foi.shape.coordinates[1],
                                    z: 0
                                };
                        }
                        data = {
                            ...data,
                            pointXValid: !isNaN(parseFloat(data.point.x)),
                            pointYValid: !isNaN(parseFloat(data.point.y)),
                            pointZValid: !isNaN(parseFloat(data.point.z))
                        }
                        break;
                    default:

                }
            }
        }
        return data;
    }

    componentDidMount(){
        // validation of incoming props after initial render
        if(this.state.name != ''){
            this.validateName(this.state.name);
        }
        if(this.state.identifier != ''){
            this.validateIdentifier(this.state.identifier);
        }
    }

    componentWillReceiveProps(nextProps){
        // Check changes in props
        let data = null;
        if(this.props.foiType !== nextProps.foiType){
            data = data || {
                type: nextProps.foiType || null
            };
        }
        if(
            _.isObject(nextProps.foi)
            && !_.isEqual(this.props.foi, nextProps.foi)
        ){
            data = data || {
                ...data,
                ...this.foi2state(nextProps.foi)
            }
            if(
                _.has(nextProps.foi, 'name')
                && nextProps.foi.name != this.state.name
            ){
                data = {
                    ...data,
                    valid: false,
                    nameValid: false,
                    validatingName: nextProps.foi.name.length>0
                }
            }
            if(
                _.has(nextProps.foi, 'identifier')
                && nextProps.foi.identifier != this.state.identifier
            ){
                data = {
                    ...data,
                    valid: false,
                    identifierValid: false,
                    validatingIdentifier: nextProps.foi.identifier.length>0,
                }
            }
        }
        if(data !== null){
            this.setState({
                ...this.state,
                ...data
            }, ()=>{
                this._onChange();
                if(
                    _.has(nextProps.foi, 'name')
                    && nextProps.foi.name != this.state.name
                ){
                    this.validateName(this.state.name);
                }
                if(
                    _.has(nextProps.foi, 'identifier')
                    && nextProps.foi.identifier != this.state.identifier
                ){
                    this.validateIdentifier(this.state.identifier);
                }
            });
        }
    }

    _onChange(){
        const {
            onChange
        } = this.props;
        if(_.isFunction(onChange)){
            const {
                name,
                identifier,
                description,
                type,
                point
            } = this.state;
            let shape, coordinates, shapeValid = false;
            if(type){
                switch (type) {
                    case setting._SAMPLING_POINT:
                        const {
                            pointXValid,
                            pointYValid,
                            pointZValid
                        } = this.state;
                        if(
                            point.x !== ''
                            && point.y !== ''
                            && point.z !== ''
                        ){
                            coordinates = [
                                parseFloat(point.x),
                                parseFloat(point.y),
                                parseFloat(point.z)
                            ];
                            shapeValid = pointXValid
                                && pointYValid && pointZValid;
                        }
                        break;
                    default:
                }
                if(coordinates !== undefined){
                    shape = {
                        type: setting._SAMPLING_TYPES[type].name,
                        coordinates: coordinates
                    }
                }
            }
            const foi = {
                name: name,
                identifier: identifier,
                description: description,
                type: type,
                shape: shape
            };
            onChange(
                foi, (
                    this.state.nameValid
                    && this.state.identifierValid
                    && shapeValid
                    && type !== null
                )
            );
        }
    }

    /*
        Server side validation of the sensor name
    */
    validateName(name){
        const {
            checkFoiName
        } = this.props;
        if(checkFoiName!==undefined){
            if(this.checkname){
                clearTimeout(this.checkname);
                this.checkname = false;
            }
            if(name.length > 0){
                this.checkname = setTimeout(function(){
                    if(this.state.name.length > 0){
                        checkFoiName(
                            this.state.name,
                            function(dispatch, json){
                                this.setState({
                                    validatingName: false,
                                    nameValid: !json.data.exists,
                                    nameValidated: true
                                }, this._onChange);
                            }.bind(this)
                        );
                    }
                }.bind(this), 1000);
            }
        }
    }

    /*
        Server side validation of the sensor name
    */
    validateIdentifier(identifier){
        const {
            checkFoiIdentifier
        } = this.props;
        if(checkFoiIdentifier!==undefined){
            if(this.checkidentifier){
                clearTimeout(this.checkidentifier);
                this.checkidentifier = false;
            }
            if(identifier.length > 0){
                this.checkidentifier = setTimeout(function(){
                    if(this.state.identifier.length > 0){
                        checkFoiIdentifier(
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

    /*
        Handle form input changes
    */
    handleChange(event) {
        switch (event.target.id) {
            case "foiFormName":
                let fn = event.target.value;
                this.setState({
                    valid: false,
                    nameValid: false,
                    validatingName: fn.length>0,
                    name: fn
                }, ()=>{
                    // Notify changes
                    this._onChange();
                    // Server side validation
                    this.validateName(fn);
                });
                break;
            case "foiFormIdentifier":
                let fi = event.target.value.replace(/[^\w]/gi, '');
                this.setState({
                    valid: false,
                    identifierValid: false,
                    validatingIdentifier: fi.length>0,
                    identifier: fi
                }, ()=>{
                    // Notify changes
                    this._onChange();
                    // Server side validation
                    this.validateIdentifier(fi);
                });
                break;
            case "foiFormDescription":
                this.setState({
                    description: event.target.value
                }, this._onChange.bind(this));
                break;
            case "foiFormPointX":
                this.setState({
                    point: {
                        ...this.state.point,
                        x: event.target.value
                    },
                    pointXValid: !isNaN(parseFloat(event.target.value))
                }, this._onChange.bind(this));
                break;
            case "foiFormPointY":
                this.setState({
                    point: {
                        ...this.state.point,
                        y: event.target.value
                    },
                    pointYValid: !isNaN(parseFloat(event.target.value))
                }, this._onChange.bind(this));
                break;
            case "foiFormPointZ":
                this.setState({
                    point: {
                        ...this.state.point,
                        z: event.target.value
                    },
                    pointZValid: !isNaN(parseFloat(event.target.value))
                }, this._onChange.bind(this));
                break;
            default:
        }
    }

    samplingTypeSeleced(selected){
        const {
            typeChanged
        } = this.props;
        this.setState({
            type: selected.definition
        }, this._onChange.bind(this));
        if(typeChanged!==undefined){
            typeChanged(selected);
        }
    }

    getGeoField() {
        const {
            type
        } = this.state;

        let geom = (
            <div>
                Geometry type unknown
            </div>
        );
        if(type !== undefined){
            switch (type) {
                case setting._SAMPLING_POINT:
                    const {
                        point,
                        pointXValid,
                        pointYValid,
                        pointZValid
                    } = this.state;
                    geom = (
                        [
                            <Form.Field required key="istsos3-ui-ffm-p1">
                                <label
                                    color={color}
                                    pointing='below'>X</label>
                                <Input
                                    id="foiFormPointX"
                                    placeholder='X Coordinate'
                                    type="number"
                                    onChange={this.handleChange}
                                    value={point.x}
                                    error={pointXValid}/>
                            </Form.Field>,
                            <Form.Field required key="istsos3-ui-ffm-p2">
                                <label
                                    color={color}
                                    pointing='below'>Y</label>
                                <Input
                                    id="foiFormPointY"
                                    placeholder='Y Coordinate'
                                    type="number"
                                    onChange={this.handleChange}
                                    value={point.y}
                                    error={pointYValid}/>
                            </Form.Field>,
                            <Form.Field key="istsos3-ui-ffm-p3">
                                <label
                                    color={color}
                                    pointing='below'>Z</label>
                                <Input
                                    id="foiFormPointZ"
                                    placeholder='Z Coordinate'
                                    type="number"
                                    onChange={this.handleChange}
                                    value={point.z}
                                    error={pointZValid}/>
                            </Form.Field>
                        ]
                    );
                    break;
                default:
                    break;
            }
        }
        return geom;
    }

    render() {
        const {
            disableType
        } = this.props;

        const {
            nameValidated,
            nameValid,
            validatingName,
            identifierValidated,
            identifierValid,
            validatingIdentifier,
            identifier,
            name,
            description,
            type
        } = this.state;
        return (
            <Form>
                <Form.Field required>
                    <label
                        color='black'
                        pointing='below'>Name</label>
                    <Input
                        id="foiFormName"
                        iconPosition='left'
                        icon={
                            nameValidated === true
                            && nameValid === true?
                            'check': 'delete'
                        }
                        loading={validatingName}
                        placeholder='Label this feature of interest..'
                        onChange={this.handleChange}
                        value={name}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"/>
                </Form.Field>
                <Form.Field required>
                    <label
                        color={color}
                        pointing='below'>Identifier</label>
                    <Input
                        id="foiFormIdentifier"
                        iconPosition='left'
                        icon={
                            identifierValidated === true
                            && identifierValid === true?
                            'check': 'delete'
                        }
                        loading={validatingIdentifier}
                        placeholder='Assigns a unique identifier..'
                        onChange={this.handleChange}
                        value={identifier}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"/>
                </Form.Field>
                <Form.Field>
                    <label
                        color={color}
                        pointing='below'>
                        Description
                    </label>
                    <TextArea
                        id="foiFormDescription"
                        rows="3"
                        placeholder="Add a description"
                        onChange={this.handleChange}
                        value={description}/>
                </Form.Field>
                <Form.Field required>
                    <label
                        color={color}
                        pointing='below'>
                        Sampling Type
                    </label>
                    {
                        disableType?
                        <div>
                            {setting._SAMPLING_TYPES[type].name}
                        </div>:
                        <SamplingTypes
                            layout='dropdown'
                            selected={type}
                            onSelected={this.samplingTypeSeleced}/>
                    }
                </Form.Field>
                {
                    this.getGeoField()
                }
            </Form>
        )
    }

    _render() {
        const {
            create_foi,
            foiSamplingSelected,
            foiform,
            hide
        } = this.props;
        const {
            nameValidated,
            nameValid,
            validatingName,
            identifierValidated,
            identifierValid,
            validatingIdentifier,
            identifier,
            name,
            description,
            type
        } = this.state;

        let hideButton = false;
        if(this.props.hideButton===true){
            hideButton = true;
        }
        return (
            <Form>
                <Form.Field required>
                    <label
                        color={color}
                        pointing='below'>Identifier</label>
                    <Input
                        id="foiFormIdentifier"
                        iconPosition='left'
                        icon={
                            identifierValidated === true && identifierValid === true?
                            'check': 'delete'
                        }
                        loading={validatingIdentifier}
                        placeholder='Assigns a unique identifier..'
                        onChange={this.handleChange}
                        value={identifier}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"/>
                </Form.Field>
                <Form.Field>
                    <label
                        color={color}
                        pointing='below'>
                        Description
                    </label>
                    <TextArea
                        id="foiFormDescription"
                        rows="3"
                        placeholder="Add a description"
                        onChange={this.handleChange}
                        value={description}/>
                </Form.Field>
                <Form.Field required>
                    <label
                        color={color}
                        pointing='below'>
                        Sampling Type
                    </label>
                    <SamplingTypes
                        onSelected={foiSamplingSelected}
                        value={type}/>
                </Form.Field>
                {
                    this.getGeoField()
                }
            </Form>
        )
    }

};

FoiFormMetadata.defaultProps = {
    disableType: false
};

FoiFormMetadata.propTypes = {
    foi: FoiPropTypes,
    foiType: PropTypes.string,
    disableType: PropTypes.bool,
    onChange: PropTypes.func,
    typeChanged: PropTypes.func,
    checkFoiName: PropTypes.func,
    checkFoiIdentifier: PropTypes.func
}

export default FoiFormMetadata;
