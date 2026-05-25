import styled from '@emotion/styled'
import { useEffect, useState, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

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

interface ChatSession {
    id: string;
    userId: string;
    title: string | null;
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;
    _count?: {
        messages: number;
    };
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

const DesktopOnlyHamburger = styled.div`
    display: block;

    @media screen and (max-width: 767px) {
        display: none;
    }
`;

const API_BASE_URL = 'http://localhost:4000';

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
    const [showOldSimulationModal, setShowOldSimulationModal] = useState<boolean>(false);
    const [mainChatMessages, setMainChatMessages] = useState<ChatMessage[]>([]);
    const [simulationChatMessages, setSimulationChatMessages] = useState<Record<string, ChatMessage[]>>({});
    const [selectedRange, setSelectedRange] = useState<SelectedRange>({
        startDate: null,
        endDate: null,
    });
    const [selectedChatSession, setSelectedChatSession] = useState<ChatSession | null>(null);
    const [selectedMainChatSessionId, setSelectedMainChatSessionId] = useState<string | null>(null);

    const location = useLocation();
    const hasRightScreen = location.pathname === '/' || location.pathname === '/MainChat' || location.pathname === '/Calendar' || location.pathname === '/Simulation';
    const isSimulationPage = location.pathname === '/Simulation';
    const selectedSimulationKey = useMemo(() => {
        if (!selectedName || !selectedMbti || !selectedScenario) {
            return '';
        }
        return `${selectedName}-${selectedMbti}-${selectedScenario}`;
    }, [selectedName, selectedMbti, selectedScenario]);
    const isReadySimulation = isSimulationPage && showSimulation && selectedSimulationKey !== '';
    const isSimulationModalOpen = isSimulationPage && !showSimulation;
    const currentChatMessages = isSimulationPage
        ? isReadySimulation
            ? simulationChatMessages[selectedSimulationKey] ?? []
            : []
        : mainChatMessages;

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
            setShowOldSimulationModal(false);
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
            const url = onSimPage && key ? `http://localhost:4000/api/chat?pageType=simulation&simulationKey=${encodeURIComponent(key)}` : 'http://localhost:4000/api/chat?pageType=main';
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
            const response = await fetch(`${API_BASE_URL}/api/chatMessage/sessions/${selectedMainChatSessionId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    content: trimmedValue,
                    role: 'user',
                    mbtiRange: {
                        eValue,
                        sValue,
                        fValue,
                        pValue,
                    },
                    pageType: isSimulationPage ? 'simulation' : 'main',
                    simulationKey: isSimulationPage ? selectedSimulationKey : '',
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to post chatMessage');
            }
            const data = await response.json();
            if (isSimulationPage) {
                setSimulationChatMessages((prev) => ({
                    ...prev,
                    [selectedSimulationKey]: data,
                }));
                return;
            }
            const assistantMessage: ChatMessage = {
                id: data.assistantMessage.id,
                role: 'ai',
                content: data.assistantMessage.content,
                mbtiRange: {
                    eValue,
                    sValue,
                    fValue,
                    pValue
                },
                createdAt: data.assistantMessage.createdAt,
                rate: 0,
            };
            setMainChatMessages((prev) => [...prev, assistantMessage]);
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
            const response = await fetch(`${API_BASE_URL}/api/chat/${messageId}`, {
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
        const response = await fetch(`${API_BASE_URL}/api/chatMessage/sessions/${sessionId}`, {
            method: 'GET',
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Failed to get main chat session messages');
        }
        const data = await response.json();
        const messages: ChatMessage[] = data.messages.map((message: any) => ({
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
                            <DesktopOnlyHamburger>
                                {!isOpen && (
                                    <Hamburger isClicked = { isClicked } isOpen = { isOpen } /> 
                                )}
                                <Title title = { (location.pathname.replace('/', '') === '' || location.pathname.replace('/', '') === 'MainChat') ? 'Main Chat' : location.pathname.replace('/', '') } />
                            </DesktopOnlyHamburger>
                        </FlexDiv>
                    </HeaderDiv>
                    {location.pathname === '/Start' && <StartPageAfterLogin />};
                    {(location.pathname === '/' || location.pathname === '/MainChat' || location.pathname === '/Simulation') && <ChatMessagesDiv>
                        {!isSimulationModalOpen && currentChatMessages.map((chatMessage) => (
                            <ChatRow key = {chatMessage.id} role = { chatMessage.role }>
                                {chatMessage.role === 'user' ? (
                                    <UserChat content = { chatMessage.content } />
                                ) : (
                                    <AiChat messageId = { chatMessage.id } content = { chatMessage.content } selectedRating = { chatMessage.rate } onRate = { patchChatMessageRate } />
                                )}
                            </ChatRow>
                        ))}
                    </ChatMessagesDiv>}
                    {(location.pathname === '/' || location.pathname === '/MainChat') && !isSimulationModalOpen && (<MainChatTextInputBox onSubmit = { sendChatMessages } disabled = { isLoading } /> )}
                    {(location.pathname === '/Simulation') && !isSimulationModalOpen && (<SimulationTextInputBox onSubmit = { sendChatMessages } disabled = { isLoading } /> )}
                    {location.pathname === '/Calendar' && <CalendarScreen selectedRange = { selectedRange } setSelectedRange = { setSelectedRange } />}
                    {location.pathname === '/History' && <HistoryScreen />}
                    {location.pathname === '/Mypage' && <MypageScreen />}
                </FlexColumnDiv>
            </MainContent>
            {(location.pathname === '/' || location.pathname === '/MainChat' || location.pathname === '/Simulation' || location.pathname === '/Calendar') && <RightScreen eValues = { eValue } sValues = { sValue } fValues = { fValue } pValues = { pValue } setEValues = { setEValue } setSValues = { setSValue } setFValues = { setFValue } setPValues = { setPValue } showSimulation = { showSimulation } selectedScenario = { selectedScenario } selectedName = { selectedName } selectedMbti = { selectedMbti } selectedRange = { selectedRange } />}
        </FullScreen>
    );
}