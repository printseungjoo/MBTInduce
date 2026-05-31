import styled from '@emotion/styled'
import { useState } from 'react'

import CenterPurpleP from '../atoms/CenterPurpleP'
import GoBackButton from '../atoms/GoBackButton'
import SelectTime from './SelectTime'

interface EditScheduleProps {
    content: string;
    target: string;
    id: string;
}

const EditScheduleModalStyled = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3;
`;

const CenterBox = styled.div`
    width: min(90vw, 36rem);
    max-height: 85vh;
    overflow-y: auto;
    background-color: ${({ theme }) => theme.colors.lightWhite};
    border-radius: 1rem;
    padding: 2vh 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5vh;
    box-sizing: border-box;

    @media screen and (min-width: 768px) {
        width: 30vw;
        padding: 2vh 1vw;
    }
`;

const ScheduleTextArea = styled.textarea`
    width: 98%;
    height: 20vh;
    resize: none;
    overflow-y: auto;
    box-sizing: border-box;
    padding: 1.5vh 1vw;

    @media screen and (max-width: 767px) {
        padding: 0.8vh 2vw;
    }
`;

const SubmitButton = styled.button<{isValid: boolean}>`
    width: 100%;
    min-height: 4vh;
    height: auto;
    font-weight: bolder;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme, isValid }) => isValid ? theme.colors.paleLavender : theme.colors.coolGray};
    border-radius: 0;
`;

export default function EditSchedule({ target, id }: EditScheduleProps) {
    const [changedContent, setChangedContent] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');

    async function editTitle(title: string) {
        try {
            const response = await fetch(`${import.meta.env.API_BASE_URL}/api/calendarEvent/${id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: title
                })
            });
            if (!response.ok) {
                throw new Error('Failed to patch schedule title');
            }
            const data = await response.json();
            return data.session;
        } catch (error) {
            console.error(error);
        }
    }

    async function editStart(start: Date | string) {
        try {
            const response = await fetch(`${import.meta.env.API_BASE_URL}/api/calendarEvent/${id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    startAt: start instanceof Date ? start.toISOString() : start
                })
            });
            if (!response.ok) {
                throw new Error('Failed to patch start schedule');
            }
            const data = await response.json();
            return data.session;
        } catch (error) {
            console.error(error);
        }
    }

    async function editEnd(end: Date | string) {
        try {
            const response = await fetch(`${import.meta.env.API_BASE_URL}/api/calendarEvent/${id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    endAt: end instanceof Date ? end.toISOString() : end
                })
            });
            if (!response.ok) {
                throw new Error('Failed to patch end schedule');
            }
            const data = await response.json();
            return data.session;
        } catch (error) {
            console.error(error);
        }
    }

    const isValid = target === 'title' ? changedContent.trim() !== '' : selectedDate !== '' && selectedTime !== '';

    function makeDateTime(date: string, time: string) {
        return `${date}T${time}:00`;
    }

    const clickSubmitButton = async () => {
        if (!isValid) return;
        try {
            if (target === 'title') {
                await editTitle(changedContent);
            } else if (target === 'start') {
                await editStart(makeDateTime(selectedDate, selectedTime));
            } else if (target === 'end') {
                await editEnd(makeDateTime(selectedDate, selectedTime));
            }
            window.alert('It is successfully changed.')
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <EditScheduleModalStyled>
            <CenterBox>
                <CenterPurpleP content = 'If you want to modify what you selected, please write down the content here.' />
                {target === 'title' ? (<ScheduleTextArea value = { changedContent } onChange={(e) => setChangedContent(e.target.value)}/>
                ) : (<input type = "date" value = { selectedDate } onChange = {(e) => setSelectedDate(e.target.value)}/>)}
                {selectedDate && (<SelectTime date = { selectedDate } onTimeChange = { setSelectedTime } showDateLabel = { false }/>)}
                <GoBackButton />
                <SubmitButton isValid = { isValid } disabled = { !isValid } onClick = { clickSubmitButton }> Submit </SubmitButton>
            </CenterBox>
        </EditScheduleModalStyled>
    )
}