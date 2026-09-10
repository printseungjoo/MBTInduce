import { useEffect, useMemo, useState } from 'react'
import { useLocation, useOutletContext } from 'react-router-dom'

import { apiFetch } from '../../api/client'
import type { ChatMessage } from '../../types/chat'
import type { AppShellOutletContext } from '../template/AppShell'
import { AppShellPortal } from '../template/AppShellPortal'
import RightScreen from '../template/RightScreen'
import SimulationTextInputBox from '../molecules/SimulationTextInputBox'
import ChatMessagesList from '../molecules/ChatMessagesList'
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
        try {
            const path = key ? `/api/chat?pageType=simulation&simulationKey=${encodeURIComponent(key)}` : `/api/chat?pageType=main`;
            const data = await apiFetch<ChatMessage[]>(path);
            if (key) {
                setSimulationChatMessages((prev) => ({
                    ...prev,
                    [key]: data
                }));
            }
        } catch (error) {
            console.error(error);
        }
    }

    function addCurrentChatMessage(newMessage: ChatMessage) {
        if (!isReadySimulation) return;
        setSimulationChatMessages((prev) => ({
            ...prev,
            [selectedSimulationKey]: [
                ...(prev[selectedSimulationKey] ?? []),
                newMessage
            ]
        }));
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
        addCurrentChatMessage(newUserChatMessage);
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
            const data = await apiFetch<ChatMessage[]>('/api/chat', {
                method: 'POST',
                body
            });
            setSimulationChatMessages((prev) => ({
                ...prev,
                [selectedSimulationKey]: data
            }));
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
            addCurrentChatMessage(errorMessage);
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
                    <ChatMessagesList messages = { currentChatMessages } onRate = { patchChatMessageRate } />
                    <SimulationTextInputBox onSubmit = { sendChatMessages } disabled = { isLoading } />
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
