import styled from '@emotion/styled'

interface EditOptionButton {
    content: string;
}

const EditOptionButtonStyled = styled.button`
    background-color: ${({ theme }) => theme.colors.paleLavender};
    color: ${({ theme }) => theme.colors.lightWhite};
`;

export default function EditOptionButton({ content }: EditOptionButton) {
    return(
        <EditOptionButtonStyled>
            { content }
        </EditOptionButtonStyled>
    )
}