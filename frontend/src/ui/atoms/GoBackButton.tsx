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
`;

export default function GoBackButton() {
    const navigate = useNavigate();
    const clickGoBack = () => {
        navigate('/MainChat');
    };

    return(
        <GoBackStyled onClick = { clickGoBack }>
            Go to main page
        </GoBackStyled>
    )
}