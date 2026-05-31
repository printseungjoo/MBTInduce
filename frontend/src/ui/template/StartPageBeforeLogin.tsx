import styled from '@emotion/styled'
import { useEffect } from 'react'

import GenerateButton from '../atoms/GenerateButton'

const StartPageBeforeLoginStyled = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
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

const FlexDiv = styled.div`
    display: flex;
    justify-content: center;
    gap: 0.75vw;
    margin-top: 3vh;
    width: 100%;
    flex-wrap: wrap;
`;

const GenerateButtonPlus = styled(GenerateButton)`
    width: 7.5rem;
    min-height: 3rem;
    font-size: 1rem;
    padding: 0.5rem 0.75rem;
    box-sizing: border-box;

    @media screen and (min-width: 768px) {
        width: 10vw;
        min-width: 7rem;
        max-width: 10rem;
    }
`;

const FlexLinkDiv = styled.div`
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 3vh;
    flex-wrap: wrap;
`;

const LinkA = styled.a`
    color: ${({ theme }) => theme.colors.paleLavender};
    text-decoration: underline;
    font-size: clamp(1rem, 3vw, 1.25rem);
`;

// I will put the links later.
export default function StartPageBeforeLogin() {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const error = params.get('error');
        if (error === 'already_registered') {
            window.alert('You already have an account.');
            window.history.replaceState({}, '', window.location.pathname);
            window.location.href = '/';
        }
        if (error === 'not_registered') {
            window.alert("You don't have an account yet. Please sign up first.");
            window.history.replaceState({}, '', window.location.pathname);
            window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google?mode=signup`;
        }
    }, []);

    const goToGoogleSignUp = () => {
        window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google?mode=signup`;
    };

    const goToGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google?mode=login`;
    };

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
                <GenerateButtonPlus content = 'Sign Up' onClick = { goToGoogleSignUp } />
                <GenerateButtonPlus content = 'Log In' onClick = { goToGoogleLogin } />
            </FlexDiv>
            <FlexLinkDiv>
                <LinkA> Tutorial </LinkA>
                <LinkA> Request </LinkA>
            </FlexLinkDiv>
        </StartPageBeforeLoginStyled>
    )
}