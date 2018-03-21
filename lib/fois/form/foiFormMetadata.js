import React from 'react';
import PropTypes from 'prop-types';

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
            foiType
        } = this.props;

        this.checkname = false;
        this.checkidentifier = false;

        this.handleChange = this.handleChange.bind(this);
        this.samplingTypeSeleced = this.samplingTypeSeleced.bind(this);
        this._onChange = this._onChange.bind(this);

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

            ...this.foi2state()
        };
        this._onChange();
    }

    componentWillReceiveProps(nextProps){
        if(this.props.foiType !== nextProps.foiType){
            this.setState({
                type: nextProps.foiType || null
            }, this._onChange)
        }
    }

    componentDidMount(){
        if(this.state.name != ''){
            this.handleChange({
                target: {
                    id: "foiFormName",
                    value: this.state.name
                }
            });
        }
        if(this.state.identifier != ''){
            this.handleChange({
                target: {
                    id: "foiFormIdentifier",
                    value: this.state.identifier
                }
            });
        }
    }

    _onChange(){
        const {
            onChange
        } = this.props;
        if(onChange!==undefined){
            const {
                name,
                identifier,
                description,
                type,
                point
            } = this.state;

            let shape, shapeValid = false;

            if(type){
                shape = {
                    type: setting._SAMPLING_TYPES[type].name
                }
                switch (type) {
                    case setting._SAMPLING_POINT:
                        const {
                            pointXValid,
                            pointYValid,
                            pointZValid
                        } = this.state;
                        shape.coordinates = [
                            point.x !== ''? parseFloat(point.x): 0,
                            point.y !== ''? parseFloat(point.y): 0,
                            point.z !== ''? parseFloat(point.z): 0
                        ];
                        shapeValid = pointXValid && pointYValid && pointZValid;
                        break;
                    default:
                }
            }

            onChange(
                {
                    name: name,
                    identifier: identifier,
                    description: description,
                    type: type,
                    shape: shape
                },
                (
                    this.state.nameValid
                    && this.state.identifierValid
                    && shapeValid
                    && type !== null
                )
            )
        }
    }

    foi2state(){
        const {
            foi
        } = this.props;
        let data = {};
        if (foi){
            data = {
                name: foi.name,
                identifier: foi.identifier,
                description: foi.description,
                type: foi.type
            };
        }
        return data;
    }

    handleChange(event) {
        const {
            checkFoiName,
            checkFoiIdentifier
        } = this.props;
        switch (event.target.id) {
            case "foiFormName":
                let fn = event.target.value; //.replace(/[^\w\s]/gi, '');
                this.setState({
                    valid: false,
                    nameValid: false,
                    validatingName: fn.length>0,
                    name: fn
                }, this._onChange);
                if(checkFoiName!==undefined){
                    if(this.checkname){
                        clearTimeout(this.checkname);
                        this.checkname = false;
                    }
                    if(fn.length > 0){
                        this.checkname = setTimeout(function(){
                            if(this.state.name.length > 0){
                                checkFoiName(
                                    this.state.name,
                                    function(dispatch, json){
                                        this.setState({
                                            validatingName: false,
                                            nameValid: !json.data.exists,
                                            nameValidated: true
                                        }, this._onChange.bind(this));
                                    }.bind(this)
                                );
                            }
                        }.bind(this), 1000);
                    }
                }
                break;
            case "foiFormIdentifier":
                let fi = event.target.value.replace(/[^\w]/gi, '');
                this.setState({
                    valid: false,
                    identifierValid: false,
                    validatingIdentifier: fi.length>0,
                    identifier: fi
                }, this._onChange);
                if(checkFoiIdentifier!==undefined){
                    if(this.checkidentifier){
                        clearTimeout(this.checkidentifier);
                        this.checkidentifier = false;
                    }
                    if(fi.length > 0){
                        this.checkidentifier = setTimeout(function(){
                            if(this.state.identifier.length > 0){
                                checkFoiIdentifier(
                                    this.state.identifier,
                                    function(dispatch, json){
                                        this.setState({
                                            validatingIdentifier: false,
                                            identifierValid: !json.data.exists,
                                            identifierValidated: true
                                        }, this._onChange.bind(this));
                                    }.bind(this)
                                );
                            }
                        }.bind(this), 1000);
                    }
                }
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
        this.setState({
            type: selected.definition
        }, this._onChange.bind(this));
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
                        //<Form.Group widths='equal'>
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
                        // </Form.Group>
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
            foiType
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
                            nameValidated === true && nameValid === true?
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
                    {
                        foiType?
                        <div>
                            {foiType}
                        </div>:
                        <SamplingTypes
                            layout='dropdown'
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

FoiFormMetadata.propTypes = {
    foi: FoiPropTypes,
    foiType: PropTypes.string,
    onChange: PropTypes.func,
    checkFoiName: PropTypes.func,
    checkFoiIdentifier: PropTypes.func
}

export default FoiFormMetadata;
