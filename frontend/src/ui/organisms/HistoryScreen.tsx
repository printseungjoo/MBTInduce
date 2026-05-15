import styled from '@emotion/styled'
import { useState } from 'react'

import HistoryDiv from '../molecules/HistoryDiv'

import HistoryOptionButton from '../atoms/HistoryOptionButton'

const Option = styled.div`
    width: 100%;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    border-bottom: 1px solid ${({ theme }) => theme.colors.royalPurple};
    margin-top: 1vh;
    padding-left: 2vw;
`;

// This is dummy data. I will change and update it soon.
export default function HistoryScreen() {
    const [optionSelected, setOptionSelected] = useState('Chat History');

    return(
        <>
            <Option>
                <HistoryOptionButton name = 'Chat History' clicked = {() => setOptionSelected('Chat History')} selected = {optionSelected === 'Chat History'} />
                <HistoryOptionButton name = 'Simulation History' clicked = {() => setOptionSelected('Simulation History')} selected = {optionSelected === 'Simulation History'} />
                <HistoryOptionButton name = 'Schedule' clicked = {() => setOptionSelected('Schedule')} selected = {optionSelected === 'Schedule'} />
            </Option>
            <HistoryDiv title = 'Big argument with best friend. Don’t know if Seungjoo should text her first' description = 'It sounds like this situation is really weighing on you. Arguments with people we care about can be painful because the relationship matters so much. If you feel ready, sending a simple message could be a good first step. It ...' date = '2025.03.15' etc = 'F 94%' />
        </>
    )
}