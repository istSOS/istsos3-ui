import React from 'react';
import PropTypes from 'prop-types';
import DayPicker, { DateUtils } from 'react-day-picker';
import moment from 'moment';
import 'react-day-picker/lib/style.css';

// Semantic UI components
import {
    Input,
    Popup
} from 'semantic-ui-react';

class DateInput extends React.Component {
    constructor(props) {
        super(props);
        this.inputChange = this.inputChange.bind(this);
        this.calendarClick = this.calendarClick.bind(this);
        this.state = {
            value: this.props.value || ''
        };
    }
    inputChange(event){
        const {
            onChange
        } = this.props;
        this.setState({
            value: event.target.value.replace(/[^0-9-]/gi, '')
        }, ()=>{
            if(onChange!==undefined){
                onChange(this.state.value);
            }
        });
    }
    calendarClick(day, { selected }){
        const {
            onChange
        } = this.props;
        this.setState({
            value: moment(day).format("YYYY-MM-DD")
        }, ()=>{
            if(onChange!==undefined){
                onChange(this.state.value);
            }
        });
    }
    render() {
        const {
            value
        } = this.state;
        return (
            <Popup
                trigger={
                    <Input
                        icon='calendar'
                        iconPosition='left'
                        placeholder='YYYY-MM-DD'
                        onChange={this.inputChange}
                        value={value}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"/>
                }
                on='focus'
                position='bottom left'>
                <Popup.Content>
                    <DayPicker
                        showWeekNumbers
                        onDayClick={this.calendarClick}
                        selectedDays={undefined}/>
                </Popup.Content>
            </Popup>
        )
    }
};

DateInput.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func
};

export default DateInput;
