import styled from '@emotion/styled'

interface SelectTimeProps {
    date: string;
    onDateChange?: (date: string) => void;
    onTimeChange: (time: string) => void;
    editableDate?: boolean;
    showDateLabel?: boolean;
}

const DateP = styled.p`
    color: ${({ theme }) => theme.colors.softLavender};
    font-weight: bold;
`;

const DateInput = styled.input`
    margin-bottom: 1.5vh;
`;

export default function SelectTime({ date, onDateChange, onTimeChange, editableDate = false, showDateLabel = true }: SelectTimeProps) {
    return(
        <>
            {editableDate ? (
                <DateInput type = "date" value = { date } onChange = {(e) => onDateChange?.(e.target.value)}/>
            ) : (
                showDateLabel && <DateP> { date } </DateP>
            )}
            <DateInput type = "time" lang = "en" onChange = {(e) => onTimeChange(e.target.value)}/>
        </>
    )
}