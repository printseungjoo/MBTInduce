import styled from '@emotion/styled'

interface SelectTimeProps {
    date: string;
}

const DateP = styled.p`
    color: ${({ theme }) => theme.colors.softLavender};
    font-weight: bold;
`;

const DateInput = styled.input`
    margin-bottom: 1.5vh;
`;

export default function SelectTime({ date }: SelectTimeProps) {
    return(
        <>
            <DateP> { date } </DateP>
            <DateInput type = 'time' lang = 'en' />
        </>
    )
}