import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    HumanPropTypes
} from 'istsos3-core';

// Semantic UI components
import {
    Form,
    Header,
    Modal,
    Button
} from 'semantic-ui-react'

class HumansDropdown extends Component {

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
            humans
        } = this.props;
        for (var i = 0; i < humans.length; i++) {
            let h = humans[i];
            if(h.username === data.value){
                this.setState({selected: h.username});
                if(onSelected!==undefined){
                    onSelected({...h});
                }
                break;
            }
        }
    }

    render() {
        const {
            humans,
            // openDialog,
            // label
        } = this.props, {
            selected
        } = this.state;

        return (
            <Form.Group>
                <Form.Select
                    fluid={true}
                    options={
                        humans.map((human) => ({
                            key: "hum-opt-" + human.id,
                            value: human.username,
                            text: human.firstname + " "
                                + human.lastname,
                            content: <Header
                            content={
                                human.firstname + " "
                                + human.lastname
                            }
                            subheader={human.username}/>
                        }))
                    }
                    placeholder='Select the person'
                    value={selected}
                    onChange={this.handleChange}/>
                {
                  /*humans.dialog===true?
                  <Modal
                      open={humans.dialog}
                      onClose={(e) => {
                          openDialog(false)
                      }}>
                      <Modal.Header>
                            Add a new {
                                label !== undefined? label: "person"
                            }
                      </Modal.Header>
                      <Modal.Content>
                          <Modal.Description>
                              <HumanForm/>
                          </Modal.Description>
                      </Modal.Content>
                  </Modal>:
                  <Button
                      circular
                      secondary
                      icon='add'
                      onClick={(e) => {
                          openDialog(true)
                      }}/>*/
                }
            </Form.Group>
        )
    }
};

HumansDropdown.propTypes = {
    humans: PropTypes.arrayOf(HumanPropTypes),
    selected: PropTypes.string,
    onSelected: PropTypes.func
};

export default HumansDropdown;
