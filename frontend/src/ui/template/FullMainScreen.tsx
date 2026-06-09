import styled from '@emotion/styled'
import { useEffect, useState, useMemo, useRef } from 'react'
import { useLocation, NavLink } from 'react-router-dom'

import NavigationDrawer from '../organisms/NavigationDrawer'
import Hamburger from '../atoms/Hamburger'
import Title from '../atoms/Title'
import RightScreen from '../template/RightScreen'
import MainChatTextInputBox from '../molecules/MainChatTextInputBox'
import SimulationTextInputBox from '../molecules/SimulationTextInputBox'
import UserChat from '../atoms/UserChat'
import AiChat from '../atoms/AiChat'
import InitialSimulationModal from '../molecules/InitialSimulationModal'
import CalendarScreen from '../organisms/CalendarScreen'
import HistoryScreen from '../organisms/HistoryScreen'
import InitialMainChatModal from '../molecules/InitialMainChatModal'
import StartPageAfterLogin from '../organisms/StartPageAfterLogin'
import MypageScreen from '../organisms/MypageScreen'
import CalendarRightScreen from '../organisms/CalendarRightScreen'
import type { MainChatRightScreenRef } from '../organisms/MainChatRightScreen'

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

interface SelectedRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface ApiMessage {
    id: string;
    role: 'USER' | 'ASSISTANT' | 'SYSTEM';
    content: string;
    createdAt: string;
}

interface PostChatMessageResponse {
    userMessage: ApiMessage;
    assistantMessage: ApiMessage;
    assistantMessages?: ApiMessage[];
    appliedMbti?: {
        energy: string;
        information: string;
        decision: string;
        lifestyle: string;
        energyWeight: number;
        informationWeight: number;
        decisionWeight: number;
        lifestyleWeight: number;
    } | null;
}

interface ChatSessionMessagesResponse {
    session: {
        id: string;
        userId: string;
        title: string | null;
        isArchived: boolean;
        createdAt: string;
        updatedAt: string;
    };
    messages: ApiMessage[];
}

const FullScreen = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    overflow: hidden;
`;

const MainContent = styled.div<{ isOpen: boolean; hasRightScreen: boolean }>`
    margin-left: ${({ isOpen }) => isOpen ? '20%' : '0'};
    transition: margin-left 0.3s ease;
    width: ${({ isOpen, hasRightScreen }) => {
        if (isOpen && hasRightScreen) return '60%';
        if (isOpen && !hasRightScreen) return '80%';
        if (!isOpen && hasRightScreen) return '80%';
        return '100%';
    }};
    height: 100vh;
    box-sizing: border-box;
    padding: 1.5vh 1vw;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 0;
    overflow: hidden;

    @media screen and (max-width: 767px) {
        width: 100%;
        margin-left: 0;
        padding: 1rem 1rem 6.5rem;
    }
`;

const HeaderDiv = styled.div`
    display: flex;
    gap: 1vw;
    align-items: center;
    padding-top: 1vh;
    justify-content: space-between;
    width: 100%;
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
    padding-left: 1rem;
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

const DesktopOnlyHamburger = styled.div`
    display: block;

    @media screen and (max-width: 767px) {
        display: none;
    }
`;

const MobileRightHamburgerWrapper = styled.div`
    display: none;

    @media screen and (max-width: 767px) {
        display: block;
        flex-shrink: 0;
        z-index: 5;
    }
`;

const CalendarModalOverlay = styled.div`
    display: none;

    @media screen and (max-width: 767px) {
        position: fixed;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 20;
    }
`;

const CalendarModalContent = styled.div`
    position: relative;
    width: min(28rem, 90vw);
    max-height: 90vh;
    overflow-y: auto;
    background-color: ${({ theme }) => theme.colors.deepPlum};
    padding: 2rem;
    border-radius: 0.75rem;
    box-sizing: border-box;
    margin-top: 2rem;
`;

const CalendarModalCloseButton = styled.button`
    position: absolute;
    top: 0.8rem;
    right: 0.9rem;
    width: 2rem;
    height: 2rem;
    border: none;
    background: transparent;
    color: ${({ theme }) => theme.colors.lightWhite};
    font-size: 1.5rem;
    font-weight: 700;
    cursor: pointer;
    line-height: 1;
    display: flex;
    align-items: center;
`;

const MobileBottomNav = styled.nav`
    display: none;

    @media screen and (max-width: 767px) {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        height: 4rem;
        display: flex;
        justify-content: space-around;
        align-items: center;
        background-color: ${({ theme }) => theme.colors.deepPlum};
        border-top: 1px solid ${({ theme }) => theme.colors.paleLavender};
        z-index: 30;
    }
`;

