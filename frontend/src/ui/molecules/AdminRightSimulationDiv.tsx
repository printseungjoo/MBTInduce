import styled from '@emotion/styled'
import { useState, useEffect } from 'react'

import SimulationTemplateButton from '../atoms/SimulationTemplateButton'

type TemplateType = {
    id: string;
    content: string;
    category: string;
    isActive: boolean;
}

const AdminRightSimulationDivStyled = styled.div`
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
    box-sizing: border-box;
    padding: 0 0.5vw;

    @media screen and (max-width: 767px) {
        padding: 0 1.5vw;
    }
`;

const AddButton = styled.button`
    color: ${({ theme }) => theme.colors.dustyPurple};
    background-color: ${({ theme }) => theme.colors.paleLavender};
    border-radius: 5px;
    height: 3.5vh;
    display: flex;
    align-items: center;
`;

export default function AdminRightSimulationDiv() {
    const [templates, setTemplates] = useState<TemplateType[]>([]);
    const [content, setContent] = useState<string>('');

    async function getTemplates() {
        const response = await fetch(`${import.meta.env.API_BASE_URL}/api/admin/simulation-question-templates`, {
            method: 'GET',
            credentials: 'include'
        });
        if(!response.ok) {
            throw new Error('Failed to get simulation question templates');
        }
        const data = await response.json();
        setTemplates(data.data);
    }

    async function postTemplates() {
        try {
            const response = await fetch(`${import.meta.env.API_BASE_URL}/api/admin/simulation-question-templates`, {
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
                throw new Error('Failed to post simulation question templates');
            }
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getTemplates();
    }, [])

    return(
        <AdminRightSimulationDivStyled>
            <PurpleP> Simulation Question Template </PurpleP>
            <Templates>
                {templates.map((t) => {
                    return <SimulationTemplateButton id = { t.id } content = { t.content } />
                })}
            </Templates>
            <FlexDiv>
                <InputBox onChange = {(e) => setContent(e.target.value)} />
                <AddButton onClick = { postTemplates }> Add </AddButton>
            </FlexDiv>
        </AdminRightSimulationDivStyled>
    )
}