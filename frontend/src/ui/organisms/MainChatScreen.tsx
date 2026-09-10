import { useEffect, useRef, useState } from 'react'
import { useLocation, useOutletContext } from 'react-router-dom'

import { apiFetch } from '../../api/client'
import type { ChatMessage, ChatSession } from '../../types/chat'
import type { AppShellOutletContext } from '../template/AppShell'
import { AppShellPortal } from '../template/AppShellPortal'
import RightScreen from '../template/RightScreen'
import MainChatTextInputBox from '../molecules/MainChatTextInputBox'
import ChatMessagesList from '../molecules/ChatMessagesList'
import InitialMainChatModal from '../molecules/InitialMainChatModal'
import MainChatRightScreen from './MainChatRightScreen'
import type { MainChatRightScreenRef } from './MainChatRightScreen'

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
    session: ChatSession;
    messages: ApiMessage[];
}

export default function MainChatScreen() {
    const { isMobileRightOpen } = useOutletContext<AppShellOutletContext>();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [eValue, setEValue] = useState<number>(50);
    const [sValue, setSValue] = useState<number>(50);
    const [fValue, setFValue] = useState<number>(50);
    const [pValue, setPValue] = useState<number>(50);
    const [mainChatMessages, setMainChatMessages] = useState<ChatMessage[]>([]);
    const [selectedMainChatSessionId, setSelectedMainChatSessionId] = useState<string | null>(null);
    const mainChatRightScreenRef = useRef<MainChatRightScreenRef | null>(null);
    const isBlockingModalOpen = !selectedMainChatSessionId;

    useEffect(() => {
        const reset = (location.state as { reset?: number } | null)?.reset;
        if (!reset) return;
        setSelectedMainChatSessionId(null);
        setMainChatMessages([]);
    }, [location.state]);

    async function getMainChatSessionMessages(sessionId: string) {
        const data = await apiFetch<ChatSessionMessagesResponse>(`/api/chatMessage/sessions/${sessionId}`);
        const messages: ChatMessage[] = data.messages.map((message) => ({
            id: message.id,
            role: message.role === 'USER' ? 'user' : 'ai',
            content: message.content,
            mbtiRange: {
                eValue,
                sValue,
                fValue,
                pValue
            },
            createdAt: message.createdAt,
            rate: 0
        }));
        setMainChatMessages(messages);
    }

    async function sendChatMessages(inputValue: string) {
        const trimmedValue = inputValue.trim();
        if (!trimmedValue || isLoading || !selectedMainChatSessionId) return;
        const rightScreenValues = await mainChatRightScreenRef.current?.sendMainChatRightScreenValues();
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
        setMainChatMessages((prev) => [...prev, newUserChatMessage]);
        setIsLoading(true);

        try {
            const body = {
                content: trimmedValue,
                role: 'user',
                mbtiRange: { eValue, sValue, fValue, pValue },
                showBoth: rightScreenValues?.showBoth ?? [],
                pageType: 'main',
                simulationKey: ''
            };
            const data = await apiFetch<PostChatMessageResponse>(`/api/chatMessage/sessions/${selectedMainChatSessionId}/messages`, {
                method: 'POST',
                body
            });
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
                rate: 0
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
                    pValue
                },
                createdAt: new Date().toISOString(),
                rate: 0
            };
            setMainChatMessages((prev) => [...prev, errorMessage]);
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
            setMainChatMessages((prev) =>
                prev.map((chatMessage) =>
                    chatMessage.id === messageId ? { ...chatMessage, rate } : chatMessage
                )
            );
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            {isBlockingModalOpen && (
                <AppShellPortal>
                    <InitialMainChatModal onConfirm = {() => {}}
                        onSelectHistory = {(history) => {
                            setSelectedMainChatSessionId(history.id);
                            getMainChatSessionMessages(history.id);
                        }}
                    />
                </AppShellPortal>
            )}
            {!isBlockingModalOpen && (
                <>
                    <ChatMessagesList messages = { mainChatMessages } onRate = { patchChatMessageRate } />
                    <MainChatTextInputBox onSubmit = { sendChatMessages } disabled = { isLoading || !selectedMainChatSessionId } />
                    <RightScreen isMobileOpen = { isMobileRightOpen }>
                        <MainChatRightScreen ref = { mainChatRightScreenRef } eValues = { eValue } sValues = { sValue } fValues = { fValue } pValues = { pValue } setEValues = { setEValue } setSValues = { setSValue } setFValues = { setFValue } setPValues = { setPValue } />
                    </RightScreen>
                </>
            )}
        </>
    );
}
