import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
    fetchObservableProperties
} from 'istsos3-core';

import ListObsProps from './listObsProps';
import DropdownObsProp from './dropdownObsProp';
import SelectObsProp from './selectObsProp';

class ObservedProperties extends React.Component {

    componentDidMount() {
        const {
            fetchObservableProperties,
            observed_properties
        } = this.props;
        console.log(observed_properties.data.length===0, observed_properties.isFetching===false);
        if(
            observed_properties.data.length===0
            && observed_properties.isFetching===false
        ){
            fetchObservableProperties();
        }
        console.log(observed_properties);
    }

    render() {
        const {
            layout,
            observed_properties,
            onSelected
        } = this.props;
        if (layout==='list'){
            return(
                <ListObsProps
                    observed_properties={observed_properties.data}
                    onSelected={onSelected}/>
            );
        }else if (layout==='dropdown'){
            return(
                <SelectObsProp
                    observed_properties={observed_properties.data}
                    onSelected={onSelected}/>
            );
        }else if (layout==='mdropdown'){
            return(
                <DropdownObsProp
                    observed_properties={observed_properties.data}
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
        observed_properties: state.core_observed_properties,
        ...ownProps
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatch: dispatch,
        fetchObservableProperties: () => {
            dispatch(fetchObservableProperties());
        }
    }
};

ObservedProperties.propTypes = {
    layout: PropTypes.string
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ObservedProperties);
