import styled from '@emotion/styled'
import { useState, useEffect } from 'react'

import MainChatTemplateButton from '../atoms/MainChatTemplateButton'

type TemplateType = {
    id: string;
    title: string;
    content: string;
    category: string;
    isActive: boolean;
}

const AdminRightMainChatDivStyled = styled.div`
    width: 100%;
    height: 25.7vh;
    background-color: ${({ theme }) => theme.colors.dustyPurple};
    border: 1px solid ${({ theme }) => theme.colors.softLavender};
`;

const PurpleP = styled.p`
    color: ${({ theme }) => theme.colors.paleLavender};
    font-size: 1.2rem;
    font-weight: bold;
    padding-left: 1%;
`;

const Templates = styled.div`
    overflow-y: auto;
    height: 16vh;
`;

const FlexDiv = styled.div`
    display: flex;
    gap: 0.5vw;
    align-items: center;
    padding: 1.2vh 1%;
    border-top: 1px solid ${({ theme }) => theme.colors.softLavender};
`;

const InputBox = styled.input`
    background-color: ${({ theme }) => theme.colors.paleLavender};
    border: 1px solid ${({ theme }) => theme.colors.softLavender};
    border-radius: 5px;
    height: 3.5vh;
    width: 84%;
`;

const AddButton = styled.button`
    color: ${({ theme }) => theme.colors.dustyPurple};
    background-color: ${({ theme }) => theme.colors.paleLavender};
    border-radius: 5px;
    height: 3.5vh;
    display: flex;
    align-items: center;
`;

export default function AdminRightMainChatDiv() {
    const [templates, setTemplates] = useState<TemplateType[]>([]);
    const [content, setContent] = useState<string>('');
    const [isClicked, setIsClicked] = useState<boolean>(false);

    async function getTemplates() {
        const response = await fetch('http://localhost:4000/api/admin/main-chat-question-templates', {
            method: 'GET',
            credentials: 'include'
        });
        if(!response.ok) {
            throw new Error('Failed to get main chat question templates');
        }
        const data = await response.json();
        setTemplates(data.data);
    }

    async function postTemplates() {
        try {
            const response = await fetch('http://localhost:4000/api/admin/main-chat-question-templates', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content
                })
            });
            if (!response.ok) {
                throw new Error('Failed to post main chat question templates');
            }
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getTemplates();
    }, [])

    useEffect(() => {
        postTemplates();
    }, [isClicked])

    return(
        <AdminRightMainChatDivStyled>
            <PurpleP> Main Chat Question Template </PurpleP>
            <Templates>
                {templates.map((t) => {
                    return <MainChatTemplateButton id = { t.id } content = { t.content } />
                })}
            </Templates>
            <FlexDiv>
                <InputBox onChange = {(e) => setContent(e.target.value)} />
                <AddButton onClick = {() => setIsClicked(true)}> Add </AddButton>
            </FlexDiv>
        </AdminRightMainChatDivStyled>
    )
}