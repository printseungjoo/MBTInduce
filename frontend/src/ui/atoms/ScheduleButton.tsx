import styled from '@emotion/styled'

interface ScheduleButtonProps {
    schedule: string;
    date: string;
    startTime: string;
    endTime: string;
}

const ScheduleButtonStyled = styled.div`
    background-color: ${({ theme }) => theme.colors.softLavender};
    width: 90%;
    box-sizing: border-box;
    padding: 1vh 0.7vw;
    margin-top: 1.5vh;
    flex-shrink: 0;
`;

const Schedule = styled.div`
    color: ${({ theme }) => theme.colors.lightWhite};
    font-size: 0.85rem;
    font-weight: bold;
`;

const DateAndTime = styled.div`
    display: flex;
    color: ${({ theme }) => theme.colors.lightWhite};
    font-size: 0.75rem;
`;

export default function ScheduleButton({ schedule, date, startTime, endTime }: ScheduleButtonProps) {
    return(
        <ScheduleButtonStyled>
            <Schedule>
                { schedule }
            </Schedule>
            <DateAndTime>
                { date } { startTime } - { endTime }
            </DateAndTime>
        </ScheduleButtonStyled>
    )
}