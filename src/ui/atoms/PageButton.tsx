import styled from '@emotion/styled'

const PageButtonStyled = styled.button<{ clicked: boolean }>`
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
`;

interface PageButtonProps {
    name: string;
    clicked: boolean;
    clickedName?: () => void;
}

export function PageButton({ name, clicked, clickedName }: PageButtonProps) {
    return(
        <PageButtonStyled clicked = { clicked } onClick = { clickedName }>
            { name }
        </PageButtonStyled>
    )
}