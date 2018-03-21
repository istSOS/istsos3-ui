// *** REDUCERS ***

import config from 'istsos3-core';

import {
    obsPropReducer
} from '../observedProperties/obsPropsState';

const reducers = {
    obsprops: obsPropReducer(config.name)
};

export default reducers;
