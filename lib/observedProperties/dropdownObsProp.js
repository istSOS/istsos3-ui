import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Semantic UI components
import {
    Header,
    Dropdown
} from 'semantic-ui-react'

class DropdownObsProp extends Component {

    render() {
        const {
            observed_properties,
            onSelected
        } = this.props;
        var options = observed_properties.map((oty, key) => {
            return {
                key: oty.id,
                value: oty.definition,
                text: oty.name,
                content: <Header
                    content={oty.name}
                    subheader={oty.definition} />
            }
        })
        return (
            <Dropdown
                style={{
                    marginBottom: '1em'
                }}
                placeholder='Observable properties'
                fluid multiple selection
                options={options}
                onChange={(event, data) => {
                    if(onSelected!==undefined){
                        onSelected(data.value);
                    }
                }}/>
        )
    }
};

DropdownObsProp.propTypes = {
    observed_properties: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
            definition: PropTypes.string
        })
    ),
    value: PropTypes.string
}

export default DropdownObsProp;
