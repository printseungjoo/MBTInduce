import styled from '@emotion/styled'
import { NavLink } from 'react-router-dom'

const PageButtonStyled = styled(NavLink)<{ clicked: boolean }>`
    width: 95%;
    height: 5vh;
    margin-left: 0.5vw;
    margin-top: 1.5vh;
    background-color: ${({ theme, clicked }) => clicked ? theme.colors.mutedViolet : 'transparent'};
    color: white;
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
}

export default function PageButton({ name, clicked, to }: PageButtonProps) {
    return(
        <PageButtonStyled clicked = { clicked } to = { to }>
            { name }
        </PageButtonStyled>
    )
}
