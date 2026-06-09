import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'

const GoBackStyled = styled.button`
    width: 100%;
    min-height: 4vh;
    height: auto;
    font-weight: bolder;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.coolGray};
    border-radius: 0;
    color: ${({ theme }) => theme.colors.deepBlack};
`;

export default function GoBackButton() {
    const navigate = useNavigate();
    const clickGoBack = () => {
        navigate('/Start');
    };

    return(
        <GoBackStyled onClick = { clickGoBack }>
            Go to start page
        </GoBackStyled>
    )
}