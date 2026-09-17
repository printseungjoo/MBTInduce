import styled from '@emotion/styled'

import Skeleton from '../atoms/Skeleton'

const ChatSkeletonDiv = styled.div`
    width: 100%;
    flex: 1;
    margin: 2vh 0;
    display: flex;
    flex-direction: column;
    gap: 2vh;
    min-height: 0;
    box-sizing: border-box;
`;

const ChatRow = styled.div<{ align: 'start' | 'end' }>`
    display: flex;
    width: 100%;
    justify-content: ${({ align }) => align === 'end' ? 'flex-end' : 'flex-start'};
    padding-right: ${({ align }) => align === 'end' ? '1vw' : '0'};
    padding-left: ${({ align }) => align === 'start' ? '1vw' : '0'};
    box-sizing: border-box;
`;

export default function ChatSkeleton() {
    return (
        <ChatSkeletonDiv>
            <ChatRow align = 'end'>
                <Skeleton width = '40%' height = '3.2rem' />
            </ChatRow>
            <ChatRow align = 'start'>
                <Skeleton width = '55%' height = '4.5rem' />
            </ChatRow>
            <ChatRow align = 'end'>
                <Skeleton width = '32%' height = '3.2rem' />
            </ChatRow>
        </ChatSkeletonDiv>
    );
}
