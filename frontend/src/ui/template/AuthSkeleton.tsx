import styled from '@emotion/styled'

import Skeleton from '../atoms/Skeleton'

const Screen = styled.div`
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2vh;
    box-sizing: border-box;
    padding: 2rem;
    background-color: ${({ theme }) => theme.colors.midnightPurple};
`;

export default function AuthSkeleton() {
    return (
        <Screen>
            <Skeleton width = 'min(70vw, 22rem)' height = '3.2rem' />
            <Skeleton width = 'min(50vw, 14rem)' height = '1.4rem' />
            <Skeleton width = 'min(40vw, 10rem)' height = '3rem' />
        </Screen>
    );
}
