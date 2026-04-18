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

interface RightScreenProps {
    eValues: number;
    sValues: number;
    fValues: number;
    pValues: number;
    setEValues: React.Dispatch<React.SetStateAction<number>>;
    setSValues: React.Dispatch<React.SetStateAction<number>>;
    setFValues: React.Dispatch<React.SetStateAction<number>>;
    setPValues: React.Dispatch<React.SetStateAction<number>>;
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

export default function RightScreen({ eValues, sValues, fValues, pValues, setEValues, setSValues, setFValues, setPValues }: RightScreenProps) {
    const [clickedEI, setClickedEI] = useState<boolean>(false);
    const [clickedSN, setClickedSN] = useState<boolean>(false);
    const [clickedFT, setClickedFT] = useState<boolean>(false);
    const [clickedPJ, setClickedPJ] = useState<boolean>(false);

    const sendMbtiRange = async() => {
        const mbtiRange: MbtIRangeRequest = { eValue: eValues, sValue: sValues, fValue: fValues, pValue: pValues };
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
                throw new Error('Failed to send mbtiRange')
            }
            const data = await response.json()
        } catch (error) {
            console.error('Error transmitting mbtiRange:', error)
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
                throw new Error('TwoMBTIs transmission failed')
            }
            const data = await response.json()
        } catch (error) {
            console.error('Error transmitting twoMBTIs:', error)
        }
    }

    return(
        <RightScreenStyled>
            <Title title = 'MBTI' />
            <RangeBar leftMbtiLetter = 'E' rightMbtiLetter = 'I' value = { eValues } onChange={(e) => setEValues(Number(e))} />
            <RangeBar leftMbtiLetter = 'S' rightMbtiLetter = 'N' value = { sValues } onChange={(e) => setSValues(Number(e))} />
            <RangeBar leftMbtiLetter = 'F' rightMbtiLetter = 'T' value = { fValues } onChange={(e) => setFValues(Number(e))} />
            <RangeBar leftMbtiLetter = 'P' rightMbtiLetter = 'J' value = { pValues } onChange={(e) => setPValues(Number(e))} />
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