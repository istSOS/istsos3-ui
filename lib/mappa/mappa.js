import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash'

import placePng from '../images/place.png';
import placeSelectedPng from '../images/place-selected.png';
import editingPng from '../images/place.png';

// istSOS components
import {
    FoiPropTypes,
    setting
} from 'istsos3-core'

// OpenLayers 3
import Map from 'ol/map';
import View from 'ol/view';
import TileLayer from 'ol/layer/tile';
import XYZSource from 'ol/source/xyz';

import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import GeoJSON from 'ol/format/geojson';

import Draw from 'ol/interaction/draw';
import Modify from 'ol/interaction/modify';

import Feature from 'ol/feature';
import Point from 'ol/geom/point';
import Style from 'ol/style/style';
import Icon from 'ol/style/icon';
import Text from 'ol/style/text';
import Circle from 'ol/style/circle';
import Stroke from 'ol/style/stroke';
import Fill from 'ol/style/fill';

class Mappa extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // Feature of interests to show on map
            fois: this.props.fois || [],

            // features visible in map extent
            xfois: []
        };
        this.interactions = {};
    }

    componentDidMount() {
        const {
            editing
        } = this.props, {
            fois
        } = this.state;

        // Init the OL Map
        this.map = new Map({
            target: 'map-container',
            layers: [
                new TileLayer({
                    source: new XYZSource({
                        url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg'
                    })
                })
            ],
            view: new View({
                center: [0, 0],
                zoom: 2
            })
        });
        // Feature of Interest layer
        this.foisrc = new VectorSource();
        this.map.addLayer(new VectorLayer({
            source: this.foisrc,
            style: this.styleFunction.bind(this)
        }));

        // Initialize the editing layer
        this.position = new VectorSource();
        const vector = new VectorLayer({
            source: this.position,
            style: new Style({
                // image: new Icon({
                //     anchor: [0.5, 1],
                //     src: editingPng
                // })
                image: new Circle({
                    radius: 5,
                    fill: new Fill({color: 'rgba(0, 0, 255, 1)'}),
                    stroke: new Stroke({color: 'black', width: 1})
                })
            })
        });
        this.map.addLayer(vector);

        this.interactions = {
            "Point": new Draw({
                type: 'Point',
                source: this.position
            }),
            "Curve": new Draw({
                type: 'LineString',
                source: this.position
            }),
            "Surface": new Draw({
                type: 'Polygon',
                source: this.position
            })
        };

        // Register map events
        this.map.on('moveend', this.moveEnd, this);

        // Register feature modification events
        this.position.on('addfeature', this.changefeature, this);
        this.position.on('changefeature', this.changefeature, this);

        // Enable Interactions
        _.forEach(this.interactions, (value, key) => {
            this.map.addInteraction(value);
            value.setActive(false);
        })
        //this.map.addInteraction(this.drawInteraction);

        // Initialize Modify Interaction
        this.modify = new Modify({
            source: this.position
        });
        this.map.addInteraction(this.modify);

        if(_.isString(editing)){
            this.enableEditing(editing);
        }

        this.addFois(fois);
    }

    disableEditing(){
        _.forEach(this.interactions, (value, key) => {
            if(value.getActive()){
                value.setActive(false);
            }
        })
    }

    enableEditing(type){
        this.disableEditing();
        if(this.interactions.hasOwnProperty(type)){
            this.interactions[type].setActive(true);
        }
    }

    _enableEditing(type){
        const { editing } = this.props;
        if(editing !== null && this.position === undefined){
            // Initialize Drawing Interaction
            this.drawInteraction = new Draw({
                type: editing, // 'Point', 'Polygon'
                source: this.position
            });
            // Initialize Modify Interaction
            this.modify = new Modify({
                source: this.position
            });
            // Register feature modification events
            this.position.on('addfeature', this.changefeature, this);
            this.position.on('changefeature', this.changefeature, this);
            // Enable Interactions
            this.map.addInteraction(this.drawInteraction);
            this.map.addInteraction(this.modify);
        }
    }

    styleFunction(feature, resolution){
        const {
            highlighted
        } = this.props;
        let conf = {
            image: new Circle({
                radius: 4,
                fill: highlighted !== undefined && highlighted.indexOf(feature.get('id'))>-1?
                    new Fill({color: 'rgba(255, 0, 0, 0.8)'}):
                    new Fill({color: 'rgba(0, 255, 0, 1)'}),
                stroke: new Stroke({color: 'black', width: 1})
            })
            // image: new Icon({
            //     anchor: [0.5, 1],
            //     src: highlighted !== undefined && highlighted.indexOf(feature.get('id'))>-1?
            //         placeSelectedPng: placePng
            // }),
        }
        if(resolution<10){
            conf.text = new Text({
                textAlign: "center",
                textBaseline: 'middle',
                fill: new Fill({color: 'black'}),
                font: '12px sans-serif',
                text: feature.get('name'),
                offsetY: 12
            })
        }
        return [new Style(conf)];
    }

    replaceFois(fois, fit = true){
        this.foisrc.clear(true);
        this.addFois(fois, fit);
    }

    addFois(fois, fit = true){
        if(fois.length>0){
            let features = [];
            for (let i = 0, l = fois.length; i < l; i++) {

                let foi = null;
                if(fois[i].hasOwnProperty("shape")){
                    foi = fois[i];
                }else if(fois[i].hasOwnProperty("sampled_foi")){
                    foi = fois[i]['sampled_foi'];
                }
                if(foi.shape !== null){
                    features.push({
                        type: 'Feature',
                        properties: {
                            id: foi.id,
                            name: foi.name
                        },
                        geometry: foi.shape
                    });
                }
            }
            this.foisrc.addFeatures((new GeoJSON()).readFeatures({
                type: 'FeatureCollection',
                crs: {
                    type: 'name',
                    properties: {
                        name: 'EPSG:3857'
                    }
                },
                features: features
            }))
            if(fit){
                this.map.getView().fit(
                    this.foisrc.getExtent()
                );
            }
        }
    }

    componentWillReceiveProps(nextProps){
        const {
            fois,
            foi,
            featureInExtent,
            highlighted,
            editing
        } = nextProps;

        if(_.isString(editing) && editing !== this.props.editing){
            this.enableEditing(editing);
        }

        if(
            _.isString(editing)
            && _.isObject(foi)
            && _.has(foi, 'shape.coordinates')
            && foi.shape.coordinates.length===3
            && (
                !_.isObject(this.state.foi)
                || (
                    !_.isEqual(
                        foi.shape,
                        this.state.foi.shape
                    )
                )
            )
        ){
            this.position.un('changefeature', this.changefeature, this);
            this.position.un('addfeature', this.changefeature, this);
            if(this.centerFeature){
                this.centerFeature.getGeometry().setCoordinates(
                    foi.shape.coordinates
                );
            }else{
                this.centerFeature = new Feature({
                    name: "Center",
                    geometry: new Point(foi.shape.coordinates)
                });
                this.position.addFeature(
                    this.centerFeature
                );
            }
            this.position.on('changefeature', this.changefeature, this);
            this.position.on('addfeature', this.changefeature, this);
        }

        if(!_.isEqual(highlighted, this.props.highlighted)){
            this.foisrc.refresh({force:true});
        }

        if(
            !_.isEqual(fois, this.props.fois)
            || this.foisrc.getFeatures().length !== fois.length
        ){
        // if (fois !== null && fois.length>0 &&
        //         this.foisrc.getFeatures().length === 0){
            // Update Feature of Interest geometries
            this.replaceFois(fois);
        }
    }

    /*
        Calculate which features are visible in actual map extent
        If  moveend prop funtion is present then call it.
    */
    moveEnd(e){
        const { moveend } = this.props;
        var extent = this.map.getView().calculateExtent(this.map.getSize());
        let features = [];
        this.foisrc.forEachFeatureInExtent(extent, function(feature){
            features.push(feature.get('id'));
        });
        this.setState({
            xfois: [
                ...features
            ]
        })
        if(moveend !== undefined){
            moveend(features);
        }
    }

    /*
        Function fired as soon the editing vector source
        is changed.
    */
    changefeature(ev){
        const { changefeature, foi } = this.props;
        let feature = ev.feature;
        let coordinates = feature.getGeometry().getCoordinates();
        if(this.centerFeature==undefined){
            this.centerFeature = feature;
        }
        switch (feature.getGeometry().getType()) {
            case 'Point':
                // Add elevation if not yet added
                if(coordinates.length===2){
                    if(
                        _.has(foi, 'shape.coordinates')
                        && foi.shape.coordinates.length===3
                    ){
                        coordinates.push(foi.shape.coordinates[2]);
                    }else{
                        coordinates.push(0);
                    }
                }
                break;
            default:
        }
        this.setState({
            foi: {
                ...foi,
                shape: {
                    type: feature.getGeometry().getType(),
                    coordinates: coordinates
                }
            }
        }, ()=>{
            // Callback after state is updated
            if (changefeature){
                changefeature(this.state.foi);
            }
        });
        if(ev.type='addfeature'){
            this.disableEditing();
        }
    }

    render() {
        return (
            <div id='map-container' style={{
                width: '100%',
                height: '100%',
                padding: '0px',
                border: 'thin solid #cccccc'
            }}/>
        )
    }
};

Mappa.defaultProps = {
    fois: [],
    isFetching: false,
    highlighted: undefined,
    editing: null,
    foi: undefined
};

Mappa.propTypes = {
    fois: PropTypes.arrayOf(FoiPropTypes),
    isFetching: PropTypes.bool,
    highlighted: PropTypes.arrayOf(PropTypes.number),
    moveend: PropTypes.func,
    changefeature: PropTypes.func,
    // This will enable editing
    editing: PropTypes.oneOf(['Point']),
    // This is the feature of interest to edit
    foi: FoiPropTypes
};

export default Mappa;
