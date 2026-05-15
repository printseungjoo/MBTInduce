import styled from '@emotion/styled'

interface HistoryOptionButtonProps {
    name: string;
    clicked?: () => void;
    selected: boolean;
}

const HistoryOptionButtonStyled = styled.button<{ selected: boolean }>`
    border-left: transparent;
    border-right: transparent;
    border-top: transparent;
    border-bottom: 3px solid ${({ theme, selected }) => selected  ? theme.colors.softLavender : 'transparent'};
    color: ${({ theme }) => theme.colors.lightWhite};
    border-radius: 0;
    background-color: transparent;

    &:focus {
        outline: none;
        box-shadow: none;
    }

    &:focus-visible {
        outline: none;
        box-shadow: none;
    }
`;

export default function HistoryOptionButton({ name, clicked, selected }: HistoryOptionButtonProps) {
    return(
        <HistoryOptionButtonStyled onClick = { clicked } selected = { selected }>
            { name }
        </HistoryOptionButtonStyled>
    )
}