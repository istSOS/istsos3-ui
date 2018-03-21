import React from 'react';
import { connect } from 'react-redux';

import {
    fetchUoms
} from 'istsos3-core';

import ListUoms from './listUoms';

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
            onSelected
        } = this.props;
        if (layout==='list'){
            return(
                <ListUoms
                    uoms={uoms.data}
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
