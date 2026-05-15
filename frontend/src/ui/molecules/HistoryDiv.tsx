import styled from '@emotion/styled'

import DeleteButton from '../atoms/DeleteButton'

interface HistoryDivProps {
    title: string;
    description: string;
    date: string;
    etc: string;
}

const HistoryDivStyled = styled.div`
    background-color: ${({ theme }) => theme.colors.royalPurple};
    width: 98%;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 10px;
    box-sizing: border-box;
    padding: 1vh 1vw;
    display: flex;
    flex-direction: column;
    gap: 1vh;
    margin: 2.5vh 0;
`;

const FlexDiv = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Title = styled.p`
    color: ${({ theme }) => theme.colors.lightWhite};
    font-weight: bold;
`;

const Description = styled.p`
    color: ${({ theme }) => theme.colors.softLavender};
`;

const DateEtcDiv = styled.div`
    color: ${({ theme }) => theme.colors.coolGray};
    display: flex;
    gap: 1vw;
`;

export default function HistoryDiv({ title, description, date, etc }: HistoryDivProps) {
    return(
        <HistoryDivStyled>
            <FlexDiv>
                <Title>
                    { title }
                </Title>
                <DeleteButton />
            </FlexDiv>
            <Description>
                { description }
            </Description>
            <DateEtcDiv>
                <span> { date } </span>
                <span> { etc } </span>
            </DateEtcDiv>
        </HistoryDivStyled>
    )
}