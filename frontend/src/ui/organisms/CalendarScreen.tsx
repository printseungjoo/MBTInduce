import styled from '@emotion/styled'
import { useTheme } from '@emotion/react'
import { Calendar, dateFnsLocalizer, type SlotInfo } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import 'react-big-calendar/lib/css/react-big-calendar.css'

interface SelectedRange {
    startDate: Date | null;
    endDate: Date | null;
}

interface CalendarScreenProps {
    selectedRange: SelectedRange;
    setSelectedRange: React.Dispatch<React.SetStateAction<SelectedRange>>;
}

const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales: {} });

const CalendarStyled = styled.div`
    width: 90%;
    height: 85%;
    background-color: ${({ theme }) => theme.colors.lightWhite};

    .rbc-calendar {
        background-color: ${({ theme }) => theme.colors.lightWhite};
    }
    .rbc-month-view {
        background-color: ${({ theme }) => theme.colors.lightWhite};
    }
    .rbc-today {
        background-color: transparent;
    }
`;

const CenterDiv = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export default function CalendarScreen({ selectedRange, setSelectedRange }: CalendarScreenProps) {
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
    function handleSelectSlot(slotInfo: SlotInfo) {
        const clicked = slotInfo.start;
        if (!startDate || endDate) {
            setSelectedRange({ startDate: clicked, endDate: null });
            return;
        }
        setSelectedRange({
            startDate,
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
            <CalendarStyled>
                <Calendar localizer = { localizer } selectable onSelectSlot = { handleSelectSlot } dayPropGetter = { dayPropGetter } defaultView = "month" views = {['month']} />
            </CalendarStyled>
        </CenterDiv>
    );
}