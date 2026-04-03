import styled from '@emotion/styled'

const InvisibleCheckbox = styled.input<{isOpen?: boolean}>`
    display: none;

    & + label {
        position: relative; 
        display: block;
        width: ${({ isOpen }) => isOpen ? '5vw' : '2.5vw'};
        height: 3vh;
        left: ${({ isOpen }) => isOpen ? '3.5vw' : '1.5vw'};
        top: ${({ isOpen }) => isOpen ? '1.3vh' : '0.3vh'};
        cursor: pointer;
    }

    & + label > span {
        position: absolute;
        display: block;
        width: 100%;
        height: 0.5vh;
        border-radius: 10px;
        background: ${({ theme }) => theme.colors.paleLavender};
        transition: all 0.35s;
        z-index: 2;
        left: 0;
    }

    & + label > span:nth-child(1) {
        top: 0;
    }

    & + label > span:nth-child(2) {
        top: 50%;
        transform: translateY(-50%);
    }

    & + label > span:nth-child(3) {
        bottom: 0;
    }

    &:checked + label > span:nth-child(1) {
        top: 50%;
        transform: translateY(-50%) rotate(45deg);
    }

    &:checked + label > span:nth-child(2) {
        opacity: 0;
    }

    &:checked + label > span:nth-child(3) {
        bottom: 50%;
        transform: translateY(50%) rotate(-45deg);
    }
`;

const HamburgerSticks = styled.label`
    display: block;
`;

interface HamburgerProps {
    isClicked?: () => void;
    isOpen?: boolean;
}

export function Hamburger({ isClicked, isOpen }: HamburgerProps) {
    return (
        <>
            <InvisibleCheckbox type='checkbox' id='icon' onChange={ isClicked } isOpen = { isOpen } />
            <HamburgerSticks htmlFor='icon'>
                <span></span>
                <span></span>
                <span></span>
            </HamburgerSticks>
        </>
    )
}