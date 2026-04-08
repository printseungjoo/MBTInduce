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
    const [clickedEI, setClickedEI] = useState<boolean>(false);
    const [clickedSN, setClickedSN] = useState<boolean>(false);
    const [clickedFT, setClickedFT] = useState<boolean>(false);
    const [clickedPJ, setClickedPJ] = useState<boolean>(false);

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

    const selectedDualModes: string[] = [];
    function trueThenPush(typeName: string, value: boolean) {
        if (value === true) {
            selectedDualModes.push(typeName);
        }
    }

    const sendTwoMBTIs = async() => {
        trueThenPush('EI', clickedEI);
        trueThenPush('SN', clickedSN);
        trueThenPush('FT', clickedFT);
        trueThenPush('PJ', clickedPJ);
        try {
            const response = await fetch('http://localhost:4000/api/showBoth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(selectedDualModes),
            })
            if (!response.ok) {
                throw new Error('twoMBTIs 전송 실패')
            }
            const data = await response.json()
        } catch (error) {
            console.error('twoMBTIs 전송 중 에러 발생:', error)
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
                <TwoMBTIsButton leftMBTILetter = 'E' rightMBTILetter = 'I' clicked={ clickedEI } onClick={() => setClickedEI(!clickedEI)} />
                <TwoMBTIsButton leftMBTILetter = 'S' rightMBTILetter = 'N' clicked={ clickedSN } onClick={() => setClickedSN(!clickedSN)} />
            </TwoButtons>
            <TwoButtons>
                <TwoMBTIsButton leftMBTILetter = 'F' rightMBTILetter = 'T' clicked={ clickedFT } onClick={() => setClickedFT(!clickedFT)} />
                <TwoMBTIsButton leftMBTILetter = 'P' rightMBTILetter = 'J' clicked={ clickedPJ } onClick={() => setClickedPJ(!clickedPJ)} />
            </TwoButtons>
            <GenerateButtonStyled onClick = { sendTwoMBTIs } />
            <WebsiteIntroStyled content = 'Customize the MBTI before entering your text. Set the MBTI to shape how the response will be generated.' />
        </RightScreenStyled>
    )
}