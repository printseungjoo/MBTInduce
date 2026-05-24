import styled from '@emotion/styled'

import CenterPurpleP from '../atoms/CenterPurpleP'
import GoBackButton from '../atoms/GoBackButton'
import EditScheduleOptionButton from '../atoms/EditScheduleOptionButton'

type EditTarget = 'title' | 'start' | 'end';

interface InitialEditScheduleProps {
    id: string;
    title: string; 
    start: Date;
    end: Date;
    onSelectEditTarget: (target: EditTarget, content: string | Date, id: string) => void;
}

const EditScheduleModalStyled = styled.div`
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

export default function InitialEditSchedule({ id, title, start, end, onSelectEditTarget }: InitialEditScheduleProps) {
    return (
        <EditScheduleModalStyled>
            <CenterBox>
                <CenterPurpleP content = 'Click what you want to change' />
                <EditScheduleOptionButton content = { title } onSelect = { onSelectEditTarget } target = 'title' id = { id }/>
                <EditScheduleOptionButton content = { start } onSelect = { onSelectEditTarget } target = 'start' id = { id }/>
                <EditScheduleOptionButton content = { end } onSelect = { onSelectEditTarget } target = 'end' id = { id }/>
                <GoBackButton />
            </CenterBox>
        </EditScheduleModalStyled>
    )
}