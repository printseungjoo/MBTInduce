import styled from '@emotion/styled'

interface AdminAverageRatingDivProps {
    title: string;
    number: number | undefined;
}

const AdminAverageRatingDivStyled = styled.div`
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

const FlexDiv = styled.div`
    display: flex;
    gap: 0.6vw;
`;

const NumberH = styled.h2`
    color: ${({ theme }) => theme.colors.lightWhite};
    font-size: 2.5rem;
`;

const OutofFive = styled.h3`
    color: ${({ theme }) => theme.colors.lightWhite};
    margin-top: 3vh;
`;

export default function AdminAverageRatingDiv({ title, number }: AdminAverageRatingDivProps) {
    return(
        <AdminAverageRatingDivStyled>
            <TitleH> { title } </TitleH>
            <FlexDiv>
                <NumberH> { number } </NumberH>
                <OutofFive> / 5.0 </OutofFive>
            </FlexDiv>
        </AdminAverageRatingDivStyled>
    )
}