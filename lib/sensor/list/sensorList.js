import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import {
    setting,
    SensorPropTypes
} from 'istsos3-core';

// Semantic UI components
import {
    Table,
    Header,
    Message,
    Icon,
    List
} from 'semantic-ui-react'

class SensorList extends Component {

    constructor(props) {
        super(props);
        const {
            activeItem
        } = this.props;
        this.state = {
            activeItem: activeItem !== undefined? activeItem: null,
        };
    }

    handleClick(sensor) {
        const {
            onSelected,
            data
        } = this.props;
        this.setState({activeItem: sensor.name})
        if(onSelected!==undefined){
            onSelected(sensor);
        }
    }

    render() {
        const {
            data,
            isFetching,
            filter
        } = this.props, {
            activeItem
        } = this.state;

        if(isFetching === true){
            return (
                <div style={{
                        flex: "1 1 0%",
                        overflowY: 'auto'
                    }}>
                    <Message icon>
                        <Icon name='circle notched' loading />
                        <Message.Content>
                            <Message.Header>Just one second</Message.Header>
                            We are fetching that content for you.
                        </Message.Content>
                    </Message>
                </div>
            );
        }
        return (
            <div style={{
                    flex: "1 1 0%",
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                <Table fixed selectable basic='very' size='small' compact='very'>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Observed properties</Table.HeaderCell>
                        <Table.HeaderCell>Begin</Table.HeaderCell>
                        <Table.HeaderCell>End</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                </Table>
                <div style={{
                        flex: "1 1 0%",
                        overflowY: 'auto'
                    }}>
                    <Table fixed selectable basic='very' size='small' compact='very'>
                        <Table.Body>
                        {
                            data.map((sensor, idx) => (
                                <Table.Row
                                    active={activeItem === sensor.name}
                                    key={"istsos-ui-sli-"+idx}
                                    onClick={(e) => this.handleClick(sensor)}
                                    style={{cursor: "pointer"}}>
                                    <Table.Cell
                                        verticalAlign='top'>
                                        <div style={{
                                            fontWeight: "bold"
                                        }}>
                                            {sensor.name}
                                        </div>
                                        <div style={{
                                            color: "#787878",
                                            fontSize: "0.7em"
                                        }}>
                                            {
                                                setting._SAMPLING_TYPES[
                                                    sensor.foi_type
                                                ].name
                                            }
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell
                                        textAlign='left'>
                                        <List>
                                        {sensor.observable_properties.map((op, idx) => (
                                            op.type !== setting._COMPLEX_OBSERVATION?
                                            <List.Item key={"isc-srl-"+idx}>
                                                <List.Header>{op.name} ({op.uom})</List.Header>
                                                <span style={{
                                                    fontSize: "0.7em",
                                                    color: '#787878'
                                                }}>
                                                    {op.type.replace(setting._typedef, '')}
                                                </span>
                                            </List.Item>: null
                                        ))}
                                        </List>
                                    </Table.Cell>
                                    <Table.Cell
                                        verticalAlign='top'>
                                        {
                                            sensor.phenomenon_time !== null?
                                            <div>
                                                <div style={{
                                                    fontWeight: "bold"
                                                }}>
                                                    {
                                                        moment(
                                                            sensor.phenomenon_time.timePeriod.begin
                                                        ).format('DD.MM.YYYY H:m')
                                                    }
                                                </div>
                                                <div style={{
                                                    color: "#787878",
                                                    fontSize: "0.7em"
                                                }}>
                                                    {moment(
                                                        sensor.phenomenon_time.timePeriod.begin
                                                    ).fromNow()}
                                                </div>
                                            </div>: <span style={{
                                                    color: "#787878",
                                                    fontSize: "0.7em"
                                                }}>
                                                No data
                                            </span>
                                        }
                                    </Table.Cell>
                                    <Table.Cell
                                        verticalAlign='top'>
                                        {
                                            sensor.phenomenon_time !== null?
                                            <div>
                                                <div style={{
                                                    fontWeight: "bold"
                                                }}>
                                                    {
                                                        moment(
                                                            sensor.phenomenon_time.timePeriod.end
                                                        ).format('DD.MM.YYYY H:m')
                                                    }
                                                </div>
                                                <div style={{
                                                    color: "#787878",
                                                    fontSize: "0.7em"
                                                }}>
                                                    {
                                                        moment.duration(
                                                            moment(sensor.phenomenon_time.timePeriod.begin).diff(
                                                                moment(sensor.phenomenon_time.timePeriod.end)
                                                            )
                                                        ).humanize()
                                                    } of data, {moment(
                                                        sensor.phenomenon_time.timePeriod.end
                                                    ).fromNow()}
                                                </div>
                                            </div>: <span style={{
                                                    color: "#787878",
                                                    fontSize: "0.7em"
                                                }}>
                                                No data
                                            </span>
                                        }
                                    </Table.Cell>
                                </Table.Row>
                            ))
                        }
                        </Table.Body>
                    </Table>
                </div>
            </div>
        )
    }
};

SensorList.propTypes = {
    data: PropTypes.arrayOf(SensorPropTypes),
    onSelected: PropTypes.func,
    isFetching: PropTypes.bool,
    selected: PropTypes.string
}

export default SensorList;
