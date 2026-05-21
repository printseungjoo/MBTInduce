import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'

import GenerateButton from '../atoms/GenerateButton'

const StartPageBeforeLoginStyled = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

const Title = styled.h1`
    color: ${({ theme }) => theme.colors.lightWhite};
    font-size: 8rem;
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
`;

const SubTitlePurple = styled.h3`
    font-weight: lighter;
    color: ${({ theme }) => theme.colors.paleLavender};
    margin: 0.5vh 0;
`;

const FlexDiv = styled.div`
    display: flex;
    gap: 1.5vw;
    margin-top: 2vh;
`;

const GenerateButtonPlus = styled(GenerateButton)`
    width: 10vw;
`;

const FlexLinkDiv = styled.div`
    display: flex;
    gap: 1.5vw;
    margin-top: 2vh;
`;

const LinkA = styled.a`
    color: ${({ theme }) => theme.colors.paleLavender};
    text-decoration: underline;
`;

// I will put the links later.
export default function StartPageBeforeLogin() {
    const navigate = useNavigate();

    return(
        <StartPageBeforeLoginStyled>
            <Title>
                MBT
                <SplitI>I</SplitI>
                <PurpleText>nduce</PurpleText>
            </Title>
            <SubTitle> MBTI Chat-GPT AI Agent </SubTitle>
            <SubTitlePurple> Chat with AI that adapts to your personality type and preferences </SubTitlePurple>
            <FlexDiv>
                <GenerateButtonPlus content = 'Sign Up' onClick = {() => navigate('/SignUp')}  />
                <GenerateButtonPlus content = 'Log In' />
            </FlexDiv>
            <FlexLinkDiv>
                <LinkA> Tutorial </LinkA>
                <LinkA> Request </LinkA>
            </FlexLinkDiv>
        </StartPageBeforeLoginStyled>
    )
}