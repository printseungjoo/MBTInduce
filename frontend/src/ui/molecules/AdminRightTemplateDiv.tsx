import styled from '@emotion/styled'
import { useState, useEffect } from 'react'

import { apiFetch, getApiErrorMessage } from '../../api/client'
import type { Template } from '../../types/template'
import MainChatTemplateButton from '../atoms/MainChatTemplateButton'
import SimulationTemplateButton from '../atoms/SimulationTemplateButton'
import Skeleton from '../atoms/Skeleton'

interface AdminRightTemplateDivProps {
    page: 'main' | 'simulation';
}

const PANEL = {
    main: {
        title: 'Main Chat Question Template',
        path: '/api/admin/main-chat-question-templates',
        category: 'MAIN_CHAT',
        Button: MainChatTemplateButton
    },
    simulation: {
        title: 'Simulation Question Template',
        path: '/api/admin/simulation-question-templates',
        category: 'SIMULATION',
        Button: SimulationTemplateButton
    }
} as const

const AdminRightTemplateDivStyled = styled.div`
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

const TemplateStatus = styled.p`
    color: ${({ theme }) => theme.colors.paleLavender};
    text-align: center;
    padding: 1.2vh 1%;
    font-weight: bold;
`;

const TemplateRetry = styled.button`
    display: block;
    margin: 0 auto 1vh;
    background-color: ${({ theme }) => theme.colors.paleLavender};
    color: ${({ theme }) => theme.colors.dustyPurple};
    border-radius: 5px;
    height: 3vh;
    padding: 0 0.8vw;
    font-weight: bolder;
`;

const TemplateSkeletonWrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.8vh;
    padding: 1vh 1%;
`;

export default function AdminRightTemplateDiv({ page }: AdminRightTemplateDivProps) {
    const { title, path, category, Button } = PANEL[page];
    const [templates, setTemplates] = useState<Template[]>([]);
    const [content, setContent] = useState<string>('');
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

    async function getTemplates() {
        setStatus('loading');
        try {
            const data = await apiFetch<{ data: Template[] }>(path);
            setTemplates(data.data);
            setStatus('ready');
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    }

    async function postTemplates() {
        try {
            await apiFetch(path, {
                method: 'POST',
                body: {
                    title: content.trim(),
                    content: content.trim(),
                    category,
                    isActive: true
                }
            });
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    }

    async function deleteTemplate(id: string) {
        try {
            await apiFetch(`${path}/${id}`, {
                method: 'DELETE'
            });
            alert(page === 'main' ? 'Main chat question template deleted successfully.' : 'Simulation question template deleted successfully.');
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert(getApiErrorMessage(error, 'Server connection failed.'));
        }
    }

    async function patchTemplate(id: string, changedContent: string) {
        try {
            await apiFetch(`${path}/${id}`, {
                method: 'PATCH',
                body: {
                    content: changedContent
                }
            });
            window.alert('It is successfully changed.');
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getTemplates();
    }, [page])

    return(
        <AdminRightTemplateDivStyled>
            <PurpleP> { title } </PurpleP>
            <Templates>
                {status === 'loading' && (
                    <TemplateSkeletonWrap>
                        <Skeleton height = '2.4rem' />
                        <Skeleton height = '2.4rem' />
                    </TemplateSkeletonWrap>
                )}
                {status === 'error' && (
                    <>
                        <TemplateStatus> Could not load templates. </TemplateStatus>
                        <TemplateRetry type = "button" onClick = { getTemplates }> Try again </TemplateRetry>
                    </>
                )}
                {status === 'ready' && templates.length === 0 && (
                    <TemplateStatus> There is no template left </TemplateStatus>
                )}
                {status === 'ready' && templates.map((t) => {
                    return <Button key = { t.id } content = { t.content } onDelete = {() => deleteTemplate(t.id)} onSubmit = {(changedContent) => patchTemplate(t.id, changedContent)} />
                })}
            </Templates>
            <FlexDiv>
                <InputBox onChange = {(e) => setContent(e.target.value)} />
                <AddButton onClick = { postTemplates }> Add </AddButton>
            </FlexDiv>
        </AdminRightTemplateDivStyled>
    )
}
