import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
    fetchSensors
} from 'istsos3-core';

import SensorList from './list/sensorList';

class Sensors extends Component {

    componentDidMount() {
        const {
            fetchSensors,
            sensors
        } = this.props;
        if(sensors.data.length===0){
            fetchSensors();
        }
    }

    render() {
        const {
            layout,
            sensors,
            onSelected,
            activeItem
        } = this.props;
        if (layout==="list"){
            return(
                <SensorList
                    data={sensors.data}
                    activeItem={activeItem}
                    isFetching={sensors.isFetching}
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
        sensors: state.core_sensors,
        ...ownProps
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatch: dispatch,
        fetchSensors: () => {
            dispatch(fetchSensors());
        }
    }
};

Sensors.propTypes = {
    layout: PropTypes.string,
    sensors: PropTypes.object
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Sensors);
