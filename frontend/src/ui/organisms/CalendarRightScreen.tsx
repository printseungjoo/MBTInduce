import styled from '@emotion/styled'

import Title from '../atoms/Title'
import SelectTime from '../molecules/SelectTime'
import Checkbox from '../atoms/Checkbox'
import GenerateButton from '../atoms/GenerateButton'
import ScheduleButton from '../atoms/ScheduleButton'

const SelectTimeP = styled.p`
    color: ${({ theme }) => theme.colors.lightWhite};
    font-size: 0.85rem;
    margin-bottom: 1vh;
`;

const WriteSchedule = styled.textarea`
    width: 100%;
    height: 10vh;
    background-color: ${({ theme }) => theme.colors.mutedViolet};
    color: ${({ theme }) => theme.colors.lightWhite};
    resize: none;
    overflow-y: auto;
    margin-top: 1.5vh;
    margin-bottom: 1.5vh;
`;

const PurpleDiv = styled.div`
    height: 22vh;
    background-color: ${({ theme }) => theme.colors.royalPurple};
    margin: 2vh 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;

    &::-webkit-scrollbar-track {
        background: transparent;
    }
`;

const GenerateButtonPlus = styled(GenerateButton)`
    margin: 1.2vh 0;
`

// They are dummy data. I will change and update them soon.
export default function CalendarRightScreen() {
    return(
        <>
            <Title title = 'Time' />
            <SelectTime date = '2026-02-04' />
            <SelectTime date = '2026-02-06' />
            <SelectTimeP> Click and select the time </SelectTimeP>
            <Title title = 'Schedule' />
            <WriteSchedule />
            <Checkbox text = 'You can disturb' />
            <Checkbox text = 'Do not disturb whole day' />
            <Checkbox text = 'Do not disturb only at this time' />
            <GenerateButtonPlus content = 'Submit' />
            <PurpleDiv>
                <ScheduleButton schedule = 'Late Same Night Event' date = '04/17/2015' startTime = '9pm' endTime = '10pm' />
                <ScheduleButton schedule = 'Late Same Night Event' date = '04/17/2015' startTime = '9pm' endTime = '10pm' />
                <ScheduleButton schedule = 'Late Same Night Event' date = '04/17/2015' startTime = '9pm' endTime = '10pm' />
            </PurpleDiv>
            <GenerateButtonPlus content = 'Delete' />
        </>
    )
}