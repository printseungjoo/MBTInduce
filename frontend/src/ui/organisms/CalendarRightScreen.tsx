import styled from '@emotion/styled'
import { useState } from 'react'

import Title from '../atoms/Title'
import SelectTime from '../molecules/SelectTime'
import Checkbox from '../atoms/Checkbox'
import GenerateButton from '../atoms/GenerateButton'
import WebsiteIntro from '../atoms/WebsiteIntro'

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
    box-sizing: border-box;
    padding: 1vh 0.5vw;
`;

const GenerateButtonPlus = styled(GenerateButton)`
    margin: 1.2vh 0;
`;

const WebsiteIntroPlus = styled(WebsiteIntro)`
    margin-top: 1.5vh;
`;

export default function CalendarRightScreen({ selectedRange }: CalendarRightScreenProps) {
    const [schedule, setSchedule] = useState('');
    const [selectedOption, setSelectedOption] = useState<DisturbOption | ''>('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    
    function formatDate(date: Date | null) {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    function formatDateTime(date: Date | null, time: string) {
        if (!date) return '';
        const [hours, minutes] = time.split(':').map(Number);
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            hours,
            minutes,
            0,
            0
        ).toISOString();
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

    async function submitSchedule() {
        if (!firstDate || !secondDate) {
            alert('Please select a date.');
            return;
        }
        if (!startTime || !endTime) {
            alert('Please select start or end time.');
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
            startAt: formatDateTime(firstDate, startTime),
            endAt: formatDateTime(secondDate, endTime),
            allDay: false,
            planningNote: selectedOption
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/calendarEvent`, {
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
            setSelectedOption('');
            window.location.reload();
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
            {start && <SelectTime date = { start } onTimeChange = { setStartTime } />}
            {end && <SelectTime date = { end } onTimeChange = { setEndTime } />}
            <SelectTimeP> Click and select the time </SelectTimeP>
            <Title title = 'Schedule' />
            <WriteSchedule value = { schedule } onChange = {(event) => setSchedule(event.target.value)} />
            <div onClick = {() => setSelectedOption('You can disturb')}>
                <Checkbox text = 'You can disturb' checked = {selectedOption === 'You can disturb'} onClick = {() => setSelectedOption('You can disturb')} />
            </div>
            <div onClick = {() => setSelectedOption('Do not disturb whole day')}>
                <Checkbox text = 'Do not disturb whole day' checked = {selectedOption === 'Do not disturb whole day'} onClick = {() => setSelectedOption('Do not disturb whole day')} />
            </div>
            <div onClick = {() => setSelectedOption('Do not disturb only at this time')}>
                <Checkbox text = 'Do not disturb only at this time' checked = {selectedOption === 'Do not disturb only at this time'} onClick = {() => setSelectedOption('Do not disturb only at this time')} />
            </div>
            <GenerateButtonPlus content = 'Submit' onClick = { submitSchedule } />
            <WebsiteIntroPlus content = 'When you ask main chat to make a schedule, it suggests a schedule that avoids it which you recorded on this page. You can adjust the degree of schedule adjustment through the checkbox. You can edit or delete the schedule on the history page.' />
        </>
    )
}