import styled from '@emotion/styled'

import Skeleton from '../atoms/Skeleton'

interface ListSkeletonProps {
    count?: number;
}

const Item = styled.div`
    background-color: ${({ theme }) => theme.colors.royalPurple};
    width: 98%;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 10px;
    box-sizing: border-box;
    padding: 1vh 1vw;
    display: flex;
    flex-direction: column;
    gap: 1vh;
    margin: 1.5vh 0;

    @media (max-width: 768px) {
        width: calc(100% - 1.5rem);
        padding: 1rem 0.75rem;
        margin: 1rem 0;
    }
`;

export default function ListSkeleton({ count = 3 }: ListSkeletonProps) {
    return (
        <>
            {Array.from({ length: count }, (_, index) => (
                <Item key = { index }>
                    <Skeleton width = '30%' height = '1.1rem' />
                    <Skeleton width = '80%' height = '1rem' />
                    <Skeleton width = '20%' height = '0.9rem' />
                </Item>
            ))}
        </>
    );
}
