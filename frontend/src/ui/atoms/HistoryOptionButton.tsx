import styled from '@emotion/styled'

interface HistoryOptionButtonProps {
    name: string;
    clicked?: () => void;
    selected: boolean;
}

const HistoryOptionButtonStyled = styled.button<{ selected: boolean }>`
    border-left: ${({ theme }) => theme.colors.transparent};
    border-right: ${({ theme }) => theme.colors.transparent};
    border-top: ${({ theme }) => theme.colors.transparent};
    border-bottom: 2px solid ${({ theme, selected }) => selected  ? theme.colors.softLavender : theme.colors.transparent};
    color: ${({ theme }) => theme.colors.lightWhite};
    border-radius: 0;
    background-color: ${({ theme }) => theme.colors.transparent};
    font-size: 1rem;
    font-weight: 600;
    padding: 0.6vh 0.8vw;

    .history-option-icon {
        display: none;
    }

    &:focus {
        outline: none;
        box-shadow: none;
    }

    &:focus-visible {
        outline: none;
        box-shadow: none;
    }

    @media (max-width: 768px) {
        flex: 1;
        padding: 0.45rem 0 0.35rem;
        font-size: 1.8rem;
        line-height: 1;

        .history-option-text {
            display: none;
        }

        .history-option-icon {
            display: inline;
        }
    }
`;

export default function HistoryOptionButton({ name, clicked, selected }: HistoryOptionButtonProps) {
    const optionIcons: Record<string, string> = {
        'Chat History': '💬',
        'Simulation History': '👥',
        'Schedule': '📅'
    };

    return(
        <HistoryOptionButtonStyled onClick = { clicked } selected = { selected }>
            <span className = "history-option-text"> { name } </span>
            <span className = "history-option-icon"> { optionIcons[name] } </span>
        </HistoryOptionButtonStyled>
    )
}