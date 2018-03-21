import reducers from './reducers';
import DateRange from './daterange/dateRangeComponent';
import Mappa from './mappa/mapContainer';

// Select / Dropdown components
import Uoms from './uoms/uomsContainer';
import ListUoms from './uoms/listUoms';
import SelectObsProp from './observedProperties/selectObsProp';
import DropdownObsProp from './observedProperties/dropdownObsProp';
import ObservedProperties from './observedProperties/observedProperties';
import ListObsProps from './observedProperties/listObsProps';
import ObservationTypes from './observationTypes/observationTypes';
import SamplingTypes from './samplingTypes/samplingTypes';
import Fois from './fois/fois';
import SensorForm from './sensor/form/sensorForm';
import FoiForm from './fois/form/foiForm';
import Humans from './humans/humans';
import config from './config';

module.exports = {
    reducers,
    Uoms,
    ListUoms,
    DateRange,
    Mappa,
    SelectObsProp,
    DropdownObsProp,
    ObservedProperties,
    SamplingTypes,
    ListObsProps,
    ObservationTypes,
    Fois,
    SensorForm,
    FoiForm,
    Humans,

    // Utils
    config
};
