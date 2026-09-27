import styled from '@emotion/styled'
import { useState } from 'react'

import { apiFetch } from '../../api/client'
import CenterPurpleP from '../atoms/CenterPurpleP'
import GoBackButton from '../atoms/GoBackButton'
import LoadingBlock from './LoadingBlock'
import Modal from './Modal'

interface EditMainChatProps {
    changedChatId: string;
    onBack: () => void;
}

const MainChatTextArea = styled.textarea`
    width: 98%;
    height: 20vh;
    resize: none;
    overflow-y: auto;
    box-sizing: border-box;
    padding: 1.5vh 1vw;
    background-color: ${({ theme }) => theme.colors.brightWhite};
    color: ${({ theme }) => theme.colors.deepBlack};
    border: 1px solid ${({ theme }) => theme.colors.paleLavender};

    &:focus {
        border: 1px solid ${({ theme }) => theme.colors.transparent};
        outline: none;
        box-shadow: none;
    }

    @media screen and (max-width: 767px) {
        padding: 0.8vh 2vw;
    }
`;

const SubmitButton = styled.button<{isValid: boolean}>`
    width: 100%;
    min-height: 4.4vh;
    height: 4.4vh;
    padding: 0 1vw;
    font-weight: bolder;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme, isValid }) => isValid ? theme.colors.paleLavender : theme.colors.coolGray};
    border: 1px solid ${({ theme }) => theme.colors.paleLavender};
    border-radius: 8px;
    box-sizing: border-box;
    color: ${({ theme }) => theme.colors.deepBlack};
`;

export default function EditMainChat({ changedChatId, onBack }: EditMainChatProps) {
    const [changedChatInfo, setChangedChatInfo] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    async function editChatSession(targetId: string, changedTitle: string) {
        try {
            const data = await apiFetch<{ session: unknown }>(`/api/chatMessage/sessions/${targetId}`, {
                method: 'PATCH',
                body: {
                    title: changedTitle
                }
            });
            return data.session;
        } catch (error) {
            console.error(error);
        }
    }

    const isValid = changedChatInfo.trim() !== '';

    const clickSubmitButton = async () => {
        if (!isValid || isSubmitting) return;
        setIsSubmitting(true);
        try {
            const session = await editChatSession(changedChatId, changedChatInfo);
            if (!session) {
                setIsSubmitting(false);
                return;
            }
            window.alert('It is successfully changed.')
            window.location.reload();
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
        }
    };

    return (
        <Modal onClose = { isSubmitting ? undefined : onBack }>
            {isSubmitting ? (
                <LoadingBlock message = 'Submitting...' />
            ) : (
                <>
                    <CenterPurpleP content = 'If you want to modify the main chat, please write down the content here.' />
                    <MainChatTextArea value = { changedChatInfo } onChange = {(e) => setChangedChatInfo(e.target.value)}/>
                    <GoBackButton content = 'Go back' onClick = { onBack } />
                    <SubmitButton isValid = { isValid } disabled = { !isValid } onClick = { clickSubmitButton }> Submit </SubmitButton>
                </>
            )}
        </Modal>
    )
}