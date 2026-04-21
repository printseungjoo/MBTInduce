import styled from '@emotion/styled'
import { useState } from 'react'

import GenerateButton from '../atoms/GenerateButton'
import MakeNewSimulationModal from './MakeNewSimulationModal'
import CenterPurpleP from '../atoms/CenterPurpleP'
import GoBackButton from '../atoms/GoBackButton'
import OldSimulationModal from './OldSimulationModal'

const InitialSimulationRightScreenStyled = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.4);
    z-index: 3;
`;

const CenterBox = styled.div`
    width: 30vw;
    background-color: ${({ theme }) => theme.colors.lightWhite};
    border-radius: 1rem;
    padding: 2vh 1vw;
    display: flex;
    flex-direction: column;
    gap: 1.5vh;
`;

export default function InitialSimulationRightScreen() {
    const [showNew, setShowNew] = useState(false);
    const [showOld, setShowOld] = useState(false);
    const goToMakeNewSimulationRightScreen = () => {
        setShowNew(true);
    };
    if (showNew) {
        return <MakeNewSimulationModal />;
    }
    const goToOldSimulationRightScreen = () => {
        setShowOld(true);
    };
    if (showOld) {
        return <OldSimulationModal />
    }

    return (
        <InitialSimulationRightScreenStyled>
            <CenterBox>
                <GenerateButton content = 'Make new' onClick = { goToMakeNewSimulationRightScreen } />
                <GenerateButton content = 'Bringing up old conversations' onClick = { goToOldSimulationRightScreen } />
                <CenterPurpleP content = ' Users can simulate conversations with a selected MBTI personality. The AI generates dialogue responses as if the selected MBTI personality were participating in the conversation. This feature works like a role-play simulation system.' />
                <GoBackButton />
            </CenterBox>
        </InitialSimulationRightScreenStyled>
    )
}