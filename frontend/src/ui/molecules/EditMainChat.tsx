import styled from '@emotion/styled'
import { useState } from 'react'

import CenterPurpleP from '../atoms/CenterPurpleP'
import GoBackButton from '../atoms/GoBackButton'

interface EditMainChatProps {
    changedChatId: string;
}

const EditMainChatModalStyled = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.4);
    z-index: 3;
`;

const CenterBox = styled.div`
    width: 40vw;
    background-color: ${({ theme }) => theme.colors.lightWhite};
    border-radius: 1rem;
    padding: 2vh 1vw;
    display: flex;
    flex-direction: column;
    gap: 1.5vh;
`;

const MainChatTextArea = styled.textarea`
    width: 98%;
    height: 20vh;
    resize: none;
    overflow-y: auto;
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
`;

export default function EditMainChat({ changedChatId }: EditMainChatProps) {
    const [changedChatInfo, setChangedChatInfo] = useState<string>('');

    async function editChatSession(targetId: string, changedTitle: string) {
        try {
            const response = await fetch(`http://localhost:4000/api/chatMessage/sessions/${targetId}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: changedTitle
                })
            });
            if (!response.ok) {
                throw new Error('Failed to patch chat title');
            }
            const data = await response.json();
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
        <EditMainChatModalStyled>
            <CenterBox>
                <CenterPurpleP content = 'If you want to modify the main chat, please write down the content here.' />
                <MainChatTextArea value = { changedChatInfo } onChange = {(e) => setChangedChatInfo(e.target.value)}/>
                <GoBackButton />
                <SubmitButton isValid = { isValid } disabled = { !isValid } onClick = { clickSubmitButton }> Submit </SubmitButton>
            </CenterBox>
        </EditMainChatModalStyled>
    )
}