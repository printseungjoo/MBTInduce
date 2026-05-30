import styled from '@emotion/styled'

interface TitleProps {
    title: string;
    className?: string;
}

const TitleStyled = styled.p`
    font-weight: bolder;
    font-size: clamp(1.6rem, 2vw, 2.4rem);
    color: ${({ theme }) => theme.colors.lightWhite};
    flex-shrink: 0;
    margin: 0;
`;

export default function Title({ title }: TitleProps) {
    return(
        <TitleStyled>
            { title }
        </TitleStyled>
    )
}