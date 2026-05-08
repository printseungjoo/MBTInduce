import styled from '@emotion/styled'

interface CheckboxProps {
    text: string;
    checked: boolean;
    onClick?: () => void;
}

const CheckboxDiv = styled.div`
    margin-bottom: 0.75vh;
`;

const CheckboxInput = styled.input`
    color: ${({ theme }) => theme.colors.lightWhite};
`;

const CheckboxLabel = styled.label`
    color: ${({ theme }) => theme.colors.lightWhite};
    font-size: 0.85rem;
`;

export default function Checkbox({ text, checked }: CheckboxProps) {
    return(
        <CheckboxDiv>
            <CheckboxInput type = 'checkbox' id = 'scales' checked = { checked } readOnly />
            <CheckboxLabel htmlFor = 'scales'> { text } </CheckboxLabel>
        </CheckboxDiv>
    )
}