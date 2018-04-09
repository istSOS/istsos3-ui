import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash'

import {
    checkFoiName,
    checkFoiIdentifier,
    setting
} from 'istsos3-core';

import Mappa from '../../mappa/mappa';
import FoiFormMetadata from './foiFormMetadata';

class FoiForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: props.foiType || null,
            disableType: _.isString(
                props.foiType
            )? true: false,
            foi: null,
            valid: false
        };
        this.onChange = this.onChange.bind(this);
        this.changeFeature = this.changeFeature.bind(this);
    }
    // componentWillReceiveProps(nextProps){
    //     let data = {};
    //     if(this.props.foiType !== nextProps.foiType){
    //         data = {
    //             type: nextProps.foiType || null
    //         };
    //     }
    //     this.setState({
    //         ...this.state,
    //         ...data
    //     });
    // }
    onChange(foi, valid){
        if(!_.isEqual(foi, this.state.foi)
            || this.state.valid !== valid){
            const {
                onChange
            } = this.props;
            this.setState({
                ...this.state,
                foi: foi,
                valid: valid
            }, ()=>{
                if(onChange!==undefined){
                    onChange(
                        this.state.foi,
                        valid
                    );
                }
            });
        }
    }
    changeFeature(foi){
        this.setState({
            ...this.state,
            foi: {
                ...this.state.foi,
                type: this.state.type,
                shape: foi.shape
            }
        });
    }
    render() {
        const {
            showMap,
            foiType
        } = this.props;
        if(showMap===false){
            return (
                <FoiFormMetadata
                    {...this.props}
                    disableType={this.state.disableType}/>
            )
        }else if (showMap===true) {
            return (
                <div style={{
                        flex: "1 1 0%",
                        overflowY: "auto",
                        padding: "1em 0px",
                        display: "flex",
                        flexDirection: "row"
                    }}>
                    <div style={{
                            flex: "1 1 0%",
                            overflowY: "auto",
                            padding: '0px 1em'
                        }}>
                        <FoiFormMetadata
                            {...this.props}
                            foi={this.state.foi}
                            foiType={this.state.type}
                            disableType={this.state.disableType}
                            onChange={this.onChange}
                            typeChanged={(selected)=>{
                                this.setState({
                                    type: selected.definition
                                });
                            }}/>
                    </div>
                    <div style={{
                            flex: "1 1 10%",
                            // overflowY: "auto"
                        }}>
                        <Mappa
                            editing={
                                this.state.type!==null?
                                setting._SAMPLING_TYPES[
                                    this.state.type
                                ].name: null
                            }
                            foi={this.state.foi}
                            changefeature={this.changeFeature}/>
                    </div>
                </div>
            )
        }
    }
};

const mapStateToProps = (state, ownProps) => {
    return {
        foiType: null,
        showMap: false,
        ...ownProps,
        hide: {
            name: false,
            identifier: false,
            description: false,
            type: false,
            coordinates: false,
            ...ownProps.hide
        }
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatch: dispatch,
        checkFoiName: (name, onSuccess) => {
            dispatch(checkFoiName(name, undefined, onSuccess));
        },
        checkFoiIdentifier: (identifier, onSuccess) => {
            dispatch(checkFoiIdentifier(identifier, undefined, onSuccess));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FoiForm);
