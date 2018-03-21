import config from '../config';

export function obsPropReducer(reducerName = config.name){
    const initialState = {
        isFetching: false,
        rtime: 0, // fetch time
        fcnt: 0, // fetch counter
        dlen: 0, // data counter
        data: []
    };
    return function obsprops(state = initialState, action) {
        const {name} = action;
        if(name !== reducerName){
            return state;
        };
        switch (action.type) {
            case 'FETCH_OBSERVABLE_PROPERTIES':
                return {
                    ...initialState,
                    rtime: (
                        new Date()
                    ).getTime(),
                    isFetching: true
                };
            case 'FETCH_OBSERVATIONS_OK':{
                let len = action.json.data.length;
                return {
                    fcnt: (state.fcnt + 1),
                    dlen: len,
                    isFetching: false,
                    rtime: (
                        new Date()
                    ).getTime() - state.rtime,
                    data: action.json.data
                };
            }
            default:
                return state;
        }
    }
};
