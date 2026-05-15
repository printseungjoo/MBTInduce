import styled from '@emotion/styled'

const EditButtonStyled = styled.button`
    background-color: ${({ theme }) => theme.colors.softLavender};
    border-radius: 7px;
    color: ${({ theme }) => theme.colors.royalPurple};
    border: 0;
    height: 3vh;
    display: flex;
    align-items: center;

    &:focus {
        outline: none;
        box-shadow: none;
    }

    &:focus-visible {
        outline: none;
        box-shadow: none;
    }
`;

export default function EditButton() {
    return(
        <EditButtonStyled>
            Edit
        </EditButtonStyled>
    )
}