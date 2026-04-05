import styled from '@emotion/styled'

import Title from '../atoms/Title'
import RangeBar from '../molecules/RangeBar'
import GenerateButton from '../atoms/GenerateButton'
import TwoMBTIsButton from '../atoms/TwoMBTIsButton'
import WebsiteIntro from '../atoms/WebsiteIntro'

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
    return(
        <RightScreenStyled>
            <Title title = 'MBTI' />
            <RangeBar leftMbtiLetter = 'E' rightMbtiLetter = 'I' />
            <RangeBar leftMbtiLetter = 'S' rightMbtiLetter = 'N' />
            <RangeBar leftMbtiLetter = 'F' rightMbtiLetter = 'T' />
            <RangeBar leftMbtiLetter = 'P' rightMbtiLetter = 'J' />
            <GenerateButtonStyled />
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