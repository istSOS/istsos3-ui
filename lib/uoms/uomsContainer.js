import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {
    fetchUoms
} from 'istsos3-core';

import {
    selected
} from './uomsAction';

import UomsComponent from './uomsComponent';

class Uoms extends Component {
    componentDidMount() {
        const {
            dispatch
        } = this.props;
        dispatch(fetchUoms());
    }
    render() {
        return(
            <UomsComponent
                {...this.props}/>
        );
    }
};

const mapStateToProps = (state, ownProps) => {
    return {
        uoms: state.uoms,
        ...ownProps
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatch: dispatch,
        selected: (uom) => {
            dispatch(selected(uom));
        }
    }
};

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Uoms));
