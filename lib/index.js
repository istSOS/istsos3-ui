import reducers from './reducers';
import DateInput from './date/dateInput';
import DateRange from './daterange/dateRangeComponent';
// import Mappa from './mappa/mapContainer';
import Mappa from './mappa/mappa';
import FoisMap from './mappa/foisMap';

// Select / Dropdown components
import Uoms from './uoms/uomsContainer';
import ListUoms from './uoms/listUoms';
import Sensors from './sensor/sensors';
import UomsDropdown from './uoms/uomsDropdown';
import SelectObsProp from './observedProperties/selectObsProp';
import DropdownObsProp from './observedProperties/dropdownObsProp';
import ObservedProperties from './observedProperties/observedProperties';
import ListObsProps from './observedProperties/listObsProps';
import ObservationTypes from './observationTypes/observationTypes';
import SamplingTypes from './samplingTypes/samplingTypes';
import Fois from './fois/fois';
import SensorForm from './sensor/form/sensorForm';
import FoiForm from './fois/form/foiForm';
import SpecimenForm from './specimen/form/specimenForm';
import ProcessingDetails from './processingDetails/processingDetails';
import Humans from './humans/humans';
import Materials from './material/materials';
import SamplingMethod from './samplingMethod/samplingMethod';
import config from './config';

// import placeSelected from './mappa/place-selected.png';

module.exports = {
    reducers,
    Uoms,
    ListUoms,
    Sensors,
    UomsDropdown,
    DateInput,
    DateRange,
    Mappa,
    FoisMap,
    SelectObsProp,
    DropdownObsProp,
    ObservedProperties,
    SamplingTypes,
    ListObsProps,
    ObservationTypes,
    Fois,
    SensorForm,
    FoiForm,
    SpecimenForm,
    ProcessingDetails,
    Humans,
    Materials,
    SamplingMethod,

    // Utils
    config
};
