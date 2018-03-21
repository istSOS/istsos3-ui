import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Semantic UI components
import {
    Table
} from 'semantic-ui-react'


class ListObsProps extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeItem: null,
        };
    }

    handleClick(obsprop) {
        const {
            onSelected,
            observed_properties
        } = this.props;
        this.setState({activeItem: obsprop.definition})
        if(onSelected!==undefined){
            onSelected(obsprop);
        }
    }

    render() {
        const {
            observed_properties,
            filter
        } = this.props;
        const { activeItem } = this.state;
        let data = null;
        if(filter !== undefined && filter.hasOwnProperty('definition')){
            data =  observed_properties.filter(
                obsprop => filter.definition.includes(obsprop.definition)
            );
        }else{
            data = observed_properties;
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
                                        {o.name}
                                    </div>
                                    <div style={{
                                        color: "#787878",
                                        fontSize: "0.7em"
                                    }}>
                                        {o.definition}
                                    </div>
                                    <div style={{
                                        fontSize: "0.8em"
                                    }}>
                                    {
                                        o.description === null?
                                        'n/a': o.description
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

ListObsProps.propTypes = {
    observed_properties: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
            definition: PropTypes.string
        })
    ),
    value: PropTypes.string
}

export default ListObsProps;
