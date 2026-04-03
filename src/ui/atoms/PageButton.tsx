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
    text: string;
}

export function PageButton({ name, clicked, text }: PageButtonProps) {
    const handleClick = () => {
        if (text) {
            location.href = `${text}.html`;
        } 
    };

    return(
        <PageButtonStyled clicked = { clicked } onClick = { handleClick }>
            { name }
        </PageButtonStyled>
    )
}