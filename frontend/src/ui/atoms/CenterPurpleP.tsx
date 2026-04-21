import styled from '@emotion/styled'

interface CenterPurplePProps {
    content: string;
}

const CenterPurplePStyled = styled.p`
    text-align: center;
    color: ${({ theme }) => theme.colors.softLavender};
`;

export default function CenterPurpleP({ content }: CenterPurplePProps) {
    return(
        <CenterPurplePStyled>
            { content }
        </CenterPurplePStyled>
    )
}