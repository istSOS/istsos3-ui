import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    SamplingTypesPropTypes
} from 'istsos3-core';

// Semantic UI components
import {
    Form,
    Header
} from 'semantic-ui-react'

class SamplingTypesDropdown extends Component {

    constructor(props) {
        super(props);
        const {
            selected
        } = this.props;
        this.state = {
            selected: selected || ''
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event, data) {
        const {
            onSelected,
            samplingtypes
        } = this.props;
        for (var i = 0; i < samplingtypes.length; i++) {
            if(samplingtypes[i].definition === data.value){
                this.setState({
                    selected: samplingtypes[i].definition
                });
                if(onSelected!==undefined){
                    onSelected({
                        ...samplingtypes[i]
                    });
                }
                break;
            }
        }
    }

    render() {
        const {
            samplingtypes
        } = this.props;
        var options = samplingtypes.map((sams, key) => {
            return {
                key: sams.id,
                value: sams.definition,
                text: sams.definition,
                content: <Header
                    content={sams.name}
                    subheader={sams.definition} />
            }
        })
        return (
            <Form.Select
                value={this.state.selected}
                fluid={true}
                options={options}
                placeholder='Select the sampling type..'
                onChange={this.handleChange}/>
        );
    }
};

SamplingTypesDropdown.propTypes = {
    samplingtypes: PropTypes.arrayOf(SamplingTypesPropTypes),
    selected: PropTypes.string,
    onSelected: PropTypes.func
};

export default SamplingTypesDropdown;
