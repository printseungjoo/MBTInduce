import styled from '@emotion/styled'

const HamburgerButton = styled.button<{ isOpen?: boolean }>`
    position: relative;
    display: block;
    width: 2rem;
    height: 1.4rem;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;

    span {
        position: absolute;
        left: 0;
        display: block;
        width: 100%;
        height: 0.35vh;
        background: ${({ theme }) => theme.colors.paleLavender};
        transition: all 0.35s;
        border-radius: 0;
    }

    span:nth-child(1) {
        top: ${({ isOpen }) => isOpen ? '50%' : '0.15rem'};
        transform: ${({ isOpen }) => isOpen ? 'translateY(-50%) rotate(45deg)' : 'none'};
    }

    span:nth-child(2) {
        top: 50%;
        transform: translateY(-50%);
        opacity: ${({ isOpen }) => isOpen ? '0' : '1'};
    }

    span:nth-child(3) {
        bottom: ${({ isOpen }) => isOpen ? '50%' : '0.15rem'};
        transform: ${({ isOpen }) => isOpen ? 'translateY(50%) rotate(-45deg)' : 'none'};
    }

    @media screen and (max-width: 767px) {
        width: 2rem;
        height: 1.4rem;

        span {
            height: 0.16rem;
        }
    }
`;

interface HamburgerProps {
    isClicked?: () => void;
    isOpen?: boolean;
}

export default function Hamburger({ isClicked, isOpen = false }: HamburgerProps) {
    return (
        <HamburgerButton type = 'button' onClick = { isClicked } isOpen = { isOpen }>
            <span></span>
            <span></span>
            <span></span>
        </HamburgerButton>
    )
}