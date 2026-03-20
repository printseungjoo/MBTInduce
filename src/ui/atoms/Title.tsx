import styled from '@emotion/styled'

interface TitleProps {
    title: string;
    className?: string;
}

const TitleStyled = styled.p`
    font-weight: bolder;
    font-size: 2.4vw;
    color: ${({ theme }) => theme.colors.lightWhite};
`;

export function Title({ title }: TitleProps) {
    return(
        <TitleStyled>
            { title }
        </TitleStyled>
    )
}