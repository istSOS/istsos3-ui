import React from 'react';
import { connect } from 'react-redux';

import {
    fetchHumans
} from 'istsos3-core';

import HumanDropdown from './humansDropdown';

class Humans extends React.Component {

    constructor(props) {
        super(props);
        const {
            fetchHumans,
            humans
        } = props;
        if(
            humans.data.length===0
            && humans.isFetching === false){
            fetchHumans();
        }
    }

    render() {
        const {
            layout
        } = this.props;
        if (layout==="dropdown"){
            return(
                <HumanDropdown
                    humans={this.props.humans.data}
                    selected={this.props.selected}
                    onSelected={this.props.onSelected}/>
            );
        }else if(layout==="cards"){
            return(
                <HumanDropdown
                    humans={this.props.humans.data}
                    selected={this.props.selected}
                    onSelected={this.props.onSelected}/>
            );
        }
    }
};

const mapStateToProps = (state, ownProps) => {
    return {
        humans: state.core_humans,
        layout: 'dropdown',
        selected: null,
        ...ownProps
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatch: dispatch,
        fetchHumans: () => {
            dispatch(fetchHumans());
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Humans);
