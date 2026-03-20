import styled from '@emotion/styled'
import { useState } from 'react'

import { Title } from '../atoms/Title';
import { PageButton } from '../atoms/PageButton';

interface NavigationDrawerProps {
    className?: string;
    isOpen: boolean;
}

const NavigationDrawerStyled = styled.div<{ isOpen: boolean }>`
    width: 20%;
    height: 100vh;
    background-color: ${({ theme }) => theme.colors.deepPlum};
    left: ${({ isOpen }) => isOpen ? '0' : '-100%'};
    transition: left 0.4s ease-in-out;
    padding-top: 6vh;
    display: flex;
    flex-direction: column;
`;

const PaddingLeftWithLine = styled.div`
    padding-left: 1vw;
    padding-bottom: 2vh;
    border-bottom: 0.5px solid ${({ theme }) => theme.colors.lightWhite};
`;

const Subtitle = styled.p`
    color: ${({ theme }) => theme.colors.lightWhite};
`;

type clickedNameGeneric = 'Main Chat' | 'Simulation' | 'Calendar' | 'Log In' | 'History'

// 원래는 로그인 유무에 따라 4번째 버튼 이름이 달라집니다. 코드 수정은 로그인 기능이 구현된 뒤에 하겠습니다.
export function NavigationDrawer({ className, isOpen }: NavigationDrawerProps) {
    const [clickedName, setClickedName] = useState<clickedNameGeneric>('Main Chat');

    return (
        <NavigationDrawerStyled className={className} isOpen={isOpen}>
            <PaddingLeftWithLine>
                <Title title='MBTInduce' />
                <Subtitle> MBTI Chat-GPT AI Agent </Subtitle>
            </PaddingLeftWithLine>
            <PageButton name='💬  Main Chat' clicked = {clickedName === 'Main Chat'} clickedName = {() => setClickedName('Main Chat')} />
            <PageButton name='👥  Simulation' clicked = {clickedName === 'Simulation'} clickedName = {() => setClickedName('Simulation')} />
            <PageButton name='📅  Calendar' clicked = {clickedName === 'Calendar'} clickedName = {() => setClickedName('Calendar')} />
            <PageButton name='👣 Log In' clicked = {clickedName === 'Log In'} clickedName = {() => setClickedName('Log In')} />
        </NavigationDrawerStyled>
    )
}