import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    fetchUoms,
    fetchObservableProperties,
    checkSensorName
} from 'istsos3-core';

import SensorFormMetadata from './sensorFormMetadata';
import SensorFormObsProp from './sensorFormObsProp';

class SensorForm extends Component {
    /*componentDidMount() {
        const {
            dispatch,
            uoms,
            observed_properties,
            layout
        } = this.props;
        if(layout==="observedproperties"){
            if(uoms.data.length===0){
                dispatch(fetchUoms());
            }
            if(observed_properties.data.length===0){
                dispatch(fetchObservableProperties());
            }
        }
    }*/
    render() {
        const {
            layout
        } = this.props;
        if (layout==="metadata"){
            return(
                <SensorFormMetadata
                    {...this.props}/>
            );
        }else if(layout==="observedproperties"){
            return(
                <SensorFormObsProp
                    {...this.props}/>
            );
        }
    }
};

const mapStateToProps = (state, ownProps) => {
    return {
        layout: 'metadata',
        uoms: state.core_uoms,
        observation_types: state.core_observationtypes,
        observed_properties: state.core_observed_properties,
        ...ownProps
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatch: dispatch,
        checkSensorName: (text, onSuccess) => {
            dispatch(
                checkSensorName(text, undefined, onSuccess))
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SensorForm);
