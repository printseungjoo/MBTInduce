import styled from '@emotion/styled'

import CenterPurpleP from '../atoms/CenterPurpleP'
import GoBackButton from '../atoms/GoBackButton'
import EditOptionButton from '../atoms/EditOptionButton'

interface InitialEditSimulationProps {
    userName: string; 
    userMbti: string; 
    simulationContent: string;
}

const EditMainChatModalStyled = styled.div`
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
    width: 40vw;
    background-color: ${({ theme }) => theme.colors.lightWhite};
    border-radius: 1rem;
    padding: 2vh 1vw;
    display: flex;
    flex-direction: column;
    gap: 1.5vh;
`;

export default function InitialEditSimulation({ userName, userMbti, simulationContent }: InitialEditSimulationProps) {
    return (
        <EditMainChatModalStyled>
            <CenterBox>
                <CenterPurpleP content = 'Click what you want to change' />
                <EditOptionButton content = { userName }/>
                <EditOptionButton content = { userMbti }/>
                <EditOptionButton content = { simulationContent }/>
                <GoBackButton />
            </CenterBox>
        </EditMainChatModalStyled>
    )
}