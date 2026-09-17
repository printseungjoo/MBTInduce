import { useEffect, useRef, useState } from 'react'
import { useLocation, useOutletContext } from 'react-router-dom'

import { apiFetch, apiStream, getStreamDeltaText } from '../../api/client'
import type { ChatMessage, ChatSession } from '../../types/chat'
import type { AppShellOutletContext } from '../template/AppShell'
import { AppShellPortal } from '../template/AppShellPortal'
import RightScreen from '../template/RightScreen'
import ChatTextInputBox from '../molecules/ChatTextInputBox'
import ChatMessagesList from '../molecules/ChatMessagesList'
import ChatSkeleton from '../molecules/ChatSkeleton'
import StatusMessage from '../molecules/StatusMessage'
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
    assistantMessage: ApiMessage | null;
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

function toAssistantChatMessages(
    messages: Array<ApiMessage | null | undefined>,
    mbtiRange: ChatMessage['mbtiRange']
): ChatMessage[] {
    return messages
        .filter((message): message is ApiMessage => Boolean(message))
        .map((message) => ({
            id: message.id,
            role: 'ai' as const,
            content: message.content,
            mbtiRange,
            createdAt: message.createdAt,
            rate: 0
        }));
}

function readStreamDoneResult(data: unknown): PostChatMessageResponse | null {
    if (!data || typeof data !== 'object' || !('userMessage' in data)) {
        return null;
    }
    const result = data as PostChatMessageResponse;
    if (!result.userMessage) {
        return null;
    }
    return result;
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
    const [messagesStatus, setMessagesStatus] = useState<'loading' | 'ready' | 'error'>('ready');
    const [selectedMainChatSessionId, setSelectedMainChatSessionId] = useState<string | null>(null);
    const mainChatRightScreenRef = useRef<MainChatRightScreenRef | null>(null);
    const isBlockingModalOpen = !selectedMainChatSessionId;

    useEffect(() => {
        const reset = (location.state as { reset?: number } | null)?.reset;
        if (!reset) return;
        setSelectedMainChatSessionId(null);
        setMainChatMessages([]);
        setMessagesStatus('ready');
    }, [location.state]);

    async function getMainChatSessionMessages(sessionId: string) {
        setMessagesStatus('loading');
        try {
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
            setMessagesStatus('ready');
        } catch (error) {
            console.error(error);
            setMainChatMessages([]);
            setMessagesStatus('error');
        }
    }

    async function sendChatMessages(inputValue: string) {
        const trimmedValue = inputValue.trim();
        if (!trimmedValue || isLoading || !selectedMainChatSessionId) return;
        const rightScreenValues = await mainChatRightScreenRef.current?.sendMainChatRightScreenValues();
        const mbtiRange = rightScreenValues?.mbtiRange ?? {
            eValue,
            sValue,
            fValue,
            pValue
        };
        const showBoth = rightScreenValues?.showBoth ?? [];
        const newUserChatMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            content: trimmedValue,
            mbtiRange,
            createdAt: new Date().toISOString(),
            rate: 0
        };
        const pendingAssistantId = crypto.randomUUID();
        const usesStream = showBoth.length === 0;
        if (usesStream) {
            const pendingAssistant: ChatMessage = {
                id: pendingAssistantId,
                role: 'ai',
                content: '',
                mbtiRange,
                createdAt: new Date().toISOString(),
                rate: 0,
                isStreaming: true
            };
            setMainChatMessages((prev) => [...prev, newUserChatMessage, pendingAssistant]);
        } else {
            setMainChatMessages((prev) => [...prev, newUserChatMessage]);
        }
        setIsLoading(true);

        const body = {
            content: trimmedValue,
            role: 'user',
            mbtiRange: { eValue, sValue, fValue, pValue },
            showBoth,
            pageType: 'main',
            simulationKey: ''
        };

        try {
            if (!usesStream) {
                const data = await apiFetch<PostChatMessageResponse>(`/api/chatMessage/sessions/${selectedMainChatSessionId}/messages`, {
                    method: 'POST',
                    body
                });
                const assistantSourceMessages = data.assistantMessages ?? [data.assistantMessage];
                setMainChatMessages((prev) => [...prev, ...toAssistantChatMessages(assistantSourceMessages, mbtiRange)]);
                return;
            }

            await apiStream(`/api/chatMessage/sessions/${selectedMainChatSessionId}/messages/stream`, {
                method: 'POST',
                body,
                onEvent: (event, data) => {
                    if (event === 'delta') {
                        const text = getStreamDeltaText(data);
                        if (!text) return;
                        setMainChatMessages((prev) =>
                            prev.map((message) =>
                                message.id === pendingAssistantId
                                    ? { ...message, content: message.content + text }
                                    : message
                            )
                        );
                        return;
                    }
                    if (event !== 'done') return;
                    const result = readStreamDoneResult(data);
                    if (!result) return;
                    const assistantSourceMessages = result.assistantMessages ?? [result.assistantMessage];
                    setMainChatMessages((prev) => {
                        const withoutTemp = prev.filter((message) =>
                            message.id !== pendingAssistantId && message.id !== newUserChatMessage.id
                        );
                        const userMessage: ChatMessage = {
                            id: result.userMessage.id,
                            role: 'user',
                            content: result.userMessage.content,
                            mbtiRange,
                            createdAt: result.userMessage.createdAt,
                            rate: 0
                        };
                        return [...withoutTemp, userMessage, ...toAssistantChatMessages(assistantSourceMessages, mbtiRange)];
                    });
                }
            });
        } catch (error) {
            console.error(error);
            const errorMessage: ChatMessage = {
                id: crypto.randomUUID(),
                role: 'ai',
                content: 'Sorry. Please try later.',
                mbtiRange,
                createdAt: new Date().toISOString(),
                rate: 0
            };
            setMainChatMessages((prev) => {
                const withoutPending = prev.filter((message) => message.id !== pendingAssistantId);
                return [...withoutPending, errorMessage];
            });
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
                    { messagesStatus === 'loading' && <ChatSkeleton /> }
                    { messagesStatus === 'error' && (
                        <StatusMessage message = 'Could not load messages.'
                            onRetry = {() => {
                                if (selectedMainChatSessionId) {
                                    getMainChatSessionMessages(selectedMainChatSessionId);
                                }
                            }}
                        />
                    )}
                    { messagesStatus === 'ready' && mainChatMessages.length === 0 && (
                        <StatusMessage message = 'No messages yet' />
                    )}
                    { messagesStatus === 'ready' && mainChatMessages.length > 0 && (
                        <ChatMessagesList messages = { mainChatMessages } onRate = { patchChatMessageRate } />
                    )}
                    <ChatTextInputBox page = 'main' onSubmit = { sendChatMessages } disabled = { isLoading || !selectedMainChatSessionId } />
                    <RightScreen isMobileOpen = { isMobileRightOpen }>
                        <MainChatRightScreen ref = { mainChatRightScreenRef } eValues = { eValue } sValues = { sValue } fValues = { fValue } pValues = { pValue } setEValues = { setEValue } setSValues = { setSValue } setFValues = { setFValue } setPValues = { setPValue } />
                    </RightScreen>
                </>
            )}
        </>
    );
}
