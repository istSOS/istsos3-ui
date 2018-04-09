import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    fetchFois
} from 'istsos3-core';

import Mappa from './mappa';

class FoisMap extends Component {

    componentDidMount() {
        const {
            dispatch,
            fois, isFetching
        } = this.props;
        if(
            fois.length===0
            && isFetching === false){
            dispatch(fetchFois());
        }
    }

    render() {
        return(
            <Mappa {...this.props}/>
        );
    }
};

const mapStateToProps = (state, ownProps) => {
    return {
        fois: state.core_fois.data,
        isFetching: state.core_fois.isFetching,
        ...ownProps
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatch: dispatch
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FoisMap);
