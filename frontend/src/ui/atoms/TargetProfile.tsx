import styled from '@emotion/styled'

interface TargetProfileProps {
    meOrNot: string;
    name: string | undefined; 
    mbti: string | undefined;
}

const TargetProfileStyled = styled.div`
    width: 100%;
    height: 8vh;
    background-color: ${({ theme }) => theme.colors.mutedViolet};
    display: flex;
    border-radius: 10px;
`;

const Emoji = styled.p`
    font-size: 2.5rem;
`;

const FlexColumnDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const FlexDiv = styled.div`
    display: flex;
    gap: 0.3vw;
`;

const NameP = styled.p`
    font-weight: bolder;
    color: ${({ theme }) => theme.colors.lightWhite};
`;

const MbtiP = styled.p`
    color: ${({ theme }) => theme.colors.lightWhite};
`;

export default function TargetProfile({ meOrNot, name, mbti }: TargetProfileProps) {
    return(
        <TargetProfileStyled>
            <Emoji> 👤 </Emoji>
            <FlexColumnDiv>
                <FlexDiv>
                    <NameP> { name } </NameP>
                    <NameP> { meOrNot } </NameP>
                </FlexDiv>
                <MbtiP> { mbti } </MbtiP>
            </FlexColumnDiv>
        </TargetProfileStyled>
    )
}