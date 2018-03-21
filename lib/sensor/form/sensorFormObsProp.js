import React from 'react';

// istSOS UI components
// import {
//     //Uoms,
//     ListUoms,
//     ObservedProperties,
//     ObservationTypes
// } from 'istsos3-ui';

import ObservedProperties from '../../observedProperties/observedProperties';
import Uoms from '../../uoms/uomsContainer';
import ObservationTypes from '../../observationTypes/observationTypes';

// Semantic UI components
import {
    Form,
    Table,
    Button,
    Icon,
    Segment,
    Header,
    Label
} from 'semantic-ui-react'


class SensorFormObsProp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            observed_property: null,
            uom: null,
            oty: null,
            ...this.sensor2state(props)
        };
        this._onChange = this._onChange.bind(this);
        this.addObservableProperty = this.addObservableProperty.bind(this);
        this.removeObservableProperty = this.removeObservableProperty.bind(this);
    }

    _onChange() {
        const {
            onChange,
            single
        } = this.props;
        if(onChange!==undefined){
            const {
                data
            } = this.state;
            let onlyOne = (
                single !== undefined
                && single === true
            );
            let ops = [], ots = [];
            data.forEach((op)=>{
                ops.push({
                    "definition": op.observed_property.definition,
                    "uom": op.uom.name,
                    "type": op.oty.definition
                });
                if(ots.indexOf(op.oty.definition)===-1){
                    ots.push(
                        op.oty.definition
                    );
                }
            });
            onChange(
                {
                    observable_properties: ops,
                    observation_types: ots
                },
                (
                    onlyOne && data.length===1
                    || !onlyOne && data.length>1
                )
            );
        }
    }

    sensor2state(props){
        const {
            sensor,
            uoms,
            observation_types,
            observed_properties
        } = props;
        let data = {};
        if (
            sensor !== null
            && sensor !== undefined
            && sensor.hasOwnProperty('observable_properties')
        ){
            data['data'] = [];
            sensor.observable_properties.forEach((o)=>{
                let rec = {
                    observed_property: (
                        observed_properties.norm.hasOwnProperty(
                            o.definition
                        )?{
                            ...observed_properties.norm[o.definition]
                        }:{
                            loading: true
                        }
                    ),
                    uom: (
                        uoms.norm.hasOwnProperty(o.uom)?
                        {
                            ...uoms.norm[o.uom]
                        }:{
                            loading: true
                        }
                    ),
                    oty: (
                        observation_types.norm.hasOwnProperty(o.type)?
                        {
                            ...observation_types.norm[o.type]
                        }:{
                            loading: true
                        }
                    )
                };
                data['data'].push(rec);
            })
        }
        return data;
    }

    componentWillReceiveProps(nextProps){
        const {
            sensor,
            uoms,
            observation_types,
            observed_properties
        } = this.props;
        if(
            nextProps.uoms.data.length !== uoms.data.length
            || nextProps.observation_types.data.length !== observation_types.data.length
            || nextProps.observed_properties.data.length !== observed_properties.data.length
        ){
            console.log("store loaded!");
            this.setState(
                ...this.sensor2state(nextProps)
            )
        }
    }

    addObservableProperty() {
        const {
            data,
            observed_property,
            uom,
            oty
        } = this.state;
        this.setState({
            data: [
                ...data,
                {
                    observed_property: {...observed_property},
                    uom: {...uom},
                    oty: {...oty},
                }
            ]
        }, this._onChange);
    }

    removeObservableProperty(index) {
        let data = [...this.state.data];
        data.splice(index, 1);
        this.setState({
            data: data
        }, this._onChange);
    }

    render() {
        const {
            single
        } = this.props, {
            observed_property,
            data,
            uom,
            oty
        } = this.state;

        let onlyOne = (
            single !== undefined
            && single === true
        );

        return (
            <div style={{
                    flex: "1 1 0%",
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                <div style={{
                        flex: '0.2 1 300px',
                        display: 'flex',
                        flexDirection: 'row'
                    }}>
                    <div style={{
                            padding: "0.5em 1em 0.5em 0px",
                            flex: '1 1 0%',
                            display: "flex",
                            flexDirection: "column"
                        }}>
                        <Segment.Group style={{
                                flexDirection: "column",
                                display: "flex"
                            }}>
                            <Segment inverted>
                                <Header sub>Observed property:</Header>
                            </Segment>
                            <Segment style={{
                                    flex: "1 1 0%",
                                    overflow: "hidden",
                                    display: "flex",
                                    flexDirection: "column"
                                }}>
                                <ObservedProperties
                                    layout='list'
                                    onSelected={observed_property => {
                                        this.setState({
                                            observed_property: observed_property
                                        });
                                    }}/>
                            </Segment>
                            <Segment>
                                {
                                    observed_property !== null?
                                    <Label color="black" style={{width: '100%'}}>
                                        {observed_property.name}
                                    </Label>:
                                    <span style={{
                                        color: '#787878'
                                    }}>Please select</span>
                                }
                            </Segment>
                        </Segment.Group>
                    </div>
                    <div style={{
                            padding: "0.5em 1em 0.5em 0px",
                            flex: '1 1 0%',
                            display: "flex",
                            flexDirection: "column"
                        }}>
                        <Segment.Group style={{
                                flexDirection: "column",
                                display: "flex"
                            }}>
                            <Segment inverted>
                                <Header sub>Unit of measure:</Header>
                            </Segment>
                            <Segment style={{
                                    flex: "1 1 0%",
                                    overflow: "hidden",
                                    display: "flex",
                                    flexDirection: "column"
                                }}>
                                <Uoms
                                    layout='list'
                                    onSelected={uom => {
                                        this.setState({
                                            uom: uom
                                        });
                                    }}/>
                            </Segment>
                            <Segment>
                                {
                                    uom !== null?
                                    <Label color="black" style={{width: '100%'}}>{uom.name}</Label>:
                                    <span style={{color: '#787878'}}>Please select</span>
                                }
                            </Segment>
                        </Segment.Group>
                    </div>
                    <div style={{
                            padding: "0.5em 0px 0.5em 0px",
                            flex: '1 1 0%',
                            display: "flex",
                            flexDirection: "column"
                        }}>
                        <Segment.Group style={{
                                flexDirection: "column",
                                display: "flex"
                            }}>
                            <Segment inverted>
                                <Header sub>Data Type:</Header>
                            </Segment>
                            <Segment style={{
                                    flex: "1 1 0%",
                                    overflow: "hidden",
                                    display: "flex",
                                    flexDirection: "column"
                                }}>
                                <ObservationTypes
                                    layout='list'
                                    onSelected={oty => {
                                        this.setState({
                                            oty: oty
                                        });
                                    }}/>
                            </Segment>
                            <Segment>
                                {
                                    oty !== null?
                                    <Label color="black" style={{width: '100%'}}>{oty.description}</Label>:
                                    <span style={{color: '#787878'}}>Please select</span>
                                }
                            </Segment>
                        </Segment.Group>
                    </div>
                </div>
                <div style={{
                        padding: '1em'
                    }}>
                    {
                        observed_property !== null !== null
                        && oty !== null
                        && uom !== null?
                        <Button
                            primary
                            fluid
                            disabled={
                                onlyOne && data.length>0
                            }
                            icon={
                                onlyOne? null: 'add'
                            }
                            onClick={this.addObservableProperty}
                            content={
                                onlyOne? "Set": "Add"
                            }/>: null
                    }
                </div>
                <div style={{
                        flex: '1 1 0%',
                        overflowY: 'auto',
                        padding: '1em'
                    }}>
                    {
                        data.length>0?
                        <Table basic='very'>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>
                                        #
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>
                                        Observable property
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>
                                        Unit of measure
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>
                                        Result type
                                    </Table.HeaderCell>
                                    <Table.HeaderCell textAlign="center">
                                        <Icon name='remove'/>
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {
                                    data.map((op, index) => (
                                        <Table.Row
                                                key={"is-ob-row-"+index}>
                                            <Table.Cell>
                                                {index}
                                            </Table.Cell>
                                            <Table.Cell singleLine>
                                                {
                                                    op.observed_property.loading?
                                                    <Icon loading name='spinner' />:
                                                    op.observed_property.name === ""?
                                                        op.observed_property.def:
                                                        op.observed_property.name
                                                }
                                            </Table.Cell>
                                            <Table.Cell singleLine>
                                                {
                                                    op.uom.loading?
                                                    <Icon loading name='spinner' />:
                                                    op.uom.name + " " + op.uom.description !== ''?
                                                        " ("+op.uom.description+")": null
                                                }
                                            </Table.Cell>
                                            <Table.Cell singleLine>
                                                {
                                                    op.oty.loading?
                                                    <Icon loading name='spinner' />:
                                                    op.oty.description
                                                }
                                            </Table.Cell>
                                            <Table.Cell singleLine textAlign="center">
                                                <Button
                                                    circular
                                                    size='tiny'
                                                    color='red'
                                                    icon='remove'
                                                    onClick={() => this.removeObservableProperty(index)}/>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))
                                }
                            </Table.Body>
                        </Table>: null
                    }
                </div>
            </div>
        );
    }
};

export default SensorFormObsProp;
