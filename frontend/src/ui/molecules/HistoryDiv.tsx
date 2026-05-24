import styled from '@emotion/styled'

import DeleteButton from '../atoms/DeleteButton'
import EditButton from '../atoms/EditButton'

interface HistoryDivProps {
    title: string;
    description: string;
    date: string | undefined;
    etc: string;
    onClick?: () => void;
    onEditClick?: () => void;
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
    margin: 1.5vh 0;
`;

const FlexDiv = styled.div`
    display: flex;
    justify-content: space-between;
`;

const NextDiv = styled.div` 
    display: flex;
    gap: 1vw;
`;

const Etc = styled.p`
    color: ${({ theme }) => theme.colors.coolGray};
`;

const Title = styled.p`
    color: ${({ theme }) => theme.colors.lightWhite};
    font-weight: bold;
`;

const Description = styled.p`
    color: ${({ theme }) => theme.colors.softLavender};
`;

const DateStyled = styled.p`
    color: ${({ theme }) => theme.colors.coolGray};
`

export default function HistoryDiv({ title, description, date, etc, onClick, onEditClick}: HistoryDivProps) {
    return(
        <HistoryDivStyled>
            <FlexDiv>
                <NextDiv>
                    <Title>
                        { title }
                    </Title>
                    <Etc>
                        { etc }
                    </Etc>
                </NextDiv>
                <NextDiv>
                    <EditButton onClick = { onEditClick } />
                    <DeleteButton onClick = { onClick } />
                </NextDiv>
            </FlexDiv>
            <Description>
                { description }
            </Description>
            <DateStyled>
                { date }
            </DateStyled>
        </HistoryDivStyled>
    )
}