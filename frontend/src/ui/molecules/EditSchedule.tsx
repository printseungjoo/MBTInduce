import styled from '@emotion/styled'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { apiFetch } from '../../api/client'
import CenterPurpleP from '../atoms/CenterPurpleP'
import GoBackButton from '../atoms/GoBackButton'
import SelectTime from './SelectTime'
import Modal from './Modal'

interface EditScheduleProps {
    content: string;
    target: string;
    id: string;
}

const ScheduleTextArea = styled.textarea`
    width: 98%;
    height: 20vh;
    resize: none;
    overflow-y: auto;
    box-sizing: border-box;
    padding: 1.5vh 1vw;
    background-color: ${({ theme }) => theme.colors.brightWhite};
    color: ${({ theme }) => theme.colors.deepBlack};

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
    const navigate = useNavigate();
    const [changedContent, setChangedContent] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');

    async function editTitle(title: string) {
        try {
            const data = await apiFetch<{ session: unknown }>(`/api/calendarEvent/${id}`, {
                method: 'PATCH',
                body: {
                    title: title
                }
            });
            return data.session;
        } catch (error) {
            console.error(error);
        }
    }

    async function editStart(start: Date | string) {
        try {
            const data = await apiFetch<{ session: unknown }>(`/api/calendarEvent/${id}`, {
                method: 'PATCH',
                body: {
                    startAt: start instanceof Date ? start.toISOString() : start
                }
            });
            return data.session;
        } catch (error) {
            console.error(error);
        }
    }

    async function editEnd(end: Date | string) {
        try {
            const data = await apiFetch<{ session: unknown }>(`/api/calendarEvent/${id}`, {
                method: 'PATCH',
                body: {
                    endAt: end instanceof Date ? end.toISOString() : end
                }
            });
            return data.session;
        } catch (error) {
            console.error(error);
        }
    }

    const isValid = target === 'title' ? changedContent.trim() !== '' : selectedDate !== '' && selectedTime !== '';

    function makeDateTime(date: string, time: string) {
        const [year, month, day] = date.split('-').map(Number);
        const [hours, minutes] = time.split(':').map(Number);
        return new Date(
            year,
            month - 1,
            day,
            hours,
            minutes,
            0,
            0
        ).toISOString();
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
        <Modal onClose = {() => navigate('/Start')}>
            <CenterPurpleP content = 'If you want to modify what you selected, please write down the content here.' />
            {target === 'title' ? (<ScheduleTextArea value = { changedContent } onChange={(e) => setChangedContent(e.target.value)}/>
            ) : (<input type = "date" value = { selectedDate } onChange = {(e) => setSelectedDate(e.target.value)}/>)}
            {selectedDate && (<SelectTime date = { selectedDate } onTimeChange = { setSelectedTime } showDateLabel = { false }/>)}
            <GoBackButton />
            <SubmitButton isValid = { isValid } disabled = { !isValid } onClick = { clickSubmitButton }> Submit </SubmitButton>
        </Modal>
    )
}