import React, { Component } from 'react';

// Semantic UI components
import {
    Form,
    Header,
    Modal,
    Button
} from 'semantic-ui-react'


class UomsComponent extends Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event, data) {
        const {
            onSelected,
            selected,
            uoms
        } = this.props;
        for (var i = 0; i < uoms.data.length; i++) {
            if(uoms.data[i].name === data.value){
                selected(uoms.data[i]);
                if(onSelected!==undefined){
                    onSelected(uoms.data[i]);
                }
                break;
            }
        }
    }

    render() {
        const {
            uoms,
            filter
        } = this.props;
        let data = null;
        if(filter !== undefined && filter.hasOwnProperty('name')){
            data =  uoms.data.filter(
                uom => filter.name.includes(uom.name)
            );
        }else{
            data = uoms.data;
        }
        const options = data.map((uom, key) => {
            return {
              key: "istsos3-ui-uoms-opt-" + uom.id,
              value: uom.name,
              text: uom.description === null? uom.name: uom.description,
              content: <Header content={uom.name} subheader={uom.description} />
            }
        });
        return (
            <Form.Select
                style={{width: '100%'}}
                //fluid={true}
                options={options}
                placeholder='Unit of measure'
                onChange={this.handleChange}/>
        )
    }
};

export default UomsComponent;
