import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    setting,
    FoiPropTypes
} from 'istsos3-core';

// Semantic UI components
import {
    Table,
    Header,
    Message,
    Icon
} from 'semantic-ui-react'


class ListFois extends Component {

    constructor(props) {
        super(props);
        const {
            activeItem
        } = this.props;
        this.state = {
            activeItem: activeItem !== undefined? activeItem: null,
        };
    }

    handleClick(foi) {
        const {
            onSelected,
            fois
        } = this.props;
        this.setState({activeItem: foi.identifier})
        if(onSelected!==undefined){
            onSelected(foi);
        }
    }

    render() {
        const {
            fois,
            isFetching,
            filter
        } = this.props;
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
        const { activeItem } = this.state;
        let data = null;
        if(filter !== undefined){
            if(filter.hasOwnProperty('map_ids')){
                data = fois.filter(
                    foi => foi.type === null
                ).concat(
                    fois.filter(
                        foi => filter.map_ids.includes(foi.id)
                    )
                );
            }else if(filter.hasOwnProperty('identifier')){
                data =  fois.filter(
                    foi => filter.identifier.includes(foi.identifier)
                );
            }
        }else{
            data = fois;
        }
        data = data.sort((a, b)=>{
            if (a.name < b.name)
                return -1;
            if (a.name > b.name)
                return 1;
          return 0;
        });
        let list = {
            "System domains": data.filter(foi => foi.type === null),
            "Feature of Interests": data.filter(foi => foi.type !== null)
        };
        return (
            <div style={{
                    flex: "1 1 0%",
                    overflowY: 'auto'
                }}>
                <Table fixed selectable basic='very'>
                    <Table.Body>
                    {
                        Object.keys(list).map((key) => {
                            let rows = [
                                <Table.Row key={"istsos3-ui-lf-"+key} disabled>
                                    <Table.Cell>
                                        <Header as='h4' color='blue'>
                                            {key}
                                        </Header>
                                    </Table.Cell>
                                </Table.Row>
                            ];
                            return rows.concat(
                                list[key].map((foi, idx) => (
                                    <Table.Row
                                        active={activeItem === foi.identifier}
                                        key={"istsos-ui-fli-"+idx}
                                        onClick={(e) => this.handleClick(foi)}
                                        style={{cursor: "pointer"}}>
                                        <Table.Cell
                                            title={foi.description}>
                                            <div style={{
                                                fontWeight: "bold"
                                            }}>
                                                {foi.name}
                                            </div>
                                            <div style={{
                                                color: "#787878",
                                                fontSize: "0.7em"
                                            }}>
                                            {
                                                foi.type?
                                                foi.type.replace(
                                                    setting._foidef, ""): "System domain"
                                            }
                                            </div>
                                            <div style={{
                                                fontSize: "0.8em"
                                            }}>
                                            {
                                                //foi.description
                                            }
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            );
                        })
                    }
                    </Table.Body>
                </Table>
            </div>
        )
    }
};

ListFois.propTypes = {
    fois: PropTypes.arrayOf(FoiPropTypes),
    onSelected: PropTypes.func,
    isFetching: PropTypes.bool,
    value: PropTypes.string
}

export default ListFois;
