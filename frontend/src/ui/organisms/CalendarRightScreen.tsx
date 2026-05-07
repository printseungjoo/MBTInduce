import styled from '@emotion/styled'
import { useState } from 'react'

import Title from '../atoms/Title'
import SelectTime from '../molecules/SelectTime'
import Checkbox from '../atoms/Checkbox'
import GenerateButton from '../atoms/GenerateButton'
import ScheduleButton from '../atoms/ScheduleButton'

interface SelectedRange {
    startDate: Date | null;
    endDate: Date | null;
}

interface CalendarRightScreenProps {
    selectedRange: SelectedRange;
}

type DisturbOption = 'You can disturb' | 'Do not disturb whole day' | 'Do not disturb only at this time';

const SelectTimeP = styled.p`
    color: ${({ theme }) => theme.colors.lightWhite};
    font-size: 0.85rem;
    margin-bottom: 1vh;
`;

const WriteSchedule = styled.textarea`
    width: 100%;
    height: 10vh;
    background-color: ${({ theme }) => theme.colors.mutedViolet};
    color: ${({ theme }) => theme.colors.lightWhite};
    resize: none;
    overflow-y: auto;
    margin-top: 1.5vh;
    margin-bottom: 1.5vh;
`;

const PurpleDiv = styled.div`
    height: 22vh;
    background-color: ${({ theme }) => theme.colors.royalPurple};
    margin: 2vh 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;

    &::-webkit-scrollbar-track {
        background: transparent;
    }
`;

const GenerateButtonPlus = styled(GenerateButton)`
    margin: 1.2vh 0;
`;

// They are dummy data. I will change and update them soon.
export default function CalendarRightScreen({ selectedRange }: CalendarRightScreenProps) {
    const [schedule, setSchedule] = useState('');
    const [selectedOption, setSelectedOption] = useState<DisturbOption | null>(null);
    
    function formatDate(date: Date | null) {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    function getOrderedDates(startDate: Date | null, endDate: Date | null) {
        if (!startDate) {
            return {
                firstDate: null,
                secondDate: null
            };
        }
        if (!endDate) {
            return {
                firstDate: startDate,
                secondDate: startDate
            };
        }
        if (startDate.getTime() <= endDate.getTime()) {
            return {
                firstDate: startDate,
                secondDate: endDate
            };
        }
        return {
            firstDate: endDate,
            secondDate: startDate
        };
    }
    function getEndDate(date: Date) {
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        return endDate;
    }
    
    async function submitSchedule() {
        if (!firstDate || !secondDate) {
            alert('Please select a date.');
            return;
        }
        if (!schedule.trim()) {
            alert('Please write a schedule.');
            return;
        }
        if (!selectedOption) {
            alert('Please select one checkbox.');
            return;
        }
        const requestBody = {
            title: schedule,
            description: selectedOption,
            startAt: firstDate.toISOString(),
            endAt: getEndDate(secondDate).toISOString(),
            allDay: selectedOption,
            planningNote: selectedOption
        };
        try {
            const response = await fetch('http://localhost:4000/api/calendarEvent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(requestBody)
            });
            const data = await response.json();
            if (!response.ok) {
                alert(data.message || 'Failed to submit schedule.');
                return;
            }
            alert('Schedule submitted successfully.');
            setSchedule('');
            setSelectedOption(null);
        } catch (error) {
            console.error(error);
            alert('Server connection failed.');
        }
    }
    const { firstDate, secondDate } = getOrderedDates(
        selectedRange.startDate,
        selectedRange.endDate
    );
    const start = formatDate(firstDate);
    const end = formatDate(secondDate);

    return(
        <>
            <Title title = 'Time' />
            {start && <SelectTime date = { start } />}
            {end && <SelectTime date = { end } />}
            <SelectTimeP> Click and select the time </SelectTimeP>
            <Title title = 'Schedule' />
            <WriteSchedule value = { schedule } onChange = {(event) => setSchedule(event.target.value)} />
            <div onClick = {() => setSelectedOption('You can disturb')}>
                <Checkbox text = 'You can disturb' />
            </div>
            <div onClick = {() => setSelectedOption('Do not disturb whole day')}>
                <Checkbox text = 'Do not disturb whole day' />
            </div>
            <div onClick = {() => setSelectedOption('Do not disturb only at this time')}>
                <Checkbox text = 'Do not disturb only at this time' />
            </div>
            <GenerateButtonPlus content = 'Submit' onClick = { submitSchedule } />
            <PurpleDiv>
                <ScheduleButton schedule = 'Late Same Night Event' date = '04/17/2015' startTime = '9pm' endTime = '10pm' />
                <ScheduleButton schedule = 'Late Same Night Event' date = '04/17/2015' startTime = '9pm' endTime = '10pm' />
                <ScheduleButton schedule = 'Late Same Night Event' date = '04/17/2015' startTime = '9pm' endTime = '10pm' />
            </PurpleDiv>
            <GenerateButtonPlus content = 'Delete' />
        </>
    )
}