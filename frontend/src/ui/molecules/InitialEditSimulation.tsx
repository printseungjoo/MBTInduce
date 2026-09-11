import { useNavigate } from 'react-router-dom'

import CenterPurpleP from '../atoms/CenterPurpleP'
import GoBackButton from '../atoms/GoBackButton'
import EditOptionButton from '../atoms/EditOptionButton'
import Modal from './Modal'

type EditTarget = 'userName' | 'userMbti' | 'simulationContent';

interface InitialEditSimulationProps {
    userName: string; 
    userMbti: string; 
    simulationContent: string;
    userId: string;
    simulationId: string;
    onSelectEditTarget: (target: EditTarget, content: string, id: string) => void;
}

export default function InitialEditSimulation({ userName, userMbti, simulationContent, userId, simulationId, onSelectEditTarget }: InitialEditSimulationProps) {
    const navigate = useNavigate();
    return (
        <Modal onClose = {() => navigate('/Start')}>
            <CenterPurpleP content = 'Click what you want to change' />
            <EditOptionButton content = { userName } onSelect = { onSelectEditTarget } target = 'userName' id = { userId }/>
            <EditOptionButton content = { userMbti } onSelect = { onSelectEditTarget } target = 'userMbti' id = { userId }/>
            <EditOptionButton content = { simulationContent } onSelect = { onSelectEditTarget } target = 'simulationContent' id = { simulationId }/>
            <GoBackButton />
        </Modal>
    )
}
