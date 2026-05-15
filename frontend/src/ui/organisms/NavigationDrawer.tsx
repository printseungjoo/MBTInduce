import styled from '@emotion/styled'
import { useLocation } from 'react-router-dom'

import Title from '../atoms/Title'
import PageButton from '../atoms/PageButton'
import WebsiteIntro from '../atoms/WebsiteIntro'

interface NavigationDrawerProps {
    className?: string;
    isOpen: boolean;
    children?: React.ReactNode;
}

const NavigationDrawerStyled = styled.div<{ isOpen: boolean }>`
    width: 20%;
    height: 100vh;
    background-color: ${({ theme }) => theme.colors.deepPlum};
    left: ${({ isOpen }) => isOpen ? '0' : '-100%'};
    transition: left 0.4s ease-in-out;
    padding-top: 2vh;
    display: flex;
    flex-direction: column;
`;

const PaddingLeftWithLine = styled.div`
    padding-left: 1vw;
    padding-bottom: 2vh;
    border-bottom: 0.5px solid ${({ theme }) => theme.colors.lightWhite};
`;

const FlexDiv = styled.div`
    display: flex;
`;

const Subtitle = styled.p`
    color: ${({ theme }) => theme.colors.lightWhite};
`;

type clickedNameGeneric = 'Main Chat' | 'Simulation' | 'Calendar' | 'Log In' | 'History'

export default function NavigationDrawer({ className, isOpen, children }: NavigationDrawerProps) {
    const location = useLocation();

    const pathMap: Record<string, clickedNameGeneric> = {
        '/': 'Main Chat',
        '/MainChat': 'Main Chat',
        '/Simulation': 'Simulation',
        '/Calendar': 'Calendar',
        '/LogIn': 'Log In',
        '/History': 'History'
    };

    const clickedName = pathMap[location.pathname] ?? 'Main Chat';

    return (
        <NavigationDrawerStyled className = { className } isOpen = { isOpen }>
            <PaddingLeftWithLine>
                <FlexDiv>
                    <Title title = 'MBTInduce' />
                    { children }
                </FlexDiv>
                <Subtitle> MBTI Chat-GPT AI Agent </Subtitle>
            </PaddingLeftWithLine>
            <PageButton name = '💬  Main Chat' clicked = {clickedName === 'Main Chat'} text = 'MainChat' />
            <PageButton name = '👥  Simulation' clicked = {clickedName === 'Simulation'} text = 'Simulation' />
            <PageButton name = '📅  Calendar' clicked = {clickedName === 'Calendar'} text = 'Calendar' />
            <PageButton name = '👣 Log In' clicked = {clickedName === 'Log In'} text = 'LogIn' />
            <PageButton name = '📄 History' clicked = {clickedName === 'History'} text = 'History' />
            <WebsiteIntro content='MBTInduce is a ChatGPT(AI) agent web service that allows users to induce ChatGPT responses based on selected MBTI personality traits. It also allows you to simulate conversations with specific MBTI personalities.' />
        </NavigationDrawerStyled>
    )
}