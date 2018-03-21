import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
    fetchObservationTypes
} from 'istsos3-core';

import ListObType from './listObTyp';

class ObservationTypes extends Component {

    constructor(props) {
        super(props);
        const {
            fetchObservationTypes,
            observation_types
        } = props;
        if(
            observation_types.data.length===0
            && observation_types.isFetching === false){
            fetchObservationTypes();
        }
    }

    // componentDidMount() {
    //     const {
    //         fetchObservationTypes,
    //         observation_types
    //     } = this.props;
    //     if(observation_types.data.length===0){
    //         fetchObservationTypes();
    //     }
    // }

    render() {
        const {
            layout,
            observation_types,
            onSelected
        } = this.props;
        if (layout==="list"){
            return(
                <ListObType
                    observation_types={observation_types.data}
                    onSelected={onSelected}/>
            );
        }else{
            return(
                <div>
                    layout unknown
                </div>
            );
        }
    }
};

const mapStateToProps = (state, ownProps) => {
    return {
        layout: null,
        observation_types: state.core_observationtypes,
        ...ownProps
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatch: dispatch,
        fetchObservationTypes: () => {
            dispatch(fetchObservationTypes());
        }
    }
};

ObservationTypes.propTypes = {
    layout: PropTypes.string
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ObservationTypes);
