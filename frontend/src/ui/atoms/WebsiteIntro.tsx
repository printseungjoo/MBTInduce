import styled from '@emotion/styled'

interface WebsiteIntroProps {
    content: string;
    className?: string;
}

const WebsiteIntroStyled = styled.div`
    color: ${({ theme }) => theme.colors.lightWhite};
    background-color: ${({ theme }) => theme.colors.royalPurple};
    font-size: 0.8rem;
    margin: 0 0.5vw;
    padding: 2vh 1vw;
    border-radius: 10px;
    margin-top: auto;
    margin-bottom: 4vh;
`;

export default function WebsiteIntro({ content, className }: WebsiteIntroProps) {
    return(
        <WebsiteIntroStyled className = { className }>
             {content }
        </WebsiteIntroStyled>
    )
}