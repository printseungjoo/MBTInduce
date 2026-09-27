import CenterPurpleP from '../atoms/CenterPurpleP'
import GoBackButton from '../atoms/GoBackButton'
import EditScheduleOptionButton from '../atoms/EditScheduleOptionButton'
import Modal from './Modal'

type EditTarget = 'title' | 'start' | 'end';

interface InitialEditScheduleProps {
    id: string;
    title: string; 
    start: Date;
    end: Date;
    onSelectEditTarget: (target: EditTarget, content: string | Date, id: string) => void;
    onBack: () => void;
}

export default function InitialEditSchedule({ id, title, start, end, onSelectEditTarget, onBack }: InitialEditScheduleProps) {
    return (
        <Modal onClose = { onBack }>
            <CenterPurpleP content = 'Click what you want to change' />
            <EditScheduleOptionButton content = { title } onSelect = { onSelectEditTarget } target = 'title' id = { id }/>
            <EditScheduleOptionButton content = { start } onSelect = { onSelectEditTarget } target = 'start' id = { id }/>
            <EditScheduleOptionButton content = { end } onSelect = { onSelectEditTarget } target = 'end' id = { id }/>
            <GoBackButton content = 'Go back' onClick = { onBack } />
        </Modal>
    )
}
