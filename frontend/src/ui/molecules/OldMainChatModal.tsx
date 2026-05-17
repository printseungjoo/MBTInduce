import styled from '@emotion/styled'
import { useState, useEffect } from 'react'

import GoBackButton from '../atoms/GoBackButton'
import OldMainChatButton from '../atoms/OldMainChatButton'

interface OldMainChatModalProps {
    onConfirm: () => void;
    onSelectHistory: (history: ChatSession) => void;
}

interface ChatSession {
    id: string;
    userId: string;
    title: string | null;
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;
    _count: {
        messages: number;
    };
}

const OldMainChatModalStyled = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.4);
    z-index: 3;
`;

const CenterBox = styled.div`
    width: 50vw;
    background-color: ${({ theme }) => theme.colors.lightWhite};
    border-radius: 1rem;
    padding: 2vh 1vw;
    display: flex;
    flex-direction: column;
    gap: 1.5vh;
`;

const NoChatText = styled.p`
    color: ${({ theme }) => theme.colors.deepPlum};
    font-weight: bold;
    text-align: center;
`;

export default function OldMainChatModal({ onConfirm, onSelectHistory }: OldMainChatModalProps) {
    const [remove, setRemove] = useState<boolean>(false);
    const [chatSessions, setChatSessions] = useState<ChatSession[] | null>(null);

    const removeModal = () => {
        setRemove(true);
        onConfirm();
    }

    const clickHistory = (selectedHistory: ChatSession) => {
        onSelectHistory(selectedHistory);
        removeModal();
    }

    useEffect(() => {
        getChatSessions();
    }, []);

    async function getChatSessions() {
        try {
            const response = await fetch('http://localhost:4000/api/chatMessage/sessions', {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to get chat sessions');
            }
            const data = await response.json();
            setChatSessions(data.sessions);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            {!remove && <OldMainChatModalStyled>
                <CenterBox>
                    {chatSessions?.length === 0 ? ( <NoChatText> There is no chat room left </NoChatText>) : 
                        (chatSessions?.map((c, index) => (
                            <div key = { index } onClick = {() => clickHistory(c)}>
                                <OldMainChatButton chatContent = { c.title } />
                            </div>
                    )))}
                    <GoBackButton />
                </CenterBox>
            </OldMainChatModalStyled>}
        </>
    )
}