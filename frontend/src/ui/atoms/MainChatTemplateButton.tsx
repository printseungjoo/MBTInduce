import styled from '@emotion/styled'
import { useState } from 'react'

import EditButton from './EditButton'
import DeleteButton from './DeleteButton'
import EditMainChatQuestionTemplate from './EditMainChatQuestionTemplate'

interface MainChatTemplateButtonProps {
    content: string;
    onDelete: () => void;
    onSubmit: (content: string) => void | Promise<void>;
}

const MainChatTemplateButtonStyled = styled.button`
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

export default function MainChatTemplateButton({ content, onDelete, onSubmit }: MainChatTemplateButtonProps) {
    const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

    return(
        <>
            <MainChatTemplateButtonStyled>
                <ContentP> { content } </ContentP>
                <FlexDiv>
                    <EditButton onClick = {() => setIsEditOpen(true)} />
                    <DeleteButton onClick = { onDelete }/>
                </FlexDiv>
            </MainChatTemplateButtonStyled>
            {isEditOpen && <EditMainChatQuestionTemplate onSubmit = { onSubmit }/>}
        </>
    )
}
