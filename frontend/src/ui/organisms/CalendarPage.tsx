import styled from '@emotion/styled'
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import type { SelectedRange } from '../../types/calendar'
import type { AppShellOutletContext } from '../template/AppShell'
import { AppShellPortal } from '../template/AppShellPortal'
import RightScreen from '../template/RightScreen'
import CalendarScreen from './CalendarScreen'
import CalendarRightScreen from './CalendarRightScreen'

const CalendarModalOverlay = styled.div`
    display: none;

    @media screen and (max-width: 767px) {
        position: fixed;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 20;
    }
`;

const CalendarModalContent = styled.div`
    position: relative;
    width: min(28rem, 90vw);
    max-height: 90vh;
    overflow-y: auto;
    background-color: ${({ theme }) => theme.colors.deepPlum};
    padding: 2rem;
    border-radius: 0.75rem;
    box-sizing: border-box;
    margin-top: 2rem;
`;

const CalendarModalCloseButton = styled.button`
    position: absolute;
    top: 0.8rem;
    right: 0.9rem;
    width: 2rem;
    height: 2rem;
    border: none;
    background: transparent;
    color: ${({ theme }) => theme.colors.lightWhite};
    font-size: 1.5rem;
    font-weight: 700;
    cursor: pointer;
    line-height: 1;
    display: flex;
    align-items: center;
`;

export default function CalendarPage() {
    const { isMobileRightOpen } = useOutletContext<AppShellOutletContext>();
    const [selectedRange, setSelectedRange] = useState<SelectedRange>({
        startDate: null,
        endDate: null
    });

    function clearSelectedRange() {
        setSelectedRange({ startDate: null, endDate: null });
    }

    return (
        <>
            <CalendarScreen selectedRange = { selectedRange } setSelectedRange = { setSelectedRange } />
            <RightScreen isMobileOpen = { isMobileRightOpen }>
                <CalendarRightScreen selectedRange = { selectedRange } />
            </RightScreen>
            {selectedRange.startDate && selectedRange.endDate && (
                <AppShellPortal>
                    <CalendarModalOverlay onClick = { clearSelectedRange }>
                        <CalendarModalContent onClick = {(event) => event.stopPropagation()}>
                            <CalendarModalCloseButton type = "button" onClick = { clearSelectedRange }> x </CalendarModalCloseButton>
                            <CalendarRightScreen selectedRange = { selectedRange } />
                        </CalendarModalContent>
                    </CalendarModalOverlay>
                </AppShellPortal>
            )}
        </>
    );
}
