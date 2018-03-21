import React, { Component } from 'react';

// istSOS components
import {
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

//import Control from 'ol/control/control';

// Semantic UI components
import { Menu, Button } from 'semantic-ui-react';

class MapComponent extends Component {

    componentDidMount() {
        const {
            edit,
            featureInExtent,
            highlighted
        } = this.props;

        //console.log(highlighted);

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

        /*
        this.map.on("pointerdrag", function(e) {
            console.log(e);
            this.centerFeature.getGeometry().setCoordinates(
                this.map.getView().getCenter()
            );
            this.position.changed();
        }, this);

        this.map.getView().on('change:center', function(e){
            this.centerFeature.getGeometry().setCoordinates(
                this.map.getView().getCenter()
            )
        }, this);

        var element = document.createElement('div');
        element.className = 'centerCtr ol-unselectable ol-control';
        this.centerCtr = new Control({
            element: element
        });
        this.map.addControl(this.centerCtr);
        */


        // Feature of interest layer
        this.fois = new VectorSource();
        this.map.addLayer(new VectorLayer({
            source: this.fois,
            style: this.styleFunction.bind(this)
            // style: function(feature, resolution) {
            //     console.log(feature);
            //     return [new Style({
            //         image: new Icon({
            //             anchor: [0.5, 1],
            //             src: highlighted !== undefined && highlighted.indexOf(feature.get('id'))>-1?
            //                 '/img/place-selected.png': '/img/place.png'
            //         }),
            //         text: new Text({
            //             textAlign: "center",
            //             textBaseline: 'middle',
            //             fill: new Fill({color: 'black'}),
            //             font: '12px sans-serif',
            //             text: feature.get('name'),
            //             offsetY: 8
            //         })
            //     })]
            // }
        }));

        this.map.on('moveend', function(e){
            var extent = this.map.getView().calculateExtent(this.map.getSize());
            let features = [];
            this.fois.forEachFeatureInExtent(extent, function(feature){
                features.push(feature.get('id'));
            });
            featureInExtent(features);
        }, this);

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

        if(edit){
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
        return [
            new Style({
                image: new Icon({
                    anchor: [0.5, 1],
                    src: highlighted !== undefined && highlighted.indexOf(feature.get('id'))>-1?
                        '/img/place-selected.png': '/img/place.png'
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
            /*let fois = this.position.getFeatures();
            if(fois.length>0){
                // Already on map, just change coordinates
                fois[0].getGeometry().setCoordinates([
                    edit.coordinates
                ]);
            }*/
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
            this.fois.refresh({force:true});
        }

        if (fois.data !== null && fois.data.length>0 &&
                this.fois.getFeatures().length === 0){
            // Update Feature of Interest geometries
            let features = [];
            for (let i = 0, l = fois.data.length; i < l; i++) {

                let foi = null;
                if(fois.data[i].hasOwnProperty("shape")){
                    foi = fois.data[i];
                }else if(fois.data[i].hasOwnProperty("sampled_foi")){
                    foi = fois.data[i]['sampled_foi'];
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
                /*
                if(fois.data[i].sampled_foi.shape !== null){
                    features.push({
                        type: 'Feature',
                        properties: {
                            id: fois.data[i].id,
                            name: fois.data[i].name
                        },
                        geometry: fois.data[i].sampled_foi.shape
                    });
                }*/
            }
            this.fois.clear(true);
            this.fois.addFeatures((new GeoJSON()).readFeatures({
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
                this.fois.getExtent()
            );
        }
        /*if (foismap.update.point){
            let fois = this.position.getFeatures();
            if(fois.length>0){
                // Already on map, just change coordinates
                fois[0].getGeometry().setCoordinates([
                    foismap.update.point.x,
                    foismap.update.point.y
                ]);
            }else{
                // Empty, then create a new one
            }
        }*/
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

    getToolbar(){
        const {
            sensorType
        } = this.props;

        let buttons = {};
        buttons[setting._SAMPLING_POINT] = (
            <Menu.Item
                key="ebtn-p"
                onClick={e => {
                    this.addPoint();
                }}>
                    Add Location
            </Menu.Item>
        );
        buttons[setting._SAMPLING_CURVE] = (
            <Menu.Item key="ebtn-c">
                Add Path
            </Menu.Item>
        );
        buttons[setting._SAMPLING_SURFACE] = (
            <Menu.Item key="ebtn-s">
                Add Surface
            </Menu.Item>
        );
        if(sensorType !== undefined){
            buttons = [
                buttons[sensorType.foiType]
            ];
        }else{
            buttons = Object.values(buttons);
        }
        return buttons;
    }

    render() {
        return (
            <div style={{
                    flex: '1 1 0%',
                    width: '100%',
                    height: '100%',
                    border: 'thin solid #cccccc'
                }}>
                {/*<Menu secondary style={{margin: '0px'}}>
                    {this.getToolbar()}
                </Menu>*/}
                <div id='map-container' style={{
                    width: '100%',
                    height: '100%',
                    padding: '0px'
                }}></div>
            </div>
        )
    }
};

export default MapComponent;
