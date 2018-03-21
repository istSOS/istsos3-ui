import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    fetchSamplingTypes
} from 'istsos3-core';

import SamplingTypesDropdown from './samplingTypesDropdown';

class SamplingTypes extends Component {

    componentDidMount() {
        const {
            samplingtypes,
            fetchSamplingTypes
        } = this.props;
        if(samplingtypes.data.length===0){
            fetchSamplingTypes();
        }
    }

    render() {
        const {
            onSelected,
            samplingtypes,
            activeItem,
            disabled
        } = this.props;
        return(
            <SamplingTypesDropdown
                samplingtypes={samplingtypes.data}
                activeItem={activeItem}
                disabled={disabled}
                onSelected={onSelected}/>
        );
    }
};

const mapStateToProps = (state, ownProps) => {
    return {
        samplingtypes: state.core_samplingtypes,
        activeItem: null,
        disabled: false,
        ...ownProps
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatch: dispatch,
        fetchSamplingTypes: () => {
            dispatch(fetchSamplingTypes());
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SamplingTypes);