const MobileBottomNavItem = styled(NavLink)`
    width: 16.666%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    font-size: 1.55rem;
    color: ${({ theme }) => theme.colors.lightWhite};

    &.active {
        background-color: ${({ theme }) => theme.colors.midnightPurple};
    }
`;

export default function FullMainScreen() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [eValue, setEValue] = useState<number>(50);
    const [sValue, setSValue] = useState<number>(50);
    const [fValue, setFValue] = useState<number>(50);
    const [pValue, setPValue] = useState<number>(50);
    const [showSimulation, setShowSimulation] = useState<boolean>(false);
    const [selectedScenario, setSelectedScenario] = useState<string>('');
    const [selectedName, setSelectedName] = useState<string>('');
    const [selectedMbti, setSelectedMbti] = useState<string>('');
    const [mainChatMessages, setMainChatMessages] = useState<ChatMessage[]>([]);
    const [simulationChatMessages, setSimulationChatMessages] = useState<Record<string, ChatMessage[]>>({});
    const [selectedRange, setSelectedRange] = useState<SelectedRange>({
        startDate: null,
        endDate: null
    });
    const [selectedMainChatSessionId, setSelectedMainChatSessionId] = useState<string | null>(null);
    const [isMobileRightOpen, setIsMobileRightOpen] = useState<boolean>(false);
    const chatMessagesRef = useRef<HTMLDivElement | null>(null);
    const mainChatRightScreenRef = useRef<MainChatRightScreenRef | null>(null);

    const location = useLocation();
    const hasRightScreen = location.pathname === '/' || location.pathname === '/MainChat' || location.pathname === '/Simulation' || location.pathname === '/Calendar';
    const isSimulationPage = location.pathname === '/Simulation';
    const selectedSimulationKey = useMemo(() => {
        if (!selectedName || !selectedMbti || !selectedScenario) {
            return '';
        }
        return `${selectedName}-${selectedMbti}-${selectedScenario}`;
    }, [selectedName, selectedMbti, selectedScenario]);
    const isReadySimulation = isSimulationPage && showSimulation && selectedSimulationKey !== '';
    const isMainChatModalOpen = location.pathname === '/MainChat' && !showSimulation;
    const isSimulationModalOpen = isSimulationPage && !showSimulation;
    const isBlockingModalOpen = isMainChatModalOpen || isSimulationModalOpen;
    const currentChatMessages = isSimulationPage
        ? isReadySimulation
            ? simulationChatMessages[selectedSimulationKey] ?? []
            : []
        : mainChatMessages;
    useEffect(() => {
        const chatMessagesElement = chatMessagesRef.current;
        if (!chatMessagesElement) return;
        chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight;
    }, [currentChatMessages]);

    function isClicked() {
        setIsOpen(!isOpen);
    }

    useEffect(() => {
        if (isReadySimulation && selectedSimulationKey) {
            getChatMessages(selectedSimulationKey);
        }
    }, [isReadySimulation, selectedSimulationKey]);

    useEffect(() => {
        if (location.pathname === '/Simulation') {
            setShowSimulation(false);
            setSelectedScenario('');
            setSelectedName('');
            setSelectedMbti('');
        }
    }, [location.pathname]);

    const handleSelectHistory = (h: { scenario: string, name: string, mbti: string }) => {
        setSelectedScenario(h.scenario);
        setSelectedName(h.name);
        setSelectedMbti(h.mbti);
        setShowSimulation(true); 
    };

    const handleConfirm = () => {
        setShowSimulation(true);
    };

    useEffect(() => {
        if (location.pathname === '/Simulation' && showSimulation && selectedSimulationKey) {
            getChatMessages();
        }
    }, [location.pathname, showSimulation, selectedSimulationKey]);

    async function getChatMessages(simKey?: string) {
        const key = simKey ?? selectedSimulationKey;
        const onSimPage = location.pathname === '/Simulation';
        try {
            const url = onSimPage && key ? `${import.meta.env.VITE_API_BASE_URL}/api/chat?pageType=simulation&simulationKey=${encodeURIComponent(key)}` : `${import.meta.env.VITE_API_BASE_URL}/api/chat?pageType=main`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to get chatMessages');
            }
            const data: ChatMessage[] = await response.json();
            if (onSimPage && key) {
                setSimulationChatMessages((prev) => ({
                    ...prev,
                    [key]: data,
                }));
            } else {
                setMainChatMessages(data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    function addCurrentChatMessage(newMessage: ChatMessage) {
        if (isReadySimulation) {
            setSimulationChatMessages((prev) => ({
                ...prev,
                [selectedSimulationKey]: [
                    ...(prev[selectedSimulationKey] ?? []),
                    newMessage,
                ],
            }));
            return;
        }
        setMainChatMessages((prev) => [...prev, newMessage]);
    }

    async function sendChatMessages(inputValue: string) {
        const trimmedValue = inputValue.trim();
        if (!trimmedValue || isLoading) return;
        const rightScreenValues = !isSimulationPage
            ? await mainChatRightScreenRef.current?.sendMainChatRightScreenValues()
            : null;
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
        addCurrentChatMessage(newUserChatMessage);
        setIsLoading(true);

        try {
            const response = await fetch(
                isSimulationPage
                    ? `${import.meta.env.VITE_API_BASE_URL}/api/chat`
                    : `${import.meta.env.VITE_API_BASE_URL}/api/chatMessage/sessions/${selectedMainChatSessionId}/messages`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        content: trimmedValue,
                        role: 'user',
                        mbtiRange: { eValue, sValue, fValue, pValue },
                        showBoth: rightScreenValues?.showBoth ?? [],
                        pageType: isSimulationPage ? 'simulation' : 'main',
                        simulationKey: isSimulationPage ? selectedSimulationKey : '',
                    }),
                }
            );
            if (!response.ok) {
                throw new Error('Failed to post chatMessage');
            }
            if (isSimulationPage) {
                const data: ChatMessage[] = await response.json();
                setSimulationChatMessages((prev) => ({
                    ...prev,
                    [selectedSimulationKey]: data,
                }));
                return;
            }
            const data: PostChatMessageResponse = await response.json();
            const assistantSourceMessages = data.assistantMessages ?? [data.assistantMessage];
            const assistantMessages: ChatMessage[] = assistantSourceMessages.map((message) => ({
                id: message.id,
                role: 'ai',
                content: message.content,
                mbtiRange: rightScreenValues?.mbtiRange ?? {
                    eValue,
                    sValue,
                    fValue,
                    pValue
                },
                createdAt: message.createdAt,
                rate: 0,
            }));
            setMainChatMessages((prev) => [...prev, ...assistantMessages]);
        } catch (error) {
            console.error(error);
            const errorMessage: ChatMessage = {
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
            };
            addCurrentChatMessage(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    async function patchChatMessageRate(messageId: string, rate: number) {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chat/${messageId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    rate,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to patch chatMessage');
            }
            if (isSimulationPage) {
                setSimulationChatMessages((prev) => ({
                    ...prev,
                    [selectedSimulationKey]: (prev[selectedSimulationKey] ?? []).map((chatMessage) => chatMessage.id === messageId ? { ...chatMessage, rate } : chatMessage)
                }));
                return;
            }
            setMainChatMessages((prev) =>
                prev.map((chatMessage) =>
                    chatMessage.id === messageId ? { ...chatMessage, rate } : chatMessage
                )
            );
        } catch (error) {
            console.error(error);
        }
    }

    async function getMainChatSessionMessages(sessionId: string) {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chatMessage/sessions/${sessionId}`, {
            method: 'GET',
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Failed to get main chat session messages');
        }
        const data: ChatSessionMessagesResponse = await response.json();
        const messages: ChatMessage[] = data.messages.map((message) => ({
            id: message.id,
            role: message.role === 'USER' ? 'user' : 'ai',
            content: message.content,
            mbtiRange: {
                eValue,
                sValue,
                fValue,
                pValue,
            },
            createdAt: message.createdAt,
            rate: 0,
        }));
        setMainChatMessages(messages);
    }

    function handleMobileNavClick(path: string) {
        if (path === '/MainChat') {
            setShowSimulation(false);
            setSelectedMainChatSessionId(null);
        }
        if (path === '/Simulation') {
            setShowSimulation(false);
            setSelectedScenario('');
            setSelectedName('');
            setSelectedMbti('');
        }
    }

    return (
        <FullScreen>
            {location.pathname === '/Simulation' && !showSimulation && (<InitialSimulationModal onConfirm = { handleConfirm } onSelectHistory = { handleSelectHistory } />)}
            {location.pathname === '/MainChat' && !showSimulation && (<InitialMainChatModal onConfirm = { handleConfirm } onSelectHistory={(history) => { 
                setSelectedMainChatSessionId(history.id);
                getMainChatSessionMessages(history.id);
                }} 
            />)}
            <NavigationDrawerPlus isOpen = { isOpen }>
                <DesktopOnlyHamburger>
                    <Hamburger isClicked = { isClicked } isOpen = { isOpen } />
                </DesktopOnlyHamburger>
            </NavigationDrawerPlus>
            <MainContent isOpen = { isOpen } hasRightScreen = { hasRightScreen }>
                <FlexColumnDiv>
                    <HeaderDiv>
                        <FlexDiv>
                            {!isOpen && (
                                <DesktopOnlyHamburger>
                                    <Hamburger isClicked = { isClicked } isOpen = { isOpen } /> 
                                </DesktopOnlyHamburger>
                            )}
                            <Title title = { (location.pathname.replace('/', '') === '' || location.pathname.replace('/', '') === 'MainChat') ? 'Main Chat' : location.pathname.replace('/', '') } />
                        </FlexDiv>
                        {(location.pathname === '/' || location.pathname === '/MainChat' || location.pathname === '/Simulation') && (
                            <MobileRightHamburgerWrapper>
                                <Hamburger isClicked = {() => setIsMobileRightOpen((prev) => !prev)} isOpen = { isMobileRightOpen }/>
                            </MobileRightHamburgerWrapper>
                        )}
                    </HeaderDiv>
                    {location.pathname === '/Start' && <StartPageAfterLogin />};
                    {(location.pathname === '/' || location.pathname === '/MainChat' || location.pathname === '/Simulation') && !isBlockingModalOpen && <ChatMessagesDiv ref = { chatMessagesRef }>
                        {currentChatMessages.map((chatMessage) => (
                            <ChatRow key = {chatMessage.id} role = { chatMessage.role }>
                                {chatMessage.role === 'user' ? (
                                    <UserChat content = { chatMessage.content } />
                                ) : (
                                    <AiChat messageId = { chatMessage.id } content = { chatMessage.content } selectedRating = { chatMessage.rate } onRate = { patchChatMessageRate } />
                                )}
                            </ChatRow>
                        ))}
                    </ChatMessagesDiv>}
                    {(location.pathname === '/' || location.pathname === '/MainChat') && !isBlockingModalOpen && (<MainChatTextInputBox onSubmit = { sendChatMessages } disabled = { isLoading } /> )}
                    {(location.pathname === '/Simulation') && !isBlockingModalOpen && (<SimulationTextInputBox onSubmit = { sendChatMessages } disabled = { isLoading } /> )}
                    {location.pathname === '/Calendar' && <CalendarScreen selectedRange = { selectedRange } setSelectedRange = { setSelectedRange } />}
                    {location.pathname === '/History' && <HistoryScreen />}
                    {location.pathname === '/Mypage' && <MypageScreen />}
                </FlexColumnDiv>
            </MainContent>
            {!isBlockingModalOpen && (location.pathname === '/' || location.pathname === '/MainChat' || location.pathname === '/Simulation' || location.pathname === '/Calendar') && <RightScreen eValues = { eValue } sValues = { sValue } fValues = { fValue } pValues = { pValue } setEValues = { setEValue } setSValues = { setSValue } setFValues = { setFValue } setPValues = { setPValue } showSimulation = { showSimulation } selectedScenario = { selectedScenario } selectedName = { selectedName } selectedMbti = { selectedMbti } selectedRange = { selectedRange } isMobileOpen = { isMobileRightOpen } onMobileClose = {() => setIsMobileRightOpen((prev) => !prev)} ref = { mainChatRightScreenRef } />}
            {location.pathname === '/Calendar' && selectedRange.startDate && selectedRange.endDate && (
                <CalendarModalOverlay onClick = {() => setSelectedRange({ startDate: null, endDate: null })}>
                    <CalendarModalContent onClick = {(event) => event.stopPropagation()}>
                        <CalendarModalCloseButton type = "button" onClick = {() => setSelectedRange({ startDate: null, endDate: null })}> x </CalendarModalCloseButton>
                        <CalendarRightScreen selectedRange = { selectedRange } />
                    </CalendarModalContent>
                </CalendarModalOverlay>
            )}
            <MobileBottomNav>
                <MobileBottomNavItem to = "/Start"> 👋🏻 </MobileBottomNavItem>
                <MobileBottomNavItem to = "/MainChat" onClick = {() => handleMobileNavClick('/MainChat')}> 💬 </MobileBottomNavItem>
                <MobileBottomNavItem to = "/Simulation" onClick = {() => handleMobileNavClick('/Simulation')}> 👥 </MobileBottomNavItem>
                <MobileBottomNavItem to = "/Calendar"> 📅 </MobileBottomNavItem>
                <MobileBottomNavItem to = "/History"> 📄 </MobileBottomNavItem>
                <MobileBottomNavItem to = "/Mypage"> 👤 </MobileBottomNavItem>
            </MobileBottomNav>
        </FullScreen>
    )
}