import React, { Component } from 'react';
import PropTypes from 'prop-types';

// istSOS components
import {
    UomPropTypes
} from 'istsos3-core';

// Semantic UI components
import {
    Form,
    Header,
    Modal,
    Button
} from 'semantic-ui-react'

class UomsDropdown extends Component {

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
            if(data[i].name === method.value){
                this.setState({selected: data[i].name});
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
        var options = data.map((uom, key) => {
            return {
                key: uom.id,
                value: uom.name,
                text: uom.description === null?
                    uom.name: uom.description,
                content: <Header
                    content={uom.name}
                    subheader={uom.description}/>
            }
        })
        return (
                <Form.Select
                    fluid={true}
                    options={options}
                    placeholder='Unit of measure'
                    onChange={this.handleChange}/>
        )
    }
};

UomsDropdown.propTypes = {
    data: PropTypes.arrayOf(UomPropTypes),
    selected: PropTypes.string,
    onSelected: PropTypes.func
};

export default UomsDropdown;
