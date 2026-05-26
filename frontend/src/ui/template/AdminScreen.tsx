import styled from '@emotion/styled'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import LogoutButton from '../atoms/LogoutButton'
import AdminLeftDiv from '../atoms/AdminLeftDiv'
import AdminAverageRatingDiv from '../atoms/AdminAverageRatingDiv'
import AdminMiddleDiv from '../molecules/AdminMiddleDiv'
import AdminRightMainChatDiv from '../molecules/AdminRightMainChatDiv'
import AdminRightSimulationDiv from '../molecules/AdminRightSimulationDiv'

type StatisticsType = {
    totalUsers: number;
    totalQuestions: number;
    totalRatings: number;
    avgRatingResult: number;
    totalChatSessions: number;
    totalHistoryRecords: number;
    totalCalendarEvents: number;
    averageRating: number;
}

const AdminScreenStyled = styled.div`
    box-sizing: border-box;
    margin: 13vh 2vw;    
`;

const MainTitle = styled.h1`
    color: ${({ theme }) => theme.colors.lightWhite};
    font-weight: bolder;
`;

const FlexDiv = styled.div`
    display: flex;
    gap: 1vw;
`;

const Subtitle = styled.p`
    color: ${({ theme }) => theme.colors.lightWhite};
    font-size: 1.5rem;
`;

const MainContentFlexDiv = styled.div`
    display: flex;
    margin-top: 4vh;
    gap: 2.5vw;
`;

const LeftDivs = styled.div`
    display: flex;
    flex-direction: column;
    width: 20%;
    height: 80vh;
    gap: 3vh;
`;

const MiddleDiv = styled.div`
    display: flex;
    flex-direction: column;
    width: 35%;
    height: 80vh;
`;

const RightDiv = styled.div`
    width: 40%;
    height: 80vh;
    display: flex;
    flex-direction: column;
    gap: 2vh;
`;

export default function AdminScreen() {
    const [statistics, setStatistics] = useState<StatisticsType | null>(null);

    const navigate = useNavigate();

    async function getStatistics() {
        try {
            const response = await fetch('http://localhost:4000/api/admin/statistics', {
                method: 'GET',
                credentials: 'include'
            });
            if(!response.ok) {
                throw new Error('Failed to get left statistics');
            }
            const data = await response.json();
            setStatistics(data.data);
        } catch(error) {
            console.error(error);
        }
    }
    
    async function handleLogout() {
        try {
            const response = await fetch('http://localhost:4000/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to logout');
            }
            window.alert('Logged out successfully.');
            navigate('/');
        } catch (error) {
            console.error(error);
            window.alert('Logout failed.');
        }
    }

    useEffect(() => {
        getStatistics();
    }, [])

    return(
        <AdminScreenStyled>
            <MainTitle> MBTInduce </MainTitle>
            <FlexDiv>
                <Subtitle> Admin Panel </Subtitle>
                <LogoutButton onClick = {() => handleLogout()} />
            </FlexDiv>
            <MainContentFlexDiv>
                <LeftDivs>
                    <AdminLeftDiv title = 'Total Users' number = { statistics?.totalUsers } />
                    <AdminAverageRatingDiv title = 'Average Ratings' number = { statistics?.averageRating } />
                    <AdminLeftDiv title = 'Total Messages' number = { statistics?.totalQuestions ? statistics?.totalQuestions*2 : statistics?.totalQuestions } />
                </LeftDivs>
                <MiddleDiv>
                    <AdminMiddleDiv />
                </MiddleDiv>
                <RightDiv>
                    <AdminRightMainChatDiv />
                    <AdminRightSimulationDiv />
                </RightDiv>
            </MainContentFlexDiv>
        </AdminScreenStyled>
    )
}