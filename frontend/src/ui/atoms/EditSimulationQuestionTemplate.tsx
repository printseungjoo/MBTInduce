import styled from '@emotion/styled'
import { useState } from 'react'

import CenterPurpleP from './CenterPurpleP'
import GoBacktoAdminButton from './GoBacktoAdminButton'

interface EditSimulationQuestionTemplateProps {
    id: string;
}

const EditSimulationQuestionTemplateModalStyled = styled.div`
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
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/simulation-question-templates/${id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: changedContent
                })
            });
            if (!response.ok) {
                throw new Error('Failed to patch simulation question template');
            }
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
        <EditSimulationQuestionTemplateModalStyled>
            <CenterBox>
                <CenterPurpleP content = 'If you want to modify the simulation question template, please write down the content here.' />
                <SimulationQuestionTemplateTextArea value = { changedContent} onChange = {(e) => setChangedContent(e.target.value)}/>
                <GoBacktoAdminButton />
                <SubmitButton isValid = { isValid } disabled = { !isValid } onClick = { clickSubmitButton }> Submit </SubmitButton>
            </CenterBox>
        </EditSimulationQuestionTemplateModalStyled>
    )
}