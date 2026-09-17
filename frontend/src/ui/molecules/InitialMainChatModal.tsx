import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { ChatSession } from '../../types/chat'
import GenerateButton from '../atoms/GenerateButton'
import MakeNewMainChatModal from './MakeNewMainChatModal'
import CenterPurpleP from '../atoms/CenterPurpleP'
import GoBackButton from '../atoms/GoBackButton'
import OldMainChatModal from './OldMainChatModal'
import Modal from './Modal'

interface InitialMainChatModalProps {
    onConfirm: () => void;
    onSelectHistory: (history: ChatSession) => void;
}

export default function InitialMainChatModal({ onConfirm, onSelectHistory }: InitialMainChatModalProps) {
    const navigate = useNavigate();
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
        <Modal onClose = {() => navigate('/Start')}>
            <GenerateButton content = 'Make new' onClick = { goToMakeNewMainChatModal } />
            <GenerateButton content = 'Bringing up old main chats' onClick = { goToOldMainChatModal } />
            <CenterPurpleP content = 'You can input a question and select specific MBTI traits to influence the AI response. You can control the influence percentage of each trait using a slider.' />
            <GoBackButton />
        </Modal>
    )
}
