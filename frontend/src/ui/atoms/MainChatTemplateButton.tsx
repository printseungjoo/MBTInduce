import styled from '@emotion/styled'
import { useState } from 'react'

import { apiFetch, getApiErrorMessage } from '../../api/client'
import EditButton from './EditButton'
import DeleteButton from './DeleteButton'
import EditMainChatQuestionTemplate from './EditMainChatQuestionTemplate'

interface MainChatTemplateButtonProps {
    id: string;
    content: string;
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

export default function MainChatTemplateButton({ id, content }: MainChatTemplateButtonProps) {
    const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
    
    async function deleteTemplates() {
        try {
            await apiFetch(`/api/admin/main-chat-question-templates/${id}`, {
                method: 'DELETE',
            });
            alert('Main chat question template deleted successfully.');
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert(getApiErrorMessage(error, 'Server connection failed.'));
        }
    }

    return(
        <>
            <MainChatTemplateButtonStyled>
                <ContentP> { content } </ContentP>
                <FlexDiv>
                    <EditButton onClick = {() => setIsEditOpen(true)} />
                    <DeleteButton onClick = {() => deleteTemplates()}/>
                </FlexDiv>
            </MainChatTemplateButtonStyled>
            {isEditOpen && <EditMainChatQuestionTemplate id = { id }/>}
        </>
    )
}