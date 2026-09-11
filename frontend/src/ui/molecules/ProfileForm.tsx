import styled from '@emotion/styled'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'

import { apiFetch } from '../../api/client'
import type { DecisionLetter, EnergyLetter, InformationLetter, LifestyleLetter } from '../../types/mbti'
import { parseMbtiLetters } from '../../types/mbti'
import type { Profile } from '../../types/profile'
import SaveButton from '../atoms/SaveButton'
import GenerateButton from '../atoms/GenerateButton'
import TwoMbti from './TwoMbti'

interface ProfileFormProps {
    fullViewport?: boolean;
    showSavedProfile?: boolean;
    extraActions?: ReactNode;
}

const MainContent = styled.div<{ fullViewport: boolean }>`
    width: ${({ fullViewport }) => fullViewport ? '100vw' : '100%'};
    height: ${({ fullViewport }) => fullViewport ? '100vh' : '100%'};
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4vw;
`;

const Name = styled.h3`
    text-align: center;
    color: ${({ theme }) => theme.colors.lightWhite};
`;

const ProfileCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (max-width: 768px) {
        display: none;
    }
`;

const ProfileMbti = styled.div`
    background-color: ${({ theme }) => theme.colors.royalPurple};
    border: 1px solid ${({ theme }) => theme.colors.mutedViolet};
    border-radius: 17px;
    color: ${({ theme }) => theme.colors.softLavender};
    font-weight: bolder;
    font-size: 1.5rem;
    width: 35%;
    text-align: center;
    margin-top: 1.5vh;
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
    box-sizing: border-box;
    width: min(90vw, 36rem);
    max-height: 85vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    padding: 5vh 4vw;

    @media screen and (min-width: 768px) {
        width: 45vw;
        padding: 2.5vh 1.5vw;
    }
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
    color: ${({ theme }) => theme.colors.deepBlack};

    && {
        color: ${({ theme }) => theme.colors.deepBlack} !important;
        background-color: ${({ theme }) => theme.colors.brightWhite};
        -webkit-text-fill-color: ${({ theme }) => theme.colors.deepBlack} !important;
        color-scheme: only light;
    }
`;

const ProfileInput = styled.input`
    border: 1px solid ${({ theme }) => theme.colors.mutedViolet};
    border-radius: 7px;
    background-color: ${({ theme }) => theme.colors.royalPurple};
    width: 100%;
    height: 4.5vh;
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

export default function ProfileForm({ fullViewport = false, showSavedProfile = false, extraActions }: ProfileFormProps) {
    const [ei, setEi] = useState<EnergyLetter | null>(null);
    const [sn, setSn] = useState<InformationLetter | null>(null);
    const [ft, setFt] = useState<DecisionLetter | null>(null);
    const [pj, setPj] = useState<LifestyleLetter | null>(null);
    const [nickname, setNickname] = useState<string>('');
    const [profileInformation, setProfileInformation] = useState<Profile | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        getProfile();
    }, []);

    async function getProfile() {
        try {
            const data = await apiFetch<{ data: Profile }>('/api/profile');
            setProfileInformation(data.data);
            setNickname(data.data.nickname ?? '');
            const letters = parseMbtiLetters(data.data.mbti);
            setEi(letters.ei);
            setSn(letters.sn);
            setFt(letters.ft);
            setPj(letters.pj);
        } catch (error) {
            console.error(error);
        }
    }

    async function patchProfileInfo(nicknameValue: string, mbtiValue: string) {
        try {
            const data = await apiFetch<{ data: Profile }>('/api/profile', {
                method: 'PATCH',
                body: {
                    nickname: nicknameValue,
                    mbti: mbtiValue
                }
            });
            return data.data;
        } catch(error) {
            console.error(error);
        }
    }

    async function isSaved(){
        if (!ei || !sn || !ft || !pj) {
            window.alert('Please select all MBTI letters.');
            return;
        }
        const mbtiValue = `${ei}${sn}${ft}${pj}`;
        const saved = await patchProfileInfo(nickname, mbtiValue);
        if (!saved) {
            window.alert('Failed to save profile.');
            return;
        }
        window.alert('It is successfully saved.');
        navigate('/Start');
    }

    return (
        <MainContent fullViewport = { fullViewport }>
            <ProfileCard>
                <ProfileLogo src="/ProfileLogo.png" alt="Profile Logo" />
                {showSavedProfile && <Name> { profileInformation?.nickname } </Name>}
                <Email> { profileInformation?.email } </Email>
                {showSavedProfile && <ProfileMbti> { profileInformation?.mbti } </ProfileMbti>}
            </ProfileCard>
            <WriteProfile>
                <WriteProfileP> Edit nickname </WriteProfileP>
                <FlexDiv>
                    <ProfileInput value = { nickname } onChange = {(e) => setNickname(e.target.value)} />
                </FlexDiv>
                <WriteProfileP> MBTI </WriteProfileP>
                <FlexDiv>
                    <TwoMbti first = 'E' second = 'I' isFirstSelected = { ei === 'E' } isSecondSelected = { ei === 'I' } target = {(t) => t ? setEi('E') : setEi('I')} />
                    <TwoMbti first = 'S' second = 'N' isFirstSelected = { sn === 'S' } isSecondSelected = { sn === 'N' } target = {(t) => t ? setSn('S') : setSn('N')} />
                </FlexDiv>
                <FlexDiv>
                    <TwoMbti first = 'F' second = 'T' isFirstSelected = { ft === 'F' } isSecondSelected = { ft === 'T' } target = {(t) => t ? setFt('F') : setFt('T')} />
                    <TwoMbti first = 'P' second = 'J' isFirstSelected = { pj === 'P' } isSecondSelected = { pj === 'J' } target = {(t) => t ? setPj('P') : setPj('J')} />
                </FlexDiv>
                <Mbti> { ei }{ sn }{ ft }{ pj } </Mbti>
                <GenerateButtonPlus content = 'Go to start page' onClick = {() => navigate('/Start')} />
                { extraActions }
                <SaveButtonPlus onClick = { isSaved } />
            </WriteProfile>
        </MainContent>
    );
}
