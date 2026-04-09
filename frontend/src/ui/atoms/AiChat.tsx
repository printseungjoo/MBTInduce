import styled from '@emotion/styled'
import { useState } from 'react'

interface AiChatProps {
    messageId: string;
    content: string;
    selectedRating?: number;
    onRate: (messageId: string, rating: number) => void;
}

const AiChatStyled = styled.div`
    max-width: 60vw;
    background-color: ${({ theme }) => theme.colors.mutedViolet};
    color: ${({ theme }) => theme.colors.lightWhite};
    padding: 0.8vh 1vw;
    border-radius: 0;
    font-size: 1.2rem;
    line-height: 1.35;
    word-break: break-word;
`;

const StarsRow = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 0.3vw;
    margin-top: 1vh;
`;

const StarButton = styled.button<{ active: boolean }>`
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 0;
    font-size: 1vw;
    color: ${({ theme, active }) => (active ? theme.colors.softYellow : theme.colors.lightWhite)};
    transition: color 0.2s ease;
    outline: none;
`;

export default function AiChat({ messageId, content, selectedRating, onRate }: AiChatProps) {
    const [hovered, setHovered] = useState<number | null>(null);
    const [localRating, setLocalRating] = useState<number | undefined>(selectedRating);

    return (
        <AiChatStyled>
            <div> { content } </div>
            <StarsRow>
                {[1, 2, 3, 4, 5].map((star) => (
                    <StarButton key = { star } type = "button" active={ hovered !== null ? star <= hovered : (localRating ?? selectedRating ?? 0) >= star} onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(null)} onClick={() => {setLocalRating(star); onRate(messageId, star);}}>
                        ★
                    </StarButton>
                ))}
            </StarsRow>
        </AiChatStyled>
    );
}