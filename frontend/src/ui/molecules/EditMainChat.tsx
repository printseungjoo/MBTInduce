import styled from '@emotion/styled'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { apiFetch } from '../../api/client'
import CenterPurpleP from '../atoms/CenterPurpleP'
import GoBackButton from '../atoms/GoBackButton'
import Modal from './Modal'

interface EditMainChatProps {
    changedChatId: string;
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

export default function EditMainChat({ changedChatId }: EditMainChatProps) {
    const navigate = useNavigate();
    const [changedChatInfo, setChangedChatInfo] = useState<string>('');

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
        if (!isValid) return;
        try {
            const session = await editChatSession(changedChatId, changedChatInfo);
            if (!session) return;
            window.alert('It is successfully changed.')
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Modal onClose = {() => navigate('/Start')}>
            <CenterPurpleP content = 'If you want to modify the main chat, please write down the content here.' />
            <MainChatTextArea value = { changedChatInfo } onChange = {(e) => setChangedChatInfo(e.target.value)}/>
            <GoBackButton />
            <SubmitButton isValid = { isValid } disabled = { !isValid } onClick = { clickSubmitButton }> Submit </SubmitButton>
        </Modal>
    )
}