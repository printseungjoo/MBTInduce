import styled from '@emotion/styled'

import { useState, useEffect } from 'react'

interface RatingCounts {
    1: number
    2: number
    3: number
    4: number
    5: number
}

type StatisticsType = {
    id: string;
    userId: string;
    rating: number;
    comment: string;
    createdAt: Date;
    ratingCounts: RatingCounts;
}

const AdminMiddleDivStyled = styled.div`
    width: 100%;
    height: 53.7vh;
    background-color: ${({ theme }) => theme.colors.dustyPurple};
    border: 1px solid ${({ theme }) => theme.colors.softLavender};
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    padding: 1vh 1vw;
`;

const MainTitle = styled.h1`
    color: ${({ theme }) => theme.colors.lightWhite};
    font-weight: bolder;
    padding-top: 1vh;
`;

const StarWrap = styled.div`
    position: relative;
    display: inline-block;
    font-size: 4rem;
    line-height: 1;
`;

const GrayStars = styled.div`
    color: ${({ theme }) => theme.colors.lightWhite};
    font-size: 1.5rem;
`;

const YellowStars = styled.div<{ rating: number }>`
    color: ${({ theme }) => theme.colors.softYellow};
    position: absolute;
    top: 0;
    left: 0;
    width: ${({ rating }) => `${(rating / 5) * 100}%`};
    overflow: hidden;
    white-space: nowrap;
    font-size: 1.5rem;
`;

const PurpleP = styled.p`
    color: ${({ theme }) => theme.colors.paleLavender};
    font-weight: bold;
    padding-top: 1vh;
    padding-bottom: 2vh;
`;

const RatingRow = styled.div`
    display: grid;
    align-items: center;
    margin-bottom: 1.6vh;
    width: 90%;
    grid-template-columns: 1.2rem 1fr 2rem;
    column-gap: 0.25rem;
`

const ScoreText = styled.p`
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0;
`;

const BarArea = styled.div`
    width: 100%;
    height: 0.65rem;
    border-radius: 999px;
`;

const BarFill = styled.div<{ width: string }>`
    width: ${({ width }) => width};
    height: 100%;
    background: ${({ theme }) => theme.colors.softLavender};
    border-radius: 999px;
`;

const CountText = styled.p`
    color: ${({ theme }) => theme.colors.softLavender};
    font-size: 1rem;
    font-weight: bold;
    margin: 0;
`;

export default function AdminMiddleDiv() {
    const [ratingStatistics, setRatingStatistics] = useState<StatisticsType | null>(null);

    async function getRatingStatistics() {
        try {
            const response = await fetch('http://localhost:4000/api/admin/feedback', {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Failed to get middle statistics');
            }
            const data = await response.json();
            setRatingStatistics(data.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getRatingStatistics();
    }, [])

    const maxCount = Math.max(
        ratingStatistics?.ratingCounts[1] ? ratingStatistics?.ratingCounts[1] : 0,
        ratingStatistics?.ratingCounts[2] ? ratingStatistics?.ratingCounts[2] : 0,
        ratingStatistics?.ratingCounts[3] ? ratingStatistics?.ratingCounts[3] : 0,
        ratingStatistics?.ratingCounts[4] ? ratingStatistics?.ratingCounts[4] : 0,
        ratingStatistics?.ratingCounts[5] ? ratingStatistics?.ratingCounts[5] : 0,
        1
    )

    function getWidthPercent(count: number) {
        return `${(count / maxCount) * 100}%`
    }

    return (
        <AdminMiddleDivStyled>
            <MainTitle> { ratingStatistics?.rating } </MainTitle>
            <StarWrap>
                <GrayStars> ★★★★★ </GrayStars>
                <YellowStars rating = { ratingStatistics?.rating ? ratingStatistics?.rating : 0 }> ☆☆☆☆☆ </YellowStars>
            </StarWrap>
            <PurpleP> 1032 Rates </PurpleP>
            {[1, 2, 3, 4, 5].map((score) => {
                const count = ratingStatistics?.ratingCounts[score as keyof RatingCounts]
                return (
                    <RatingRow key = { score }>
                        <ScoreText> { score } </ScoreText>
                        <BarArea>
                            <BarFill width = { getWidthPercent(count ? count : 0) } />
                        </BarArea>
                        <CountText> { count } </CountText>
                    </RatingRow>
                )
            })}
        </AdminMiddleDivStyled>
    )
}