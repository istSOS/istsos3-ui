import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Humans from '../../humans/humans';
import ProcessingDetails from '../../processingDetails/processingDetails';
import DateInput from '../../date/dateInput';

import {
    SpecimenPropTypes
} from 'istsos3-core';

// Semantic UI components
import {
    Form,
    Input,
    Popup,
    Button,
    Table,
    Icon
} from 'semantic-ui-react';

class SpecimenFormProcessing extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            operator: null,
            processing: null,
            date: "",
            time: "",
            timeInstant: "",
            samplingTimeValid: props.hidden.indexOf('time') > -1,
            processingValid: false,
            ...this.processing2state(props)
        };
        this._onChange = this._onChange.bind(this);
        this.dateChange = this.dateChange.bind(this);
        this.timeChange = this.timeChange.bind(this);
        this.addProcessing = this.addProcessing.bind(this);
        this.removeProcessing = this.removeProcessing.bind(this);
    }

    specimen2state(){
        const {
            specimen
        } = this.props;
        let data = [];
        if (
            _.has(specimen, 'processingDetails')
            && _isArray(specimen.processingDetails)
        ){
            specimen.processingDetails.forEach((processing)=>{
                data.push({
                    operator: this.state.operator,
                    processing: this.state.processing,
                    instant: this.state.timeInstant
                });
            })
        }
        return data;
    }

    addProcessing(){
        const {
            hidden
        } = this.props;
        this.setState({
            data: [
                ...this.state.data,
                {
                    operator: this.state.operator,
                    processing: this.state.processing,
                    instant: this.state.timeInstant
                }
            ]
        }, this._onChange)
    }

    removeProcessing(index){
        let data = [...this.state.data];
        data.splice(index, 1);
        this.setState({
            data: data
        }, this._onChange);
    }

    dateChange(date){
        let timeInstant = date + "T" + this.state.time + "+00:00";
        this.setState({
            date: date,
            timeInstant: timeInstant,
            samplingTimeValid: moment(timeInstant, moment.ISO_8601).isValid()
        });
    }

    timeChange(event){
        let time = event.target.value.replace(/[^0-9:]/gi, '');
        let timeInstant = this.state.date + "T" + time + "+00:00";
        this.setState({
            time: time,
            timeInstant: timeInstant,
            samplingTimeValid: moment(timeInstant, moment.ISO_8601).isValid()
        });
    }

    _onChange() {
        const {
            onChange,
            hidden
        } = this.props, {
            data
        } = this.state;
        if(onChange!==undefined){
            let changes = [];
            data.forEach((process)=>{
                changes.push({
                    processOperator: hidden.indexOf('operator')===-1?
                        {
                            href: process.operator.username
                        }: null,
                    processingDetails: {
                        href: this.state.processing.identifier
                    },
                    time: hidden.indexOf('time')===-1?
                        {
                            timeInstant: {
                                instant: this.state.timeInstant
                            }
                        }: null
                })
            });
            onChange({
                processingDetails: changes
            })
        }
    }

    processing2state(props){
        let data = {};
        return data;
    }

    render() {
        const {
            hidden
        } = this.props, {
            data,
            operator,
            processing,
            processingValid,
            samplingTimeValid,
            date,
            time
        } = this.state;
        return (
            <div style={{
                    flex: "1 1 0%",
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                <Form>
                    <Form.Group widths='equal'>
                        {
                            hidden.indexOf('operator')===-1?
                            <Form.Field required>
                                <label>Operator</label>
                                <Humans
                                    layout="dropdown"
                                    onSelected={(human)=>{
                                        this.setState({
                                            operator: human
                                        })
                                    }}
                                    value={
                                        _.has(operator, 'username')?
                                        operator.username: null
                                    }/>
                            </Form.Field>: null
                        }
                        <Form.Field required>
                            <label>Processing Details</label>
                            <ProcessingDetails
                                layout="dropdown"
                                onSelected={(pd)=>{
                                    this.setState({
                                        processing: pd
                                    })
                                }}
                                value={
                                    _.has(processing, 'identifier')?
                                    processing.identifier: null
                                }/>
                        </Form.Field>
                        {
                            hidden.indexOf('time')===-1?
                            <Form.Field
                                error={!samplingTimeValid}>
                                <label>Processing date {
                                    date.length>0?
                                    " (YYYY-MM-DD)": null
                                }</label>
                                <DateInput
                                    onChange={this.dateChange}
                                    value={date}/>
                            </Form.Field>: null
                        }
                        {
                            hidden.indexOf('time')===-1?
                            <Form.Field
                                error={!samplingTimeValid}>
                                <label>
                                    Time (HH:MM:SS)
                                </label>
                                <Input
                                    icon='time'
                                    iconPosition='left'
                                    placeholder='HH:MM:SS'
                                    onChange={this.timeChange}
                                    value={time}
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    spellCheck="false"/>
                            </Form.Field>: null
                        }
                    </Form.Group>
                </Form>
                <div>
                    <Button
                        primary
                        fluid
                        disabled={
                            (operator===null && hidden.indexOf('operator')===-1)
                            || processing===null
                            || !samplingTimeValid
                        }
                        icon='add'
                        onClick={this.addProcessing}
                        content="Add"/>
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
                                    <Table.HeaderCell collapsing>
                                        #
                                    </Table.HeaderCell>
                                    {
                                        hidden.indexOf('operator')===-1?
                                        <Table.HeaderCell collapsing>
                                            Operator
                                        </Table.HeaderCell>: null
                                    }
                                    <Table.HeaderCell>
                                        Processing
                                    </Table.HeaderCell>
                                    {
                                        hidden.indexOf('time')===-1?
                                        <Table.HeaderCell>
                                            Time
                                        </Table.HeaderCell>: null
                                    }
                                    <Table.HeaderCell collapsing textAlign="center">
                                        <Icon name='remove'/>
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                            {
                                data.map((pd, index) => (
                                    <Table.Row
                                            key={"istsos-ui-ob-row-"+index}>
                                        <Table.Cell>
                                            {index+1}
                                        </Table.Cell>
                                        {
                                            hidden.indexOf('operator')===-1?
                                            <Table.Cell singleLine>
                                                <div style={{
                                                    fontWeight: "bold"
                                                }}>
                                                    {pd.operator.firstname} {pd.operator.lastname}
                                                </div>
                                                <div style={{
                                                    color: "#787878",
                                                    fontSize: "0.7em"
                                                }}>
                                                    {pd.operator.username}
                                                </div>
                                            </Table.Cell>: null
                                        }
                                        <Table.Cell singleLine>
                                            <div style={{
                                                fontWeight: "bold"
                                            }}>
                                                {pd.processing.name}
                                            </div>
                                            <div style={{
                                                color: "#787878",
                                                fontSize: "0.7em"
                                            }}>
                                                {
                                                    pd.processing.description !== ''?
                                                    pd.processing.description:
                                                    pd.processing.identifier
                                                }
                                            </div>
                                        </Table.Cell>
                                        {
                                            hidden.indexOf('time')===-1?
                                            <Table.Cell singleLine>
                                                {
                                                    pd.instant
                                                }
                                            </Table.Cell>: null
                                        }
                                        <Table.Cell textAlign="center">
                                            <Button
                                                circular
                                                size='tiny'
                                                color='red'
                                                icon='remove'
                                                onClick={() => this.removeProcessing(index)}/>
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

SpecimenFormProcessing.defaultProps = {
    hidden: []
};

SpecimenFormProcessing.propTypes = {
    specimen: SpecimenPropTypes,
    hidden: PropTypes.arrayOf(PropTypes.string),
}

export default SpecimenFormProcessing;
