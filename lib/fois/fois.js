import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
    fetchFois
} from 'istsos3-core';

import ListFois from './listFois';

class Fois extends Component {

    componentDidMount() {
        const {
            fetchFois,
            fois
        } = this.props;
        if(fois.data.length===0){
            fetchFois();
        }
    }

    render() {
        const {
            layout,
            fois,
            onSelected,
            filter,
            activeItem
        } = this.props;
        if (layout==="list"){
            return(
                <ListFois
                    fois={fois.data}
                    filter={filter}
                    activeItem={activeItem}
                    isFetching={fois.isFetching}
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
        fois: state.core_fois,
        ...ownProps
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatch: dispatch,
        fetchFois: () => {
            dispatch(fetchFois());
        }
    }
};

Fois.propTypes = {
    layout: PropTypes.string
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Fois);
