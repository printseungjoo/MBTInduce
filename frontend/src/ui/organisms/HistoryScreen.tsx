import styled from '@emotion/styled'
import { useState } from 'react'

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

export default function HistoryScreen() {
    const [optionSelected, setOptionSelected] = useState('Chat History');

    return(
        <>
            <Option>
                <HistoryOptionButton name = 'Chat History' clicked = {() => setOptionSelected('Chat History')} selected = {optionSelected === 'Chat History'} />
                <HistoryOptionButton name = 'Simulation History' clicked = {() => setOptionSelected('Simulation History')} selected = {optionSelected === 'Simulation History'} />
                <HistoryOptionButton name = 'Schedule' clicked = {() => setOptionSelected('Schedule')} selected = {optionSelected === 'Schedule'} />
            </Option>
        </>
    )
}