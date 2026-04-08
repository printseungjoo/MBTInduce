import styled from '@emotion/styled'
import { useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'

import Title from '../atoms/Title'

interface RangeBarProps {
    leftMbtiLetter: string;
    rightMbtiLetter: string;
    value: Dispatch<SetStateAction<number>>;
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
    width: 1.5vw;
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
        width: 1vw;
        height: 2vh;
        border-radius: 50%;
        background-color: ${({ theme }) => theme.colors.lightWhite};
        border: none;
        box-sizing: border-box;
        margin-top: -0.75vh;
    }

    &::-moz-range-thumb {
        appearance: none;
        width: 1vw;
        height: 2vh;
        border-radius: 50%;
        background-color: ${({ theme }) => theme.colors.lightWhite};
        border: none;
        box-sizing: border-box;
        margin-top: -0.75vh;
    }
`;

export default function RangeBar({ leftMbtiLetter, rightMbtiLetter }: RangeBarProps) {
    const [percentage, setPercentage] = useState<number>(0);

    return (
        <>
            <Percentage>
                <span> { percentage }% </span>
                <span> {100 - percentage}% </span>
            </Percentage>
            <RangeBarDiv>
                <Center>
                    <Title title = { leftMbtiLetter } />
                </Center>
                <RangeBarStick type = 'range' min = '0' max = '100' value = { percentage } onChange = {(e) => setPercentage(Number(e.target.value))} />
                <Center>
                    <Title title = { rightMbtiLetter } />
                </Center>
            </RangeBarDiv>
        </>
    )
}