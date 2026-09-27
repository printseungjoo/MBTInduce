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
    onBack: () => void;
}

export default function InitialEditSimulation({ userName, userMbti, simulationContent, userId, simulationId, onSelectEditTarget, onBack }: InitialEditSimulationProps) {
    return (
        <Modal onClose = { onBack }>
            <CenterPurpleP content = 'Click what you want to change' />
            <EditOptionButton content = { userName } onSelect = { onSelectEditTarget } target = 'userName' id = { userId }/>
            <EditOptionButton content = { userMbti } onSelect = { onSelectEditTarget } target = 'userMbti' id = { userId }/>
            <EditOptionButton content = { simulationContent } onSelect = { onSelectEditTarget } target = 'simulationContent' id = { simulationId }/>
            <GoBackButton content = 'Go back' onClick = { onBack } />
        </Modal>
    )
}
