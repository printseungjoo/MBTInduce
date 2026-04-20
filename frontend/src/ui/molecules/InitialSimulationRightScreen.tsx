import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'

import GenerateButton from '../atoms/GenerateButton'

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
    z-index: 999;
`;

const CenterBox = styled.div`
    width: 400px;
    background-color: ${({ theme }) => theme.colors.lightWhite};
    border-radius: 1rem;
    padding: 2vh 1vw;
    display: flex;
    flex-direction: column;
    gap: 1.5vh;
`;

const PCenter = styled.p`
    text-align: center;
    color: ${({ theme }) => theme.colors.softLavender};
`;

const GoBack = styled.button`
    width: 100%;
    min-height: 4vh;
    height: auto;
    font-weight: bolder;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.coolGray};
    border-radius: 0;
`;

export default function InitialSimulationRightScreen() {
    const navigate = useNavigate();

    const clickGoBack = () => {
        navigate('/MainChat');
    };

    return (
        <InitialSimulationRightScreenStyled>
            <CenterBox>
                <GenerateButton content='Make new' />
                <GenerateButton content='Bringing up old conversations' />
                <PCenter>
                    Users can simulate conversations with a selected MBTI personality. The AI generates dialogue responses as if the selected MBTI personality were participating in the conversation. This feature works like a role-play simulation system.
                </PCenter>
                <GoBack onClick = { clickGoBack }>Go to main page</GoBack>
            </CenterBox>
        </InitialSimulationRightScreenStyled>
    )
}