import React from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import moment from 'moment';
import 'react-day-picker/lib/style.css';

// Semantic UI components
import {
    Form,
    Icon,
    Popup,
    List
} from 'semantic-ui-react';

class DateRange extends React.Component {
    constructor(props) {
        super(props);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.handleResetClick = this.handleResetClick.bind(this);
        this.state = this.getInitialState();
    }
    getInitialState() {
        const {
            from,
            to,
            fromMin,
            toMax
        } = this.props;
        return {
            from: from !== undefined? moment(from).toDate(): undefined,
            to: to !== undefined? moment(to).toDate(): undefined,
            fromMin: fromMin,
            toMax: toMax
        };
    }
    handleDayClick(day) {
        const { onRangeSelected } = this.props;
        const range = DateUtils.addDayToRange(day, this.state);
        this.setState(range);
        if(onRangeSelected!==undefined){
            onRangeSelected({
                from: range.from? moment(range.from).format("YYYY-MM-DD"): null,
                to: range.to? moment(range.to).add(1, 'days').format("YYYY-MM-DD"): null
            });
        }
    }
    handleResetClick() {
        this.setState(this.getInitialState());
    }

    componentWillReceiveProps(nextProps) {
        const {
            from,
            to,
            fromMin,
            toMax
        } = nextProps;
        if(from !== this.state.from && to !==  this.state.to){
            this.setState({
                from: from !== undefined? moment(from).toDate(): undefined,
                to: to !== undefined? moment(to).toDate(): undefined,
                fromMin: fromMin,
                toMax: toMax
            });
        }
    }
    get_links(){
        return (
            <List link>
                <List.Item active>Today</List.Item>
                <List.Item as='a'>Yesterday</List.Item>
                <List.Item as='a'>Last 7 days</List.Item>
                <List.Item as='a'>Last 28 days</List.Item>
                <List.Item as='a'>Last 90 days</List.Item>
            </List>
        )
    }
    render() {
        const { from, to } = this.state;
        const {
            asArray,
            disabledDays
        } = this.props;
        const modifiers = { start: from, end: to};
        if (asArray){
            return (
                [
                    <Popup
                        key={"cr-drc-st"}
                        trigger={
                            <Form.Input
                                value={
                                    from?
                                    moment(from).format("YYYY-MM-DD"): ''
                                }
                                error={true}
                                icon={<Icon name='calendar'/>}
                                placeholder='From date' />
                        }
                        on='focus'
                        position='bottom left'>
                        <Popup.Content>
                            <DayPicker
                                firstDayOfWeek={1}
                                showWeekNumbers
                                className="Selectable"
                                numberOfMonths={this.props.numberOfMonths}
                                selectedDays={[from, { from, to }]}
                                modifiers={modifiers}
                                month={from}
                                todayButton="Today"
                                onDayClick={this.handleDayClick}
                                disabledDays={disabledDays}
                            />
                        </Popup.Content>
                    </Popup>,
                    <Popup
                        key={"cr-drc-ed"}
                        trigger={
                            <Form.Input
                                value={
                                    to?
                                    moment(to).format("YYYY-MM-DD"): ''
                                }
                                icon={<Icon name='calendar'/>}
                                placeholder='To date' />
                        }
                        on='focus'
                        position='bottom right'>
                        <Popup.Content>
                            <DayPicker
                                firstDayOfWeek={1}
                                showWeekNumbers
                                className="Selectable"
                                numberOfMonths={this.props.numberOfMonths}
                                selectedDays={[from, { from, to }]}
                                modifiers={modifiers}
                                month={to}
                                onDayClick={this.handleDayClick}
                                disabledDays={disabledDays}
                            />
                        </Popup.Content>
                    </Popup>
                ]
            );
        }
        return (
            <Form.Group widths='equal'>
                <Popup
                    trigger={
                        <Form.Input
                            value={
                                from?
                                moment(from).format("YYYY-MM-DD"): ''
                            }
                            icon={<Icon name='calendar'/>}
                            placeholder='From date' />
                    }
                    on='focus'
                    position='bottom left'
                    flowing>
                    <Popup.Content>
                        <DayPicker
                            firstDayOfWeek={1}
                            showWeekNumbers
                            className="Selectable"
                            numberOfMonths={this.props.numberOfMonths}
                            selectedDays={[from, { from, to }]}
                            modifiers={modifiers}
                            onDayClick={this.handleDayClick}
                            disabledDays={disabledDays}
                        />
                    </Popup.Content>
                </Popup>
                <Popup
                    trigger={
                        <Form.Input
                            value={
                                to?
                                moment(to).format("YYYY-MM-DD"): ''
                            }
                            icon={<Icon name='calendar'/>}
                            placeholder='To date' />
                    }
                    on='focus'
                    position='bottom right'
                    style={{
                        width: '600px'
                    }}>
                    <Popup.Content>
                        <DayPicker
                            firstDayOfWeek={1}
                            showWeekNumbers
                            className="Selectable"
                            numberOfMonths={this.props.numberOfMonths}
                            selectedDays={[from, { from, to }]}
                            modifiers={modifiers}
                            onDayClick={this.handleDayClick}
                            disabledDays={disabledDays}
                        />
                    </Popup.Content>
                </Popup>
            </Form.Group>
        );
    }
}

export default DateRange;
