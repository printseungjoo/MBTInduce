import styled from '@emotion/styled'

const InvisibleCheckbox = styled.input`
    display: none;

    & + label {
        position: absolute;
        display: block;
        left: 1%;
        top: 2.5%;
        width: 2.5%;
        height: 3vh;
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
}

export function Hamburger({ isClicked }: HamburgerProps) {
    return (
        <>
            <InvisibleCheckbox type = 'checkbox' id = 'icon' onChange = { isClicked } />
            <HamburgerSticks htmlFor = 'icon'>
                <span></span>
                <span></span>
                <span></span>
            </HamburgerSticks>
        </>
    )
}