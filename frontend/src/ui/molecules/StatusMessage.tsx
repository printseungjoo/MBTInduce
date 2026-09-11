import styled from '@emotion/styled'

interface StatusMessageProps {
    message: string;
    onRetry?: () => void;
}

const Wrap = styled.div`
    width: 100%;
    flex: 1;
    min-height: 8rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1.5vh;
    padding: 3vh 1vw;
    box-sizing: border-box;
`;

const Message = styled.p`
    color: ${({ theme }) => theme.colors.paleLavender};
    font-weight: bold;
    text-align: center;
`;

const RetryButton = styled.button`
    min-height: 4vh;
    padding: 0 1.5vw;
    font-weight: bolder;
    background-color: ${({ theme }) => theme.colors.coolGray};
    border-radius: 0;
    color: ${({ theme }) => theme.colors.deepBlack};
`;

export default function StatusMessage({ message, onRetry }: StatusMessageProps) {
    return (
        <Wrap>
            <Message> { message } </Message>
            {onRetry && (
                <RetryButton type = "button" onClick = { onRetry }> Try again </RetryButton>
            )}
        </Wrap>
    );
}
