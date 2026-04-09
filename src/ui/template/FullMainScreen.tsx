import styled from '@emotion/styled'
import { useEffect, useState } from 'react'

import NavigationDrawer from '../organisms/NavigationDrawer'
import Hamburger from '../atoms/Hamburger'
import Title from '../atoms/Title'
import { getURL } from '../atoms/GetURL'
import RightScreen from '../organisms/RightScreen'
import TextInputBox from '../molecules/TextInputBox'
import UserChat from '../atoms/userChat'
import AiChat from '../atoms/aiChat'

interface MbtiRange {
    eValue: number;
    sValue: number;
    fValue: number;
    pValue: number;
}

interface ChatMessage {
    id: string;
    role: 'user' | 'ai';
    content: string;
    mbtiRange: MbtiRange;
    createdAt: string;
    rate?: number;
}

const FullScreen = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    overflow: hidden;
`;

const MainContent = styled.div<{ isOpen: boolean }>`
    margin-left: ${({ isOpen }) => isOpen ? '20%' : '0'};
    transition: margin-left 0.3s ease;
    width: ${({ isOpen }) => isOpen ? '60%' : '80%'};
    height: 100vh;
    box-sizing: border-box;
    padding: 1.5vh 1vw;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 0;
    overflow: hidden;
`;

const HeaderDiv = styled.div`
    display: flex;
    gap: 1vw;
    align-items: center;
    padding-top: 1vh;
`;

const FlexColumnDiv = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 0;
`;

const FlexDiv = styled.div`
    display: flex;
    align-items: center;
    gap: 2vw;
`;

const ChatMessagesDiv = styled.div`
    width: 100%;
    flex: 1;              
    margin: 2vh 0;
    display: flex;
    flex-direction: column;
    overflow-y: auto;     
    gap: 2vh;
    min-height: 0;     
    box-sizing: border-box;

    &::-webkit-scrollbar {
        width: 0.4rem;
    }
    &::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 0.2rem;
    }
`;

const ChatRow = styled.div<{ role: 'user' | 'ai' }>`
    display: flex;
    width: 100%;
    justify-content: ${({ role }) => (role === 'user' ? 'flex-end' : 'flex-start')};
    padding-right: ${({ role }) => (role === 'user' ? '1vw' : '0')};
    padding-left: ${({ role }) => (role === 'ai' ? '1vw' : '0')};
    box-sizing: border-box;
    flex-shrink: 0; 
`;

const NavigationDrawerPlus = styled(NavigationDrawer)<{ isOpen: boolean }>`
    display: flex;
    position: fixed;
    height: 100vh;
`;

export default function FullMainScreen() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [url, setUrl] = useState(getURL);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [eValue, setEValue] = useState<number>(50);
    const [sValue, setSValue] = useState<number>(50);
    const [fValue, setFValue] = useState<number>(50);
    const [pValue, setPValue] = useState<number>(50);

    function isClicked() {
        setIsOpen(!isOpen);
    }

    useEffect(() => {
        getChatMessages();
    }, []);

    async function getChatMessages() {
        try {
            const response = await fetch('http://localhost:8080/api/chat', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to get chatMessages');
            }
            const data: ChatMessage[] = await response.json();
            setChatMessages(data);
        } catch (error) {
            console.error(error);
        }
    }

    async function sendChatMessages(inputValue: string) {
        const trimmedValue = inputValue.trim();
        if (!trimmedValue || isLoading) return;
        const newUserChatMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            content: trimmedValue,
            mbtiRange: {
                eValue,
                sValue,
                fValue,
                pValue,
            },
            createdAt: new Date().toISOString(),
            rate: 0,
        };
        setChatMessages((prev) => [...prev, newUserChatMessage]);
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8080/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: trimmedValue,
                    role: 'user',
                    mbtiRange: {
                        eValue,
                        sValue,
                        fValue,
                        pValue,
                    },
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to post chatMessage');
            }
            const data: ChatMessage[] = await response.json();
            setChatMessages(data);
        } catch (error) {
            console.error(error);
            setChatMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: 'ai',
                    content: 'Sorry. Please try later.',
                    mbtiRange: {
                        eValue,
                        sValue,
                        fValue,
                        pValue,
                    },
                    createdAt: new Date().toISOString(),
                    rate: 0,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    }

    async function patchChatMessageRate(messageId: string, rate: number) {
        try {
            const response = await fetch(`http://localhost:8080/api/chat/${messageId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rate,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to patch chatMessage');
            }
            setChatMessages((prev) =>
                prev.map((chatMessage) =>
                    chatMessage.id === messageId ? { ...chatMessage, rate } : chatMessage
                )
            );
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <FullScreen>
            <NavigationDrawerPlus isOpen = { isOpen }>
                <Hamburger isClicked = { isClicked } isOpen = { isOpen } />
            </NavigationDrawerPlus>
            <MainContent isOpen = { isOpen }>
                <FlexColumnDiv>
                    <HeaderDiv>
                        <FlexDiv>
                            {!isOpen && <Hamburger isClicked = { isClicked } isOpen = { isOpen } />}
                            <Title title = { url } />
                        </FlexDiv>
                    </HeaderDiv>

                    <ChatMessagesDiv>
                        {chatMessages.map((chatMessage) => (
                            <ChatRow key={chatMessage.id} role = { chatMessage.role }>
                                {chatMessage.role === 'user' ? (
                                    <UserChat content = { chatMessage.content } />
                                ) : (
                                    <AiChat messageId = { chatMessage.id } content = { chatMessage.content } selectedRating = { chatMessage.rate } onRate = { patchChatMessageRate } />
                                )}
                            </ChatRow>
                        ))}
                    </ChatMessagesDiv>
                    <TextInputBox onSubmit = { sendChatMessages } disabled = { isLoading } />
                </FlexColumnDiv>
            </MainContent>
            <RightScreen eValues = { eValue } sValues = { sValue } fValues = { fValue } pValues = { pValue } setEValues = { setEValue } setSValues = { setSValue } setFValues = { setFValue } setPValues = { setPValue } />
        </FullScreen>
    );
}