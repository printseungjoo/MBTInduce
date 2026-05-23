import styled from '@emotion/styled'

interface AdminLeftDivProps {
    title: string;
    number: number | undefined;
}

const AdminLeftDivStyled = styled.div`
    background-color: ${({ theme }) => theme.colors.dustyPurple};
    border: 1px solid ${({ theme }) => theme.colors.softLavender};
    width: 100%;
    height: 20%;
    box-sizing: border-box;
    padding: 2vh 1.5vw;
`;

const TitleH = styled.h4`
    color: ${({ theme }) => theme.colors.paleLavender};
    font-size: 1.2rem;
`;

const NumberH = styled.h2`
    color: ${({ theme }) => theme.colors.lightWhite};
    font-size: 2.5rem;
`;

export default function AdminLeftDiv({ title, number }: AdminLeftDivProps) {
    return(
        <AdminLeftDivStyled>
            <TitleH> { title } </TitleH>
            <NumberH> { number } </NumberH>
        </AdminLeftDivStyled>
    )
}