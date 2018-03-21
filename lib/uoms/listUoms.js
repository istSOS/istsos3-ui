import React, { Component } from 'react';

// Semantic UI components
import {
    Table
} from 'semantic-ui-react'


class ListUoms extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeItem: null,
        };
    }

    handleClick(uom) {
        const {
            onSelected,
            uoms
        } = this.props;
        this.setState({activeItem: uom.name})
        if(onSelected!==undefined){
            onSelected(uom);
        }
    }

    render() {
        const {
            uoms,
            filter
        } = this.props;
        const { activeItem } = this.state;
        let data = null;
        if(filter !== undefined && filter.hasOwnProperty('name')){
            data =  uoms.filter(
                uom => filter.name.includes(uom.name)
            );
        }else{
            data = uoms;
        }
        return (
            <div style={{
                    flex: "1 1 0%",
                    overflowY: 'auto'
                }}>
                <Table fixed selectable basic='very'>
                    <Table.Body>
                    {
                        data.map((uom, idx) => (
                            <Table.Row
                                active={activeItem === uom.name}
                                key={"istsos-ui-li-"+idx}
                                onClick={
                                    () => this.handleClick(uom)
                                } style={{cursor: "pointer"}}>
                                <Table.Cell
                                    style={{
                                        fontWeight: "bold"
                                    }}>
                                {
                                    [null, ''].indexOf(
                                        uom.description)>-1?
                                    uom.name:
                                    uom.description + " (" + uom.name +")"
                                }
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

export default ListUoms;
