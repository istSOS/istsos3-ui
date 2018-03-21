import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Semantic UI components
import {
    Form,
    Header
} from 'semantic-ui-react'

class SelectObsProp extends Component {

    render() {
        const {
            observed_properties,
            value,
            onSelected
        } = this.props;
        var options = observed_properties.map((o, key) => {
            return {
                key: o.id,
                value: o.definition,
                text: o.name,
                content: <Header
                    content={o.name}
                    subheader={o.definition} />
            }
        })
        return(
            <Form.Select
                fluid={true}
                value={value}
                options={options}
                placeholder='Observable property..'
                onChange={(e, data)=>{
                    if(onSelected!==undefined){
                        for (var i = 0; i < observed_properties.length; i++) {
                            if(observed_properties[i].definition === data.value){
                                onSelected(observed_properties[i]);
                                break;
                            }
                        }
                    }
                }}/>
        )
    }
};

SelectObsProp.propTypes = {
    observed_properties: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
            definition: PropTypes.string
        })
    ),
    value: PropTypes.string
}

export default SelectObsProp;
