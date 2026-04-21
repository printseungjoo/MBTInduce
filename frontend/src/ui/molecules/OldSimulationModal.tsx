import styled from '@emotion/styled'
import { useState } from 'react'

import GoBackButton from '../atoms/GoBackButton'
import OldSimulationButton from '../atoms/OldSimulationButton'

const OldSimulationModalStyled = styled.div`
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
    width: 50vw;
    background-color: ${({ theme }) => theme.colors.lightWhite};
    border-radius: 1rem;
    padding: 2vh 1vw;
    display: flex;
    flex-direction: column;
    gap: 1.5vh;
`;

const GoToExampleButton = styled.button`
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

// They are dummy data. I will change and update them soon.
export default function OldSimulationModal() {
    const [remove, setRemove] = useState<boolean>(false);

    const removeModal = () => {
        setRemove(true);
    }

    return (
        <>
            {!remove && <OldSimulationModalStyled>
                <CenterBox>
                   <OldSimulationButton targetName = 'Jibeom ' targetMbti = 'ESTJ' scenarioContent = "I'm working on a project with Mr.Jibeom. I have to make a schedule and discuss the agenda at a meeting with him. I want to watch the simulation to see how he'll talk" />
                    <OldSimulationButton targetName = 'Judy ' targetMbti = 'ESFP' scenarioContent = "I fought with Judy. I want to have a simulation how to be okay with Judy again." />
                    <OldSimulationButton targetName = 'Choi ' targetMbti = 'INTP' scenarioContent = "I have a meeting with Mr.Choi next week. I want to take a simulation how I would discuss the agenda." />
                    <GoToExampleButton onClick = { removeModal }> Go to example button </GoToExampleButton>
                    <GoBackButton />
                </CenterBox>
            </OldSimulationModalStyled>}
        </>
    )
}