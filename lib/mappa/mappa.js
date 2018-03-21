import React from 'react';
import PropTypes from 'prop-types';

import placePng from './place.png';
import placeSelectedPng from './place-selected.png';
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
    }

    componentDidMount() {
        const {
            edit,
            moveend
        } = this.props;

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

        // Feature of interest layer
        this.foisrc = new VectorSource();
        this.map.addLayer(new VectorLayer({
            source: this.foisrc,
            style: this.styleFunction.bind(this)
        }));

        this.map.on('moveend', function(e){
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
        }, this);

        if(edit){

            // Editing layer
            this.position = new VectorSource();
            const vector = new VectorLayer({
                source: this.position,
                style: new Style({
                    image: new Icon({
                        anchor: [0.5, 1],
                        src: '/img/place.png'
                    })
                })
            });
            this.map.addLayer(vector);

            //position.addFeature(new Feature(new Point([0, 0])));
            this.drawPointInteraction = new Draw({
                type: 'Point',
                source: this.position
            });

            this.modify = new Modify({
                source: this.position
            });

            this.position.on('addfeature', this.geomAdded, this);
            this.position.on('changefeature', this.geomChanged, this);

            if(edit.type==='Point'){
                this.centerFeature = new Feature({
                    name: "Center",
                    geometry: new Point(
                        this.map.getView().getCenter()
                    )
                });
                this.position.addFeature(
                    this.centerFeature
                );
            }
            this.map.addInteraction(this.modify);
        }
    }

    styleFunction(feature, resolution){
        const {
            highlighted
        } = this.props;
        //console.log(feature);
        debugger;
        return [
            new Style({
                image: new Icon({
                    anchor: [0.5, 1],
                    src: highlighted !== undefined && highlighted.indexOf(feature.get('id'))>-1?
                        placeSelectedPng: placePng
                }),
                text: new Text({
                    textAlign: "center",
                    textBaseline: 'middle',
                    fill: new Fill({color: 'black'}),
                    font: '12px sans-serif',
                    text: feature.get('name'),
                    offsetY: 8
                })
            })
        ]
    }

    componentWillUpdate(nextProps, nextState){
        const {
            fois,
            edit,
            featureInExtent,
            highlighted
        } = nextProps;

        if(edit){
            this.position.un('changefeature', this.geomChanged, this);
            this.centerFeature.getGeometry().setCoordinates(
                edit.coordinates
            );
            this.position.on('changefeature', this.geomChanged, this);
        }

        if(
            (highlighted.length !== this.props.highlighted.length)
            || (
                highlighted.length === 1
                    && (
                        highlighted[0] !== this.props.highlighted[0]
                    )
            )
        ){
            //console.log("highlighted");
            this.foisrc.refresh({force:true});
        }

        debugger;
        if (fois !== null && fois.length>0 &&
                this.foisrc.getFeatures().length === 0){
            // Update Feature of Interest geometries
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
            this.foisrc.clear(true);
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
            this.map.getView().fit(
                this.foisrc.getExtent()
            );
        }
    }

    addPoint() {
        this.position.clear(true);
        this.map.removeInteraction(this.modify);
        this.map.addInteraction(
            this.drawPointInteraction
        );
    }

    /*
        Function fired as soon a new feature is added to
        the editing vector source.
    */
    geomAdded(ev){
        const {
            geometryAdded
        } = this.props;
        if (geometryAdded){
            let feature = ev.feature;
            geometryAdded(
                feature.getGeometry().getType(),
                feature.getGeometry().getCoordinates()
            )
        }
        this.map.removeInteraction(this.drawPointInteraction);
        this.map.addInteraction(this.modify);
    }

    /*
        Function fired as soon the editing vector source
        is changed.
    */
    geomChanged(ev){
        const {
            geometryChanged
        } = this.props;
        if (geometryChanged){
            let feature = ev.feature;
            geometryChanged(
                feature.getGeometry().getType(),
                feature.getGeometry().getCoordinates()
            )
        }
    }

    render() {
        return (
            <div style={{
                    flex: '1 1 0%',
                    width: '100%',
                    height: '100%',
                    border: 'thin solid #cccccc'
                }}>
                <div id='map-container' style={{
                    width: '100%',
                    height: '100%',
                    padding: '0px'
                }}></div>
            </div>
        )
    }
};

Mappa.defaultProps = {
    fois: [],
    highlighted: [],
    edit: false,
};

Mappa.propTypes = {
    fois: PropTypes.arrayOf(FoiPropTypes),
    highlighted: PropTypes.arrayOf(FoiPropTypes),
    edit: PropTypes.boolean,
    moveend: PropTypes.func
};

export default Mappa;
