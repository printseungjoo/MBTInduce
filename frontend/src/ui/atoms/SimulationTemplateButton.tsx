import styled from '@emotion/styled'
import { useState } from 'react'

import EditButton from './EditButton'
import DeleteButton from './DeleteButton'
import EditSimulationQuestionTemplate from './EditSimulationQuestionTemplate'

interface SimulationTemplateButtonProps {
    content: string;
    onDelete: () => void;
    onSubmit: (content: string) => void | Promise<void>;
}

const SimulationTemplateButtonStyled = styled.button`
    border-top: 1px solid ${({ theme }) => theme.colors.lightWhite};
    border-bottom: 1px solid ${({ theme }) => theme.colors.lightWhite};
    background-color: transparent;
    width: 100%;
    border-radius: 0;
    padding: 1.3vh 1%;
`;

const ContentP = styled.p`
    color: ${({ theme }) => theme.colors.lightWhite};
    text-align: left;
`;

const FlexDiv = styled.div`
    display: flex;
    margin-top: 1vh;
    gap: 0.5vw;
`;

export default function SimulationTemplateButton({ content, onDelete, onSubmit }: SimulationTemplateButtonProps) {
    const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

    return(
        <>
            <SimulationTemplateButtonStyled>
                <ContentP> { content } </ContentP>
                <FlexDiv>
                    <EditButton onClick = {() => setIsEditOpen(true)} />
                    <DeleteButton onClick = { onDelete }/>
                </FlexDiv>
            </SimulationTemplateButtonStyled>
            {isEditOpen && <EditSimulationQuestionTemplate onSubmit = { onSubmit }/>}
        </>
    )
}
