import styled from '@emotion/styled'
import { NavLink } from 'react-router-dom'

const PageButtonStyled = styled(NavLink)<{ clicked: boolean }>`
    width: 95%;
    height: 5vh;
    margin-left: 0.5vw;
    margin-top: 1.5vh;
    background-color: ${({ theme, clicked }) => clicked ? theme.colors.mutedViolet : theme.colors.transparent};
    color: ${({ theme }) => theme.colors.lightWhite};
    text-align: left;
    padding-left: 0.5vw;
    display: flex;
    align-items: center;
    text-decoration: none;
    border: none;
    cursor: pointer;
    box-sizing: border-box;
`;

interface PageButtonProps {
    name: string;
    clicked: boolean;
    to: string;
    onNavigate?: (to: string) => void;
}

export default function PageButton({ name, clicked, to, onNavigate }: PageButtonProps) {
    return(
        <PageButtonStyled clicked = { clicked } to = { to } onClick = {() => onNavigate?.(to)}>
            { name }
        </PageButtonStyled>
    )
}
