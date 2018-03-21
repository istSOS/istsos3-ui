import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    checkFoiName,
    checkFoiIdentifier
} from 'istsos3-core';

import FoiFormMetadata from './foiFormMetadata';

class FoiForm extends Component {
    render() {
        return (
            <FoiFormMetadata
                {...this.props}/>
        )
    }
};

const mapStateToProps = (state, ownProps) => {
    return {
        foiType: null,
        ...ownProps,
        hide: {
            name: false,
            identifier: false,
            description: false,
            type: false,
            coordinates: false,
            ...ownProps.hide
        }
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatch: dispatch,
        checkFoiName: (name, onSuccess) => {
            dispatch(checkFoiName(name, undefined, onSuccess));
        },
        checkFoiIdentifier: (identifier, onSuccess) => {
            dispatch(checkFoiIdentifier(identifier, undefined, onSuccess));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FoiForm);
