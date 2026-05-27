import styled from '@emotion/styled';

interface UserChatProps {
    content: string;
}

const UserChatStyled = styled.div`
    max-width: 60vw;
    width: fit-content;
    min-width: 0;
    background-color: ${({ theme }) => theme.colors.coolGray};
    padding: 0.8vh 1vw;
    border-radius: 0;
    font-size: 1.2rem;
    line-height: 1.35;
    word-break: break-word;
    box-sizing: border-box;

    @media screen and (max-width: 767px) {
        max-width: 82vw;
        padding: 0.55rem 0.7rem;
        font-size: 0.9rem;
        line-height: 1.35;
    }
`;

export default function UserChat({ content }: UserChatProps) {
    return (
        <UserChatStyled>
            { content }
        </UserChatStyled>
    )
}