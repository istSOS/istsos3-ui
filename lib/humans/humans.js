import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {
    fetchHumans
} from 'istsos3-core';

import HumanDropdown from './humansDropdown';

class Humans extends React.Component {

    componentDidMount() {
        const {
            fetchHumans,
            humans
        } = this.props;
        if(humans.data.length===0){
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

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Humans));
