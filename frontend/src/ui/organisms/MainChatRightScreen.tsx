import styled from '@emotion/styled'
import { forwardRef, useImperativeHandle, useState } from 'react'

import Title from '../atoms/Title'
import RangeBar from '../molecules/RangeBar'
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

export interface MainChatRightScreenRef {
    sendMainChatRightScreenValues: () => Promise<{
        mbtiRange: {
            eValue: number;
            sValue: number;
            fValue: number;
            pValue: number;
        };
        showBoth: string[];
    }>;
}

const MainChatRightScreenStyled = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.2vh;
`;

const TwoButtons = styled.div`
    display: flex;
    gap: 1.2vw;
    margin-top: 2vh;
`;

const WebsiteIntroStyled = styled(WebsiteIntro)`
    margin-top: 5vh;
    line-height: 3vh;
`;

const MainChatRightScreen = forwardRef<MainChatRightScreenRef, RightScreenProps>(({ eValues, sValues, fValues, pValues, setEValues, setSValues, setFValues, setPValues }, ref) => {
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
        } catch (error) {
            console.error('Error transmitting mbtiRange:', error);
        }
    }
    
    function getSelectedDualModes() {
        const selectedDualModes: string[] = [];
        if (clickedEI) selectedDualModes.push('EI');
        if (clickedSN) selectedDualModes.push('SN');
        if (clickedFT) selectedDualModes.push('FT');
        if (clickedPJ) selectedDualModes.push('PJ');
        return selectedDualModes;
    }
    
    const sendTwoMBTIs = async() => {
        const selectedDualModes = getSelectedDualModes();
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
        } catch (error) {
            console.error('Error transmitting twoMBTIs:', error)
        }
        return selectedDualModes;
    }

    useImperativeHandle(ref, () => ({
        async sendMainChatRightScreenValues() {
            await sendMbtiRange();
            const showBoth = await sendTwoMBTIs();
            return {
                mbtiRange: {
                    eValue: eValues,
                    sValue: sValues,
                    fValue: fValues,
                    pValue: pValues
                },
                showBoth
            };
        }
    }));

    return(
        <MainChatRightScreenStyled>
            <Title title = 'MBTI' />
            <RangeBar leftMbtiLetter = 'E' rightMbtiLetter = 'I' value = { eValues } onChange = {(e) => setEValues(Number(e))} />
            <RangeBar leftMbtiLetter = 'S' rightMbtiLetter = 'N' value = { sValues } onChange = {(e) => setSValues(Number(e))} />
            <RangeBar leftMbtiLetter = 'F' rightMbtiLetter = 'T' value = { fValues } onChange = {(e) => setFValues(Number(e))} />
            <RangeBar leftMbtiLetter = 'P' rightMbtiLetter = 'J' value = { pValues } onChange = {(e) => setPValues(Number(e))} />
            <Title title = 'Show Both' />
            <TwoButtons>
                <TwoMBTIsButton leftMBTILetter = 'E' rightMBTILetter = 'I' clicked = { clickedEI } onClick = {() => setClickedEI(!clickedEI)} />
                <TwoMBTIsButton leftMBTILetter = 'S' rightMBTILetter = 'N' clicked = { clickedSN } onClick = {() => setClickedSN(!clickedSN)} />
            </TwoButtons>
            <TwoButtons>
                <TwoMBTIsButton leftMBTILetter = 'F' rightMBTILetter = 'T' clicked = { clickedFT } onClick = {() => setClickedFT(!clickedFT)} />
                <TwoMBTIsButton leftMBTILetter = 'P' rightMBTILetter = 'J' clicked = { clickedPJ } onClick = {() => setClickedPJ(!clickedPJ)} />
            </TwoButtons>
            <WebsiteIntroStyled content = 'Customize the MBTI before entering your text. Set the MBTI to shape how the response will be generated.' />
        </MainChatRightScreenStyled>
    )
})

export default MainChatRightScreen;