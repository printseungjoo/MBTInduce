import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'

interface GoBackButtonProps {
    content?: string;
    onClick?: () => void;
}

const GoBackStyled = styled.button`
    width: 100%;
    min-height: 4.4vh;
    height: 4.4vh;
    padding: 0 1vw;
    font-weight: bolder;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.coolGray};
    border: 1px solid ${({ theme }) => theme.colors.mutedViolet};
    border-radius: 8px;
    box-sizing: border-box;
    color: ${({ theme }) => theme.colors.deepBlack};
`;

export default function GoBackButton({ content = 'Go to start page', onClick }: GoBackButtonProps) {
    const navigate = useNavigate();
    const clickGoBack = () => {
        if (onClick) {
            onClick();
            return;
        }
        navigate('/Start');
    };

    return(
        <GoBackStyled onClick = { clickGoBack }>
            { content }
        </GoBackStyled>
    )
}