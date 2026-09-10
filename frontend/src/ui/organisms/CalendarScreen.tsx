import styled from '@emotion/styled'
import { useTheme } from '@emotion/react'
import { Calendar, dateFnsLocalizer, type SlotInfo } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { useState, useEffect } from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import { apiFetch } from '../../api/client'
import type { CalendarDisplayEvent, CalendarEvent, SelectedRange } from '../../types/calendar'

interface CalendarScreenProps {
    selectedRange: SelectedRange;
    setSelectedRange: React.Dispatch<React.SetStateAction<SelectedRange>>;
}

const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales: {} });

const CalendarStyled = styled.div`
    width: 90%;
    height: 85%;
    background-color: ${({ theme }) => theme.colors.lightWhite};
    color-scheme: only light;
    color: ${({ theme }) => theme.colors.deepBlack};

    .rbc-calendar {
        background-color: ${({ theme }) => theme.colors.lightWhite};
    }
    .rbc-month-view {
        background-color: ${({ theme }) => theme.colors.lightWhite};
    }
    .rbc-today {
        background-color: transparent;
    }
    .rbc-toolbar,
    .rbc-header,
    .rbc-date-cell,
    .rbc-button-link,
    .rbc-off-range {
        color: ${({ theme }) => theme.colors.deepBlack};
    }
`;

const InstructionBox = styled.div`
    display: none;

    @media screen and (max-width: 767px) {
        display: block;
        background-color: ${({ theme }) => theme.colors.lightWhite};
        color: ${({ theme }) => theme.colors.deepPlum};
        padding: 1vh 2vw;
        width: 86%;
        font-size: 0.95rem;
        font-weight: 600;
        text-align: center;
    }
`;

const CenterDiv = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 2vh;
`;

export default function CalendarScreen({ selectedRange, setSelectedRange }: CalendarScreenProps) {
    const [events, setEvents] = useState<CalendarDisplayEvent[]>([]);

    useEffect(() => {
        loadCalendarEvents();
    }, []);

    async function loadCalendarEvents() {
        try {
            const result = await apiFetch<{ data: { events: CalendarEvent[] } }>('/api/calendarEvent');
            const calendarEvents: CalendarEvent[] = result.data.events;
            const convertedEvents = calendarEvents.map((event) => ({
                id: event.id,
                title: event.title,
                start: new Date(event.startAt),
                end: new Date(event.endAt),
                allDay: event.allDay,
            }));
            setEvents(convertedEvents);
        } catch (error) {
            console.error(error);
        }
    }

    const { startDate, endDate } = selectedRange;
    const theme = useTheme();
    function normalize(date: Date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
    function isBetween(target: Date, start: Date, end: Date) {
        const t = normalize(target).getTime();
        const s = normalize(start).getTime();
        const e = normalize(end).getTime();
        return t >= Math.min(s, e) && t <= Math.max(s, e);
    }
    function toCalendarDate(date: Date) {
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            12,
            0,
            0,
            0
        );
    }
    function handleSelectSlot(slotInfo: SlotInfo) {
        const clicked = toCalendarDate(slotInfo.slots?.[0] ?? slotInfo.start);
        if (!startDate || endDate) {
            setSelectedRange({ startDate: clicked, endDate: null });
            return;
        }

        setSelectedRange({
            startDate: toCalendarDate(startDate),
            endDate: clicked,
        });
    }
    function dayPropGetter(date: Date) {
        if (!startDate) return {};
        if (!endDate) {
            if (normalize(date).getTime() === normalize(startDate).getTime()) {
                return {
                    style: {backgroundColor: theme.colors.paleLavender}
                };
            }
        }
        if (endDate && isBetween(date, startDate, endDate)) {
            return {
                style: {backgroundColor: theme.colors.paleLavender}
            };
        }
        return {};
    }

    return (
        <CenterDiv>
            <InstructionBox>
                Click twice to set the schedule
            </InstructionBox>
            <CalendarStyled>
                <Calendar localizer = { localizer } selectable onSelectSlot = { handleSelectSlot } dayPropGetter = { dayPropGetter } defaultView = "month" views = {['month']} events = { events } />
            </CalendarStyled>
        </CenterDiv>
    );
}