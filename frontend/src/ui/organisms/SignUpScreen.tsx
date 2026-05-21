import styled from '@emotion/styled'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import SaveButton from '../atoms/SaveButton'
import TwoMbti from '../molecules/TwoMbti'
import GenerateButton from '../atoms/GenerateButton'

type EI = 'E' | 'I'
type SN = 'S' | 'N'
type FT = 'F' | 'T'
type PJ = 'P' | 'J'
type profileInfo = {
    id: string,
    email: string,
    nickname: string,
    mbti: string
}

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

export default function SignUpScreen() {
    const [ei, setEi] = useState<EI | null>(null);
    const [sn, setSn] = useState<SN | null>(null);
    const [ft, setFt] = useState<FT | null>(null);
    const [pj, setPj] = useState<PJ | null>(null);
    const [nickname, setNickname] = useState<string>('');
    const [profileInformation, setProfileInformation] = useState<profileInfo | null>(null);

    useEffect(() => {
        getEmail();
    }, []);

    async function getEmail() {
        try {
            const response = await fetch(`http://localhost:4000/api/profile`, {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to get email');
            }
            const data = await response.json();
            setProfileInformation(data.data);
        } catch (error) {
            console.error(error);
        }
    }

    // I will put email and password here later.
    async function postProfileInfo(mbtiValue: string) {
        try {
            const response = await fetch(`http://localhost:4000/api/profile`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nickname,
                    mbti: mbtiValue
                })
            });
            if (!response.ok) {
                throw new Error('Failed to post profile info');
            }
            const data = await response.json();
            return data.data;
        } catch(error) {
            console.error(error);
        }
    }

    const navigate = useNavigate();
    let mbtiValue: string;
    const isSaved = () => {
        mbtiValue = `${ ei }${ sn }${ ft }${ pj }`;
        postProfileInfo(mbtiValue);
        window.alert('It is successfully saved.')
        navigate('/');
    }

    return(
        <SignUpScreenStyled>
            <Title> Sign Up </Title>
            <MainContent>
                <Profile>
                    <ProfileLogo src="/ProfileLogo.png" alt="Profile Logo" />
                    <Email> { profileInformation?.email } </Email>
                </Profile>
                <WriteProfile>
                    <WriteProfileP> Edit nickname </WriteProfileP>
                    <FlexDiv>
                        <ProfileInput value = { nickname } onChange = {(e) => setNickname(e.target.value)} />
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
                    <SaveButtonPlus onClick = { isSaved } />
                </WriteProfile>
            </MainContent>
        </SignUpScreenStyled>
    )
}