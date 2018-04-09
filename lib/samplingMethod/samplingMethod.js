import React from 'react';
import { connect } from 'react-redux';

import {
    fetchSamplingMethods
} from 'istsos3-core';

import SamplingMethodDropdown from './samplingMethodDropdown';

class SamplingMethod extends React.Component {

    constructor(props) {
        super(props);
        const {
            fetchSamplingMethods,
            methods
        } = props;
        if(
            methods.data.length===0
            && methods.isFetching === false){
            fetchSamplingMethods();
        }
    }

    render() {
        const {
            layout
        } = this.props;
        return(
            <SamplingMethodDropdown
                data={this.props.methods.data}
                selected={this.props.selected}
                onSelected={this.props.onSelected}/>
        );
    }
};

const mapStateToProps = (state, ownProps) => {
    return {
        methods: state.core_sampling_methods,
        layout: 'dropdown',
        selected: null,
        ...ownProps
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatch: dispatch,
        fetchSamplingMethods: () => {
            dispatch(fetchSamplingMethods());
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SamplingMethod);
