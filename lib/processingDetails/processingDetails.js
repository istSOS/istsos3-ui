import React from 'react';
import { connect } from 'react-redux';

import {
    fetchProcessingDetails
} from 'istsos3-core';

import ProcessingDetailsDropdown from './processingDetailsDropdown';

class ProcessingDetails extends React.Component {
    componentDidMount() {
        const {
            processings,
            fetchProcessingDetails
        } = this.props;
        if(processings.data.length===0){
            fetchProcessingDetails();
        }
    }
    render() {
        const {
            processings,
            onSelected,
            selected
        } = this.props;
        return(
            <ProcessingDetailsDropdown
                data={processings.data}
                selected={selected}
                onSelected={onSelected}/>
        );
    }
};

const mapStateToProps = (state, ownProps) => {
    return {
        processings: state.core_processing_details,
        ...ownProps
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatch: dispatch,
        fetchProcessingDetails: () => {
            dispatch(fetchProcessingDetails());
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProcessingDetails);
