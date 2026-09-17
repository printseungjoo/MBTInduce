import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import GenerateButton from '../atoms/GenerateButton'
import MakeNewSimulationModal from './MakeNewSimulationModal'
import CenterPurpleP from '../atoms/CenterPurpleP'
import GoBackButton from '../atoms/GoBackButton'
import OldSimulationModal from './OldSimulationModal'
import Modal from './Modal'

interface InitialSimulationRightScreenProps {
    onConfirm: () => void;
    onSelectHistory: (history: {
        scenario: string;
        name: string;
        mbti: string;
    }) => void;
}

export default function InitialSimulationRightScreen({ onConfirm, onSelectHistory }: InitialSimulationRightScreenProps) {
    const navigate = useNavigate();
    const [showNew, setShowNew] = useState(false);
    const [showOld, setShowOld] = useState(false);
    const goToMakeNewSimulationRightScreen = () => {
        setShowNew(true);
    };
    if (showNew) {
        return <MakeNewSimulationModal onSubmitSuccess = {(selection) => {
            setShowNew(false); 
            onSelectHistory(selection);
            onConfirm();
        }} />;
    }
    const goToOldSimulationRightScreen = () => {
        setShowOld(true);
    };
    if (showOld) {
        return <OldSimulationModal onConfirm = { onConfirm } onSelectHistory = { onSelectHistory } /> 
    }

    return (
        <Modal onClose = {() => navigate('/Start')}>
            <GenerateButton content = 'Make new' onClick = { goToMakeNewSimulationRightScreen } />
            <GenerateButton content = 'Bringing up old conversations' onClick = { goToOldSimulationRightScreen } />
            <CenterPurpleP content = 'You can simulate conversations with a selected MBTI personality. The AI generates dialogue responses as if the selected MBTI personality were participating in the conversation. This feature works like a role-play simulation system.' />
            <GoBackButton />
        </Modal>
    )
}
