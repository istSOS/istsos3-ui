import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash'

import {
    checkSpecimenIdentifier
} from 'istsos3-core';

import SpecimenFormMetadata from './specimenFormMetadata';
import SpecimenFormProcessing from './specimenFormProcessing';

import {
    Header,
    Grid,
    Segment
} from 'semantic-ui-react';

class SpecimenForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const {
            layout
        } = this.props;
        if (layout==="metadata"){
            return (
                <SpecimenFormMetadata
                    {...this.props}/>
            );
        }else if(layout==="processing"){
            return (
                <SpecimenFormProcessing
                    {...this.props}/>
            );
        }else if (layout === 'both') {
            return (
                <div>
                    <SpecimenFormMetadata
                        {...this.props}/>
                    <Segment>
                        <Header as='h3'>
                            Processing details
                        </Header>
                        <SpecimenFormProcessing
                            {...this.props}/>
                    </Segment>
                </div>
            );
        }else if (layout === 'template') {
            return(
                <Grid stackable columns={2}>
                    <Grid.Column>
                        <SpecimenFormMetadata
                            {...this.props}
                            hidden={['time']}/>
                    </Grid.Column>
                    <Grid.Column>
                        <Segment>
                            <SpecimenFormProcessing
                                {...this.props}
                                hidden={['time', 'operator']}/>
                        </Segment>
                    </Grid.Column>
                </Grid>
            );
        }
    }
};

const mapStateToProps = (state, ownProps) => {
    return {
        layout: 'metadata',
        ...ownProps
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatch: dispatch,
        checkSpecimenIdentifier: (identifier, onSuccess) => {
            dispatch(
                checkSpecimenIdentifier(
                    identifier, undefined, onSuccess
                )
            );
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SpecimenForm);
