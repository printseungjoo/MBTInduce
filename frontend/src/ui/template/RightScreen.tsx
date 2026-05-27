import styled from '@emotion/styled'
import { useLocation } from 'react-router-dom'

import MainChatRightScreen from '../organisms/MainChatRightScreen'
import SimulationRightScreen from '../organisms/SimulationRightScreen'
import CalendarRightScreen from '../organisms/CalendarRightScreen'

interface SelectedRange {
    startDate: Date | null;
    endDate: Date | null;
}

interface RightScreenProps {
    eValues: number;
    sValues: number;
    fValues: number;
    pValues: number;
    setEValues: React.Dispatch<React.SetStateAction<number>>;
    setSValues: React.Dispatch<React.SetStateAction<number>>;
    setFValues: React.Dispatch<React.SetStateAction<number>>;
    setPValues: React.Dispatch<React.SetStateAction<number>>;
    selectedScenario: string;
    selectedName: string;
    selectedMbti: string;
    showSimulation: boolean;
    selectedRange: SelectedRange;
    isMobileOpen: boolean;
    onMobileClose: () => void;
}

const RightScreenStyled = styled.div<{ isMobileOpen: boolean }>`
    width: 20%;
    max-width: 20%;
    height: 100vh;
    background-color: ${({ theme }) => theme.colors.deepPlum};
    position: fixed;
    right: 0;
    top: 0;
    box-sizing: border-box;
    padding: 1.5vh 1vw;
    overflow-y: hidden;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;

    & > * {
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        flex-shrink: 0;
    }

    @media screen and (max-width: 767px) {
        width: min(86vw, 22rem);
        max-width: min(86vw, 22rem);
        right: ${({ isMobileOpen }) => isMobileOpen ? '0' : '-100%'};
        padding: 4.5rem 1rem 1rem;
        transition: right 0.3s ease;
        overflow-y: auto;
    }
`;

export default function RightScreen({ eValues, sValues, fValues, pValues, setEValues, setSValues, setFValues, setPValues, selectedScenario, selectedName, selectedMbti, showSimulation, selectedRange, isMobileOpen, onMobileClose }: RightScreenProps) {
    const location = useLocation()

    return(
        <RightScreenStyled isMobileOpen = { isMobileOpen }>
            {(location.pathname === '/MainChat' || location.pathname === '/' ) && (
                <MainChatRightScreen eValues = { eValues } sValues = { sValues } fValues = { fValues } pValues = { pValues } setEValues = { setEValues } setSValues = { setSValues } setFValues = { setFValues } setPValues = { setPValues }/>
            )}
            {location.pathname === '/Simulation' && showSimulation && (
                <SimulationRightScreen selectedScenario = { selectedScenario } selectedName = { selectedName } selectedMbti = { selectedMbti }/>
            )}
            {location.pathname === '/Calendar' && (
                <CalendarRightScreen selectedRange = { selectedRange } />
            )}
        </RightScreenStyled>
    )
}