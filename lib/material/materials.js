import React from 'react';
import { connect } from 'react-redux';

import {
    fetchMaterials
} from 'istsos3-core';

import MaterialsDropdown from './materialsDropdown';

class Materials extends React.Component {

    constructor(props) {
        super(props);
        const {
            fetchMaterials,
            materials
        } = props;
        if(
            materials.data.length===0
            && materials.isFetching === false){
            fetchMaterials();
        }
    }

    render() {
        return(
            <MaterialsDropdown
                materials={this.props.materials.data}
                selected={this.props.selected}
                onSelected={this.props.onSelected}/>
        );
    }
};

const mapStateToProps = (state, ownProps) => {
    return {
        materials: state.core_materials,
        selected: null,
        ...ownProps
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatch: dispatch,
        fetchMaterials: () => {
            dispatch(fetchMaterials());
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Materials);
