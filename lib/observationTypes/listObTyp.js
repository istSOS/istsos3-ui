import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Semantic UI components
import {
    Table
} from 'semantic-ui-react'


class ListObType extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeItem: null,
        };
    }

    handleClick(oty) {
        const {
            onSelected,
            observation_types
        } = this.props;
        this.setState({activeItem: oty.definition})
        if(onSelected!==undefined){
            onSelected(oty);
        }
    }

    render() {
        const {
            observation_types,
            filter
        } = this.props;
        const { activeItem } = this.state;
        let data = null;
        if(filter !== undefined && filter.hasOwnProperty('definition')){
            data =  observation_types.filter(
                oty => filter.definition.includes(oty.definition)
            );
        }else{
            data = observation_types;
        }
        return (
            <div style={{
                    flex: "1 1 0%",
                    overflowY: 'auto'
                }}>
                <Table fixed selectable basic='very'>
                    <Table.Body>
                    {
                        data.map((o, idx) => (
                            <Table.Row
                                active={activeItem === o.definition}
                                key={"istsos-ui-li-"+idx}
                                onClick={
                                    () => this.handleClick(o)
                                } style={{cursor: "pointer"}}>
                                <Table.Cell>
                                    <div style={{
                                        fontWeight: "bold"
                                    }}>
                                        {o.description}
                                    </div>
                                    <div style={{
                                        color: "#787878",
                                        fontSize: "0.7em"
                                    }}>
                                        {o.type}
                                    </div>
                                    <div style={{
                                        fontSize: "0.8em"
                                    }}>
                                    {
                                        o.definition
                                    }
                                    </div>
                                </Table.Cell>
                            </Table.Row>
                        ))
                    }
                    </Table.Body>
                </Table>
            </div>
        )
    }
};

ListObType.propTypes = {
    observation_types: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            description: PropTypes.string,
            definition: PropTypes.string,
            type: PropTypes.string
        })
    ),
    value: PropTypes.string
}

export default ListObType;
