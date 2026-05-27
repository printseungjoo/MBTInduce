import styled from '@emotion/styled'

import CenterPurpleP from '../atoms/CenterPurpleP'
import GoBackButton from '../atoms/GoBackButton'
import EditOptionButton from '../atoms/EditOptionButton'

type EditTarget = 'userName' | 'userMbti' | 'simulationContent';

interface InitialEditSimulationProps {
    userName: string; 
    userMbti: string; 
    simulationContent: string;
    simulationId: string;
    onSelectEditTarget: (target: EditTarget, content: string, id: string) => void;
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

export default function InitialEditSimulation({ userName, userMbti, simulationContent, simulationId, onSelectEditTarget }: InitialEditSimulationProps) {
    return (
        <EditMainChatModalStyled>
            <CenterBox>
                <CenterPurpleP content = 'Click what you want to change' />
                <EditOptionButton content = { userName } onSelect = { onSelectEditTarget } target = 'userName' id = { simulationId }/>
                <EditOptionButton content = { userMbti } onSelect = { onSelectEditTarget } target = 'userMbti' id = { simulationId }/>
                <EditOptionButton content = { simulationContent } onSelect = { onSelectEditTarget } target = 'simulationContent' id = { simulationId }/>
                <GoBackButton />
            </CenterBox>
        </EditMainChatModalStyled>
    )
}