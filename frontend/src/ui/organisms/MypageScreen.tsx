import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'

import { apiFetch } from '../../api/client'
import { useAuth } from '../../auth/AuthProvider'
import ProfileForm from '../molecules/ProfileForm'

const MypageScreenStyled = styled.div`
    flex: 1;
    width: 100%;
    min-height: 0;
    box-sizing: border-box;
`;

const RedButton = styled.button`
    background-color: ${({ theme }) => theme.colors.mutedRose};
    border-radius: 7px;
    color: ${({ theme }) => theme.colors.fadedWhite};
    font-weight: bolder;
    border: 1px solid ${({ theme }) => theme.colors.paleLavender};
    height: 4.5vh;
    min-height: 4.5vh;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-bottom: 1.5vh;
    box-sizing: border-box;
`;

export default function MypageScreen() {
    const { clearSession } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await apiFetch('/api/auth/logout', {
                method: 'POST'
            });
            clearSession();
            window.alert('Logged out successfully.');
            navigate('/');
        } catch (error) {
            console.error(error);
            window.alert('Logout failed.');
        }
    }

    async function handleWithdraw() {
        const confirmed = window.confirm('Are you sure you want to delete your account?');
        if (!confirmed) {
            return;
        }
        try {
            await apiFetch('/api/auth/withdraw', {
                method: 'DELETE'
            });
            clearSession();
            window.alert('Your account has been deleted.');
            navigate('/');
        } catch (error) {
            console.error(error);
            window.alert('Account deletion failed.');
        }
    }

    return(
        <MypageScreenStyled>
            <ProfileForm
                showSavedProfile
                extraActions = {
                    <>
                        <RedButton onClick = { handleLogout }> Logout </RedButton>
                        <RedButton onClick = { handleWithdraw }> Withdrawal </RedButton>
                    </>
                }
            />
        </MypageScreenStyled>
    )
}
