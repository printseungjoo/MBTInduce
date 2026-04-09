import styled from '@emotion/styled'

interface TitleProps {
    title: string;
    className?: string;
}

const TitleStyled = styled.p`
    font-weight: bolder;
    font-size: 2vw;
    color: ${({ theme }) => theme.colors.lightWhite};
    flex-shrink: 0;
`;

export default function Title({ title }: TitleProps) {
    return(
        <TitleStyled>
            { title }
        </TitleStyled>
    )
}