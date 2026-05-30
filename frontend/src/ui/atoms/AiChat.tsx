import styled from '@emotion/styled'
import { useState } from 'react'

interface AiChatProps {
    messageId: string;
    content: string;
    selectedRating?: number;
    onRate: (messageId: string, rating: number) => void;
}

interface ShowBothBlockContent {
    label: string;
    content: string;
}

interface ShowBothContent {
    type: 'SHOW_BOTH';
    axis: string;
    blocks: ShowBothBlockContent[];
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

    @media screen and (max-width: 767px) {
        max-width: 82vw;
        padding: 0.55rem 0.7rem;
        font-size: 0.9rem;
        line-height: 1.35;
    }
`;

const StarsRow = styled.div`
    display: flex;
    gap: 0.3vw;
    margin-top: 1vh;

    @media screen and (max-width: 767px) {
        margin-top: 0.2rem;
    }
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

    @media screen and (max-width: 767px) {
        font-size: 0.9rem;
        padding: 0.1rem;
    }
`;

const ShowBothWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
`;

const ShowBothBlock = styled.div`
    border: 1px solid ${({ theme }) => theme.colors.paleLavender};
    padding: 0.7rem;
`;

const ShowBothTitle = styled.div`
    font-weight: 700;
    margin-bottom: 0.4rem;
`;

export default function AiChat({ messageId, content, selectedRating, onRate }: AiChatProps) {
    const [hovered, setHovered] = useState<number | null>(null);
    const [localRating, setLocalRating] = useState<number | undefined>(selectedRating);

    function parseShowBothContent(content: string) {
        try {
            const parsed = JSON.parse(content) as ShowBothContent;
            if (parsed?.type === 'SHOW_BOTH' && Array.isArray(parsed.blocks)) {
                return parsed;
            }
        } catch {
            return null;
        }
        return null;
    }

    const showBothContent = parseShowBothContent(content);

    return (
        <AiChatStyled>
            {showBothContent ? (
                <ShowBothWrapper>
                    {showBothContent.blocks.map((block) => (
                        <ShowBothBlock key = { block.label }>
                            <ShowBothTitle> { block.label } </ShowBothTitle>
                            <div> { block.content } </div>
                        </ShowBothBlock>
                    ))}
                </ShowBothWrapper>
            ) : (
                <div> { content } </div>
            )}
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