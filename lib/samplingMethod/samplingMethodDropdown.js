import React, { Component } from 'react';
import PropTypes from 'prop-types';

// istSOS components
// import SamplingMethodForm from '../samplingMethodForm/samplingMethodFormContainer';
import {
    SamplingMethodsPropTypes
} from 'istsos3-core';

// Semantic UI components
import {
    Form,
    Header,
    Modal,
    Button
} from 'semantic-ui-react'

class SamplingMethodDropdown extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: this.props.selected,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event, method) {
        const {
            onSelected,
            data
        } = this.props;
        for (var i = 0; i < data.length; i++) {
            if(data[i].identifier === method.value){
                this.setState({selected: data[i].identifier});
                if(onSelected!==undefined){
                    onSelected(data[i]);
                }
                break;
            }
        }
    }

    render() {
        const {
            data,
        } = this.props;
        var options = data.map((method, key) => {
            return {
                key: method.id,
                value: method.identifier,
                text: method.name,
                content: <Header
                    content={method.name}
                    subheader={method.description} />
            }
        })
        return (
                <Form.Select
                    fluid={true}
                    options={options}
                    placeholder='Select a sampling method...'
                    onChange={this.handleChange}/>
                /*
                <Form.Group>
                {
                    samplingmethods.dialog===true?
                    <Modal
                        open={samplingmethods.dialog}
                        onClose={(e) => {
                            openDialog(false)
                        }}>
                        <Modal.Header>
                            Add a new sampling method
                        </Modal.Header>
                        <Modal.Content>
                            <Modal.Description>
                                <SamplingMethodForm/>
                            </Modal.Description>
                        </Modal.Content>
                    </Modal>:
                    <Button
                        circular
                        secondary
                        icon='add'
                        onClick={(e) => {
                            openDialog(true)
                        }}/>
                }
                </Form.Group>
                */

        )
    }
};

SamplingMethodDropdown.propTypes = {
    data: PropTypes.arrayOf(SamplingMethodsPropTypes),
    selected: PropTypes.string,
    onSelected: PropTypes.func
};

export default SamplingMethodDropdown;
