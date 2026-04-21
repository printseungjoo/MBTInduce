import styled from '@emotion/styled'

interface InputProps {
    placeholder: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputStyled = styled.input`
    width: 46%;
    height: 4vh;

    &::placeholder {
        text-align: center;
    }
`;

export default function Input({ placeholder, value, onChange }: InputProps) {
    return(
        <InputStyled placeholder = { placeholder } value = { value } onChange = { onChange }>
        </InputStyled>
    )
}