import styled from '@emotion/styled'

interface CenterPurplePProps {
    content: string | null;
    className?: string;
}

const CenterPurplePStyled = styled.p`
    text-align: center;
    color: ${({ theme }) => theme.colors.softLavender};
`;

export default function CenterPurpleP({ content, className }: CenterPurplePProps) {
    return(
        <CenterPurplePStyled className = { className }>
            { content }
        </CenterPurplePStyled>
    )
}