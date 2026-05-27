import styled from '@emotion/styled'
import { useState } from 'react'

import GenerateButton from '../atoms/GenerateButton'
import MakeNewMainChatModal from './MakeNewMainChatModal'
import CenterPurpleP from '../atoms/CenterPurpleP'
import GoBackButton from '../atoms/GoBackButton'
import OldMainChatModal from './OldMainChatModal'

interface InitialMainChatModalProps {
    onConfirm: () => void;
    onSelectHistory: (history: ChatSession) => void;
}

interface ChatSession {
    id: string;
    userId: string;
    title: string | null;
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;
    _count?: {
        messages: number;
    };
}

const InitialMainChatModalStyled = styled.div`
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

export default function InitialMainChatModal({ onConfirm, onSelectHistory }: InitialMainChatModalProps) {
    const [showNew, setShowNew] = useState(false);
    const [showOld, setShowOld] = useState(false);
    const goToMakeNewMainChatModal = () => {
        setShowNew(true);
    };
    if (showNew) {
        return <MakeNewMainChatModal onSubmitSuccess = {(session) => {
            setShowNew(false);
            onSelectHistory(session);
            onConfirm();
        }} />;
    }
    const goToOldMainChatModal = () => {
        setShowOld(true);
    };
    if (showOld) {
        return <OldMainChatModal onConfirm = { onConfirm } onSelectHistory = { onSelectHistory } /> 
    }

    return (
        <InitialMainChatModalStyled>
            <CenterBox>
                <GenerateButton content = 'Make new' onClick = { goToMakeNewMainChatModal } />
                <GenerateButton content = 'Bringing up old main chats' onClick = { goToOldMainChatModal } />
                <CenterPurpleP content = 'You can input a question and select specific MBTI traits to influence the AI response. You can control the influence percentage of each trait using a slider.' />
                <GoBackButton />
            </CenterBox>
        </InitialMainChatModalStyled>
    )
}