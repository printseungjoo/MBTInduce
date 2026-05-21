import styled from '@emotion/styled'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import SaveButton from '../atoms/SaveButton'
import TwoMbti from '../molecules/TwoMbti'
import GenerateButton from '../atoms/GenerateButton'

type EI = 'E' | 'I'
type SN = 'S' | 'N'
type FT = 'F' | 'T'
type PJ = 'P' | 'J'

const SignUpScreenStyled = styled.div`
    height: 100vh;
    box-sizing: border-box;
    padding-top: 4vh;
`;

const Title = styled.p`
    color: ${({ theme }) => theme.colors.lightWhite};
    font-weight: bold;
    position: absolute;
    top: calc(50% - 15.5rem);
    width: 100vw;
    margin: 0;
    text-align: center;
    font-size: 3rem;
`;

const MainContent = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4vw;
`;

const Profile = styled.div`
    display: flex;
    flex-direction: column;
`;

const ProfileLogo = styled.img`
    width: 13rem;
    height: 13rem;
    object-fit: cover;
    margin-bottom: 1vh;
`;

const Email = styled.p`
    text-align: center;
    color: ${({ theme }) => theme.colors.lightWhite};
`;

const WriteProfile = styled.div`
    border: 1px solid ${({ theme }) => theme.colors.mutedViolet};
    border-radius: 7px;
    background-color: ${({ theme }) => theme.colors.deepPlum};
    width: 45vw;
    box-sizing: border-box;
    padding: 2.5vh 1.5vw;
`;

const WriteProfileP = styled.p`
    color: ${({ theme }) => theme.colors.lightWhite};
    font-weight: bold;
    margin-bottom: 1.3vh;
`;

const FlexDiv = styled.div`
    display: flex;
    gap: 1vw;
    margin-bottom: 1.5vh;
`;

const GenerateButtonPlus = styled(GenerateButton)`
    height: 3vh;
    border-radius: 7px;
    margin: 2vh 0;
`;

const ProfileInput = styled.input`
    border: 1px solid ${({ theme }) => theme.colors.mutedViolet};
    border-radius: 7px;
    background-color: ${({ theme }) => theme.colors.royalPurple};
    width: 100%;
    color: ${({ theme }) => theme.colors.lightWhite};
    box-sizing: border-box;
    padding: 0 0.5vw;
`;

const Mbti = styled.p`
    font-weight: bolder;
    color: ${({ theme }) => theme.colors.softLavender};
    text-align: center;
    font-size: 1.5rem;
`;

const SaveButtonPlus = styled(SaveButton)`
    width: 100%;
`;

// it is dummy datum. I will update it soon.
export default function SignUpScreen() {
    const [ei, setEi] = useState<EI | null>(null);
    const [sn, setSn] = useState<SN | null>(null);
    const [ft, setFt] = useState<FT | null>(null);
    const [pj, setPj] = useState<PJ | null>(null);

    const navigate = useNavigate();

    return(
        <SignUpScreenStyled>
            <Title> Sign Up </Title>
            <MainContent>
                <Profile>
                    <ProfileLogo src="/ProfileLogo.png" alt="Profile Logo" />
                    <Email> dummy email </Email>
                </Profile>
                <WriteProfile>
                    <WriteProfileP> Edit nickname </WriteProfileP>
                    <FlexDiv>
                        <ProfileInput />
                        <SaveButton />
                    </FlexDiv>
                    <WriteProfileP> MBTI </WriteProfileP>
                    <FlexDiv>
                        <TwoMbti first = 'E' second = 'I' target = {(t) => t ? setEi('E') : setEi('I')} />
                        <TwoMbti first = 'S' second = 'N' target = {(t) => t ? setSn('S') : setSn('N')}/>
                    </FlexDiv>
                    <FlexDiv>
                        <TwoMbti first = 'F' second = 'T' target = {(t) => t ? setFt('F') : setFt('T')}/>
                        <TwoMbti first = 'P' second = 'J' target = {(t) => t ? setPj('P') : setPj('J')}/>
                    </FlexDiv>
                    <Mbti> { ei }{ sn }{ ft }{ pj } </Mbti>
                    <GenerateButtonPlus content = 'Go to start page' onClick = {() => navigate('/')}/>
                    <SaveButtonPlus />
                </WriteProfile>
            </MainContent>
        </SignUpScreenStyled>
    )
}