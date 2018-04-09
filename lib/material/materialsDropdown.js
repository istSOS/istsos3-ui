import React from 'react';
import PropTypes from 'prop-types';

import {
    MaterialPropTypes
} from 'istsos3-core';

// Semantic UI components
import {
    Form,
    Header
} from 'semantic-ui-react';

class MaterialsDropdown extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: this.props.selected,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event, data) {
        const {
            onSelected,
            materials
        } = this.props;
        for (var i = 0; i < materials.length; i++) {
            let m = materials[i];
            if(m.definition === data.value){
                this.setState({selected: m.definition});
                if(onSelected!==undefined){
                    onSelected({...m});
                }
                break;
            }
        }
    }

    render() {
        const {
            materials
        } = this.props, {
            selected
        } = this.state;

        return (
            <Form.Select
                fluid={true}
                options={
                    materials.map((material) => {
                        return {
                            key: "mat-opt-" + material.id,
                            value: material.definition,
                            text: material.name,
                            content: <Header
                            content={material.name}
                            subheader={material.definition}/>
                        }
                    })
                }
                placeholder='Select the material'
                value={selected}
                onChange={this.handleChange}/>
        )
    }
};

MaterialsDropdown.propTypes = {
    materials: PropTypes.arrayOf(MaterialPropTypes),
    selected: PropTypes.string,
    onSelected: PropTypes.func
};

export default MaterialsDropdown;
