import React from 'react';
import { Provider } from 'react-redux';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
    withKnobs,
    text, boolean, number,
    select
} from '@storybook/addon-knobs/react';

import 'react-day-picker/lib/style.css';
import 'ol/ol.css';
import 'semantic-ui-css/semantic.css';

import {
    store,
    setting
} from 'istsos3-core';

import Mappa from '../lib/mappa/mappa';
import FoisMap from '../lib/mappa/foisMap';

import {
    DateInput,
    Sensors,
    Uoms,
    ObservedProperties,
    ObservationTypes,
    SamplingTypes,
    Materials,
    Fois,
    SensorForm,
    FoiForm,
    SpecimenForm,
    ProcessingDetails,
    Humans,
    SamplingMethod
} from '../lib';

storiesOf('List', module)
    .addDecorator(withKnobs)
    .addDecorator(story => <Provider
        store={store}>
        <div style={{
            padding: "2em"
        }}>
            {story()}
        </div>
    </Provider>)
    .add('Sensors', () => (
        <Sensors
            layout='list'/>
    ))
    .add('Uoms', () => (
        <Uoms
            layout={text('Label', 'list')}/>
    ))
    .add('Observed Properties', () => (
        <ObservedProperties
            layout={text('Label', 'list')}/>
    ))
    .add('Observation types', () => (
        <ObservationTypes
            layout={text('Label', 'list')}/>
    ))
    .add('Feature of interests', () => (
        <Fois
            layout={text('Label', 'list')}/>
    ));

storiesOf('Dropdown', module)
    .addDecorator(withKnobs)
    .addDecorator(story => <Provider
        store={store}>
        <div style={{
            padding: "2em"
        }}>
            {story()}
        </div>
    </Provider>)
    .add('Humans', () => (
        <Humans
            layout={text('Label', 'dropdown')}
            onSelected={action('onSelected')}/>
    ))
    .add('Uoms', () => (
        <Uoms
            layout='dropdown'/>
    ))
    .add('Observed Properties', () => (
        <ObservedProperties
            layout={select('Layout', {
                dropdown: 'dropdown',
                mdropdown: 'mdropdown'
            }, 'dropdown')}
            onSelected={action('onSelected')}/>
    ))
    .add('Sampling Types', () => (
        <SamplingTypes
            layout={select('Layout', {
                dropdown: 'dropdown'
            }, 'dropdown')}
            onSelected={action('onSelected')}/>
    ))
    .add('Materials', () => (
        <Materials/>
    ))
    .add('Sampling Methods', () => (
        <SamplingMethod/>
    ))
    .add('Processing details', () => (
        <ProcessingDetails/>
    ));

storiesOf('Date', module)
    .addDecorator(withKnobs)
    .addDecorator(story => <Provider
        store={store}>
        <div style={{
            padding: "2em"
        }}>
            {story()}
        </div>
    </Provider>)
    .add('Date input', () => (
        <DateInput
            onChange={action('date-changed')}/>
    ));

const foiType = {};
foiType[setting._SAMPLING_POINT] = setting._POINT;
// foiType[setting._SAMPLING_CURVE] = setting._CURVE;
// foiType[setting._SAMPLING_SOLID] = setting._SOLID;
// foiType[setting._SAMPLING_SURFACE] = setting._SURFACE;

storiesOf('Forms', module)
    .addDecorator(withKnobs)
    .addDecorator(story => <Provider
        store={store}>
        <div style={{
            padding: "0px 2em",
            height: "900px",
            width: "100%",
            flex: "1 1 0%",
            // display: 'flex',
            // flexDirection: 'row'
        }}>
            {story()}
        </div>
    </Provider>)
    .add('Sensor', () => (
        <SensorForm
            layout={
                select('Layout', [
                    'metadata',
                    'observedproperties'
                ], 'metadata')
            }
            single={boolean("Single obs. prop.", false, 'frm-02-01')}
            onChange={action('sensor-onChange')}/>))
    .add('Feature of interest', () => (
        <FoiForm
            onChange={action('foi-onChange')}
            foiType={
                select('foiType', [
                    null,
                    setting._SAMPLING_POINT,
                    setting._SAMPLING_CURVE,
                    setting._SAMPLING_SOLID,
                    setting._SAMPLING_SURFACE
                ], null, 'frm-02-02')
            }/>
        ))
    .add('Feature of interest (with map)', () => (
        <FoiForm
            showMap={true}
            onChange={action('foim-onChange')}
            foiType={setting._SAMPLING_POINT}/>
        ))
    .add('Specimen Metadata', () => (
        <SpecimenForm
            layout={
                select('Layout', [
                    'metadata',
                    'processing',
                    'both',
                    'template'
                ], 'metadata')
            }
            onChange={action('specimen-onChange')}/>
        ))
    .add('Specimen Processing w/o time', () => (
        <SpecimenForm
            layout='processing'
            hidden={['time']}
            onChange={action('specimen-onChange')}/>
        ));

storiesOf('Maps', module)
    .addDecorator(withKnobs)
    .addDecorator(story => <Provider
        store={store}>
        <div style={{
            padding: "0px 2em"
        }}>
            {story()}
        </div>
    </Provider>)
    .add('Simple', () => (<Mappa/>))
    .add('With fois', () => (
        <FoisMap/>))
    .add('Edit Point', () => (
        <Mappa
            fois={[]}
            editing='Point'
            foi={{
                shape: {
                    type: 'Point',
                    coordinates: []
                }
            }}
            changefeature={action('changefeature')}
            addfeature={action('addfeature')}/>));
