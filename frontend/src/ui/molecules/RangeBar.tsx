import styled from '@emotion/styled'

import Title from '../atoms/Title'

interface RangeBarProps {
    leftMbtiLetter: string;
    rightMbtiLetter: string;
    value: number;
    onChange?: (e: number) => void;
}

const Percentage = styled.div`
    display: flex;
    color: ${({ theme }) => theme.colors.lightWhite};
    justify-content: space-between;
`;

const RangeBarDiv = styled.div`
    display: flex;
    gap: 1vw;
`;

const Center = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 2rem;
    flex: 0 0 1.5rem;
`;

const RangeBarStick = styled.input`
    width: 100%;
    appearance: none;
    background-color: transparent;
    cursor: pointer;

    &:focus {
        outline: none;
    }

    &::-webkit-slider-runnable-track {
        height: 0.5vh;
        background-color: ${({ theme }) => theme.colors.lightWhite};
    }

    &::-moz-range-track {
        height: 0.5vh;
        background-color: ${({ theme }) => theme.colors.lightWhite};
    }

    &::-webkit-slider-thumb {
        appearance: none;
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        background-color: ${({ theme }) => theme.colors.lightWhite};
        border: none;
        box-sizing: border-box;
        margin-top: calc((0.5vh - 1rem) / 2);
    }

    &::-moz-range-thumb {
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        background-color: ${({ theme }) => theme.colors.lightWhite};
        border: none;
        box-sizing: border-box;
    }
`;

export default function RangeBar({ leftMbtiLetter, rightMbtiLetter, value, onChange }: RangeBarProps) {
    return (
        <>
            <Percentage>
                <span> {100 - value}% </span>
                <span> { value }% </span>
            </Percentage>
            <RangeBarDiv>
                <Center>
                    <Title title = { leftMbtiLetter } />
                </Center>
                <RangeBarStick type = 'range' min = '0' max = '100' value = { value } onChange = {(e) => onChange?.(Number(e.target.value))} />
                <Center>
                    <Title title = { rightMbtiLetter } />
                </Center>
            </RangeBarDiv>
        </>
    )
}