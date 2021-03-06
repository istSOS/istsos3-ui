import React from 'react';
import { connect } from 'react-redux';

import {
    fetchUoms
} from 'istsos3-core';

import ListUoms from './listUoms';
import UomsDropdown from './uomsDropdown';

class Uoms extends React.Component {
    componentDidMount() {
        const {
            uoms,
            fetchUoms
        } = this.props;
        if(uoms.data.length===0){
            fetchUoms();
        }
    }
    render() {
        const {
            layout,
            uoms,
            onSelected,
            selected
        } = this.props;
        if (layout==='list'){
            return(
                <ListUoms
                    uoms={uoms.data}
                    onSelected={onSelected}/>
            );
        }else if(layout==='dropdown'){
            return(
                <UomsDropdown
                    data={uoms.data}
                    select={selected}
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
        uoms: state.core_uoms,
        layout: "dropdown",
        ...ownProps
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatch: dispatch,
        fetchUoms: () => {
            dispatch(fetchUoms());
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Uoms);
