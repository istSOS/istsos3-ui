import React, { Component } from 'react';
import PropTypes from 'prop-types';

// istSOS components
import {
    ProcessingDetailPropTypes
} from 'istsos3-core';

// Semantic UI components
import {
    Form,
    Header,
    Modal,
    Button
} from 'semantic-ui-react'

class ProcessingDetailsDropdown extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: this.props.selected,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event, process) {
        const {
            onSelected,
            data
        } = this.props;
        for (var i = 0; i < data.length; i++) {
            if(data[i].identifier === process.value){
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
        var options = data.map((pd, idx) => ({
            key: "pds-opt-" + pd.id,
            value: pd.identifier,
            text: pd.name,
            content: <Header
                content={pd.name}
                subheader={pd.description}/>
        }));
        return (
            <Form.Select
                fluid={true}
                options={options}
                placeholder='Select a processing detail...'
                onChange={this.handleChange}/>
        )
    }
};

ProcessingDetailsDropdown.propTypes = {
    data: PropTypes.arrayOf(ProcessingDetailPropTypes),
    selected: PropTypes.string,
    onSelected: PropTypes.func
};

export default ProcessingDetailsDropdown;
