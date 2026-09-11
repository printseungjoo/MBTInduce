import styled from '@emotion/styled'
import { useState } from 'react'

import { apiFetch } from '../../api/client'
import CenterPurpleP from './CenterPurpleP'
import GoBacktoAdminButton from './GoBacktoAdminButton'
import Modal from '../molecules/Modal'

interface EditSimulationQuestionTemplateProps {
    id: string;
}

const SimulationQuestionTemplateTextArea = styled.textarea`
    width: 98%;
    height: 20vh;
    resize: none;
    overflow-y: auto;
    box-sizing: border-box;
    padding: 1.5vh 1vw;
    background-color: ${({ theme }) => theme.colors.brightWhite};
    color: ${({ theme }) => theme.colors.lightWhite};

    @media screen and (max-width: 767px) {
        padding: 0.8vh 2vw;
    }
`;

const SubmitButton = styled.button<{isValid: boolean}>`
    width: 100%;
    min-height: 4vh;
    height: auto;
    font-weight: bolder;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme, isValid }) => isValid ? theme.colors.paleLavender : theme.colors.coolGray};
    border-radius: 0;
    color: ${({ theme }) => theme.colors.deepBlack};
`;

export default function EditSimulationQuestionTemplate({ id }: EditSimulationQuestionTemplateProps) {
    const [changedContent, setChangedContent] = useState<string>('');

    async function patchTemplates(changedContent: string) {
        try {
            await apiFetch(`/api/admin/simulation-question-templates/${id}`, {
                method: 'PATCH',
                body: {
                    content: changedContent
                }
            });
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    }

    const isValid = changedContent.trim() !== '';

    const clickSubmitButton = async () => {
        if (!isValid) return;
        try {
            await patchTemplates(changedContent);
            window.alert('It is successfully changed.')
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Modal onClose = {() => { window.location.reload() }}>
            <CenterPurpleP content = 'If you want to modify the simulation question template, please write down the content here.' />
            <SimulationQuestionTemplateTextArea value = { changedContent} onChange = {(e) => setChangedContent(e.target.value)}/>
            <GoBacktoAdminButton />
            <SubmitButton isValid = { isValid } disabled = { !isValid } onClick = { clickSubmitButton }> Submit </SubmitButton>
        </Modal>
    )
}