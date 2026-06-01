import styled from '@emotion/styled'

const StartPageAfterLoginStyled = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    min-height: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 0 1.5rem;
    overflow-x: hidden;
`;

const Title = styled.h1`
    color: ${({ theme }) => theme.colors.lightWhite};
    font-size: clamp(3.2rem, 14vw, 8rem);
    line-height: 1;
    text-align: center;
    margin: 0;
    max-width: 100%;
    white-space: nowrap;
`;

const PurpleText = styled.span`
    color: ${({ theme }) => theme.colors.paleLavender};
`;

const SplitI = styled.span`
    background: linear-gradient(
        to right,
        ${({ theme }) => theme.colors.lightWhite} 50%,
        ${({ theme }) => theme.colors.paleLavender} 50%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const SubTitle = styled.h3`
    font-weight: lighter;
    color: ${({ theme }) => theme.colors.lightWhite};
    font-size: clamp(1.2rem, 4vw, 1.8rem);
    text-align: center;
    margin: 2vh 0 0;
`;

const SubTitlePurple = styled.h3`
    font-weight: lighter;
    color: ${({ theme }) => theme.colors.paleLavender};
    font-size: clamp(1rem, 3.6vw, 1.5rem);
    line-height: 1.4;
    text-align: center;
    margin: 1vh 0 0;
    max-width: 44rem;
`;

export default function StartPageAfterLogin() {
    return(
        <StartPageAfterLoginStyled>
            <Title>
                MBT
                <SplitI>I</SplitI>
                <PurpleText>nduce</PurpleText>
            </Title>
            <SubTitle> MBTI Chat-GPT AI Agent </SubTitle>
            <SubTitlePurple> Chat with AI that adapts to your personality type and preferences </SubTitlePurple>
        </StartPageAfterLoginStyled>
    )
}