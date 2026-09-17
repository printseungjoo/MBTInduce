import { useEffect, useMemo, useState } from 'react'
import { useLocation, useOutletContext } from 'react-router-dom'

import { apiFetch, apiStream, getStreamDeltaText } from '../../api/client'
import type { ChatMessage } from '../../types/chat'
import type { AppShellOutletContext } from '../template/AppShell'
import { AppShellPortal } from '../template/AppShellPortal'
import RightScreen from '../template/RightScreen'
import ChatTextInputBox from '../molecules/ChatTextInputBox'
import ChatMessagesList from '../molecules/ChatMessagesList'
import ChatSkeleton from '../molecules/ChatSkeleton'
import StatusMessage from '../molecules/StatusMessage'
import InitialSimulationModal from '../molecules/InitialSimulationModal'
import SimulationRightScreen from './SimulationRightScreen'

export default function SimulationScreen() {
    const { isMobileRightOpen } = useOutletContext<AppShellOutletContext>();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const eValue = 50;
    const sValue = 50;
    const fValue = 50;
    const pValue = 50;
    const [showSimulation, setShowSimulation] = useState<boolean>(false);
    const [selectedScenario, setSelectedScenario] = useState<string>('');
    const [selectedName, setSelectedName] = useState<string>('');
    const [selectedMbti, setSelectedMbti] = useState<string>('');
    const [simulationChatMessages, setSimulationChatMessages] = useState<Record<string, ChatMessage[]>>({});
    const [messagesStatus, setMessagesStatus] = useState<'loading' | 'ready' | 'error'>('ready');
    const selectedSimulationKey = useMemo(() => {
        if (!selectedName || !selectedMbti || !selectedScenario) {
            return '';
        }
        return `${selectedName}-${selectedMbti}-${selectedScenario}`;
    }, [selectedName, selectedMbti, selectedScenario]);
    const isReadySimulation = showSimulation && selectedSimulationKey !== '';
    const isBlockingModalOpen = !showSimulation;
    const currentChatMessages = isReadySimulation ? simulationChatMessages[selectedSimulationKey] ?? [] : [];

    useEffect(() => {
        const reset = (location.state as { reset?: number } | null)?.reset;
        if (!reset) return;
        setShowSimulation(false);
        setSelectedScenario('');
        setSelectedName('');
        setSelectedMbti('');
        setMessagesStatus('ready');
    }, [location.state]);

    useEffect(() => {
        if (isReadySimulation && selectedSimulationKey) {
            getChatMessages(selectedSimulationKey);
        }
    }, [isReadySimulation, selectedSimulationKey]);

    useEffect(() => {
        if (showSimulation && selectedSimulationKey) {
            getChatMessages();
        }
    }, [showSimulation, selectedSimulationKey]);

    async function getChatMessages(simKey?: string) {
        const key = simKey ?? selectedSimulationKey;
        setMessagesStatus('loading');
        try {
            const path = key ? `/api/chat?pageType=simulation&simulationKey=${encodeURIComponent(key)}` : `/api/chat?pageType=main`;
            const data = await apiFetch<ChatMessage[]>(path);
            if (key) {
                setSimulationChatMessages((prev) => ({
                    ...prev,
                    [key]: data
                }));
            }
            setMessagesStatus('ready');
        } catch (error) {
            console.error(error);
            setMessagesStatus('error');
        }
    }

    const handleSelectHistory = (h: { scenario: string, name: string, mbti: string }) => {
        setSelectedScenario(h.scenario);
        setSelectedName(h.name);
        setSelectedMbti(h.mbti);
        setShowSimulation(true);
    };

    const handleConfirm = () => {
        setShowSimulation(true);
    };

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
                pValue
            },
            createdAt: new Date().toISOString(),
            rate: 0
        };
        const pendingAssistantId = crypto.randomUUID();
        const pendingAssistant: ChatMessage = {
            id: pendingAssistantId,
            role: 'ai',
            content: '',
            mbtiRange: {
                eValue,
                sValue,
                fValue,
                pValue
            },
            createdAt: new Date().toISOString(),
            rate: 0,
            isStreaming: true
        };
        setSimulationChatMessages((prev) => ({
            ...prev,
            [selectedSimulationKey]: [
                ...(prev[selectedSimulationKey] ?? []),
                newUserChatMessage,
                pendingAssistant
            ]
        }));
        setIsLoading(true);

        try {
            const body = {
                content: trimmedValue,
                role: 'user',
                mbtiRange: { eValue, sValue, fValue, pValue },
                showBoth: [],
                pageType: 'simulation',
                simulationKey: selectedSimulationKey
            };
            await apiStream('/api/chat/stream', {
                method: 'POST',
                body,
                onEvent: (event, data) => {
                    if (event === 'delta') {
                        const text = getStreamDeltaText(data);
                        if (!text) return;
                        setSimulationChatMessages((prev) => ({
                            ...prev,
                            [selectedSimulationKey]: (prev[selectedSimulationKey] ?? []).map((chatMessage) =>
                                chatMessage.id === pendingAssistantId
                                    ? { ...chatMessage, content: chatMessage.content + text } : chatMessage
                            )
                        }));
                        return;
                    }
                    if (event !== 'done') return;
                    if (!data || typeof data !== 'object' || !('messages' in data) || !Array.isArray(data.messages)) {
                        return;
                    }
                    const messages = data.messages as ChatMessage[];
                    setSimulationChatMessages((prev) => ({
                        ...prev,
                        [selectedSimulationKey]: messages
                    }));
                }
            });
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
                    pValue
                },
                createdAt: new Date().toISOString(),
                rate: 0
            };
            setSimulationChatMessages((prev) => ({
                ...prev,
                [selectedSimulationKey]: [
                    ...(prev[selectedSimulationKey] ?? []).filter((chatMessage) => chatMessage.id !== pendingAssistantId),
                    errorMessage
                ]
            }));
        } finally {
            setIsLoading(false);
        }
    }

    async function patchChatMessageRate(messageId: string, rate: number) {
        try {
            await apiFetch(`/api/chat/${messageId}`, {
                method: 'PATCH',
                body: { rate }
            });
            setSimulationChatMessages((prev) => ({
                ...prev,
                [selectedSimulationKey]: (prev[selectedSimulationKey] ?? []).map((chatMessage) => chatMessage.id === messageId ? { ...chatMessage, rate } : chatMessage)
            }));
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            {isBlockingModalOpen && (
                <AppShellPortal>
                    <InitialSimulationModal onConfirm = { handleConfirm } onSelectHistory = { handleSelectHistory } />
                </AppShellPortal>
            )}
            {!isBlockingModalOpen && (
                <>
                    { messagesStatus === 'loading' && <ChatSkeleton /> }
                    { messagesStatus === 'error' && (
                        <StatusMessage
                            message = 'Could not load messages.'
                            onRetry = {() => getChatMessages(selectedSimulationKey)}
                        />
                    )}
                    { messagesStatus === 'ready' && currentChatMessages.length === 0 && (
                        <StatusMessage message = 'No messages yet' />
                    )}
                    { messagesStatus === 'ready' && currentChatMessages.length > 0 && (
                        <ChatMessagesList messages = { currentChatMessages } onRate = { patchChatMessageRate } />
                    )}
                    <ChatTextInputBox page = 'simulation' onSubmit = { sendChatMessages } disabled = { isLoading } />
                    {showSimulation && (
                        <RightScreen isMobileOpen = { isMobileRightOpen }>
                            <SimulationRightScreen selectedScenario = { selectedScenario } selectedName = { selectedName } selectedMbti = { selectedMbti } />
                        </RightScreen>
                    )}
                </>
            )}
        </>
    );
}
