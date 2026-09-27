import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'

interface LoadingBlockProps {
    message?: string;
}

const spin = keyframes`
    to {
        transform: rotate(360deg);
    }
`;

const Wrap = styled.div`
    width: 100%;
    min-height: 8rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1.4vh;
    padding: 2vh 0;
    box-sizing: border-box;
`;

const Spinner = styled.div`
    width: 2rem;
    height: 2rem;
    border: 2px solid ${({ theme }) => theme.colors.coolGray};
    border-top-color: ${({ theme }) => theme.colors.mutedViolet};
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite;
`;

const Message = styled.p`
    color: ${({ theme }) => theme.colors.mutedViolet};
    font-weight: bold;
    text-align: center;
`;

export default function LoadingBlock({ message = 'Loading...' }: LoadingBlockProps) {
    return (
        <Wrap>
            <Spinner />
            <Message> { message } </Message>
        </Wrap>
    );
}
