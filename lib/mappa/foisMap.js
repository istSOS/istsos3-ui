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
            fois
        } = this.props;
        if(fois.data.length===0){
            dispatch(fetchFois());
        }
    }

    render() {
        return(
            <Mappa
                {
                    ...this.props
                }
                fois={this.props.fois.data}/>
        );
    }
};

const mapStateToProps = (state, ownProps) => {
    return {
        layout: null,
        fois: state.core_fois,
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
