import styled from '@emotion/styled'
import { useState } from 'react'

import Title from '../atoms/Title'
import RangeBar from '../molecules/RangeBar'
import GenerateButton from '../atoms/GenerateButton'
import TwoMBTIsButton from '../atoms/TwoMBTIsButton'
import WebsiteIntro from '../atoms/WebsiteIntro'

interface MbtIRangeRequest {
    eValue: number;
    sValue: number;
    fValue: number;
    pValue: number;
}

const RightScreenStyled = styled.div`
    width: 20%;
    height: 100vh;
    background-color: ${({ theme }) => theme.colors.deepPlum};
    position: fixed;
    right: 0;
    top: 0;
    box-sizing: border-box;
    padding: 1.5vh 2.5vh;
`;

const GenerateButtonStyled = styled(GenerateButton)`
    margin: 2.8vh 0;
`;

const TwoButtons = styled.div`
    display: flex;
    gap: 1.2vw;
    margin-top: 2vh;
`;

const WebsiteIntroStyled = styled(WebsiteIntro)`
    margin: 0;
    line-height: 3vh;
`;

export default function RightScreen() {
    const [eValue, setEValue] = useState<number>(50);
    const [sValue, setSValue] = useState<number>(50);
    const [fValue, setFValue] = useState<number>(50);
    const [pValue, setPValue] = useState<number>(50);

    const sendMbtiRange = async() => {
        const mbtiRange: MbtIRangeRequest = { eValue, sValue, fValue, pValue };
        try {
            const response = await fetch('http://localhost:4000/api/mbtiRange', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(mbtiRange),
            })
            if (!response.ok) {
                throw new Error('mbtiRange 전송 실패')
            }
            const data = await response.json()
        } catch (error) {
            console.error('mbtiRange 전송 중 에러 발생:', error)
        }
    }

    return(
        <RightScreenStyled>
            <Title title = 'MBTI' />
            <RangeBar leftMbtiLetter = 'E' rightMbtiLetter = 'I' value = {setEValue} />
            <RangeBar leftMbtiLetter = 'S' rightMbtiLetter = 'N' value = {setSValue} />
            <RangeBar leftMbtiLetter = 'F' rightMbtiLetter = 'T' value = {setFValue} />
            <RangeBar leftMbtiLetter = 'P' rightMbtiLetter = 'J' value = {setPValue} />
            <GenerateButtonStyled onClick = { sendMbtiRange } />
            <Title title = 'Show Both' />
            <TwoButtons>
                <TwoMBTIsButton leftMBTILetter = 'E' rightMBTILetter = 'I' />
                <TwoMBTIsButton leftMBTILetter = 'S' rightMBTILetter = 'N' />
            </TwoButtons>
            <TwoButtons>
                <TwoMBTIsButton leftMBTILetter = 'F' rightMBTILetter = 'T' />
                <TwoMBTIsButton leftMBTILetter = 'P' rightMBTILetter = 'J' />
            </TwoButtons>
            <GenerateButtonStyled />
            <WebsiteIntroStyled content = 'Customize the MBTI before entering your text. Set the MBTI to shape how the response will be generated.' />
        </RightScreenStyled>
    )
}