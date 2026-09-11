import styled from '@emotion/styled'

import ProfileForm from '../molecules/ProfileForm'

const SignUpScreenStyled = styled.div`
    height: 100vh;
    box-sizing: border-box;
    padding-top: 4vh;
`;

const Title = styled.p`
    color: ${({ theme }) => theme.colors.lightWhite};
    font-weight: bold;
    position: absolute;
    top: calc(50% - 15.5rem);
    width: 100vw;
    margin: 0;
    text-align: center;
    font-size: 2rem;

    @media screen and (min-width: 768px) {
        font-size: 3rem;
    }
`;

export default function SignUpScreen() {
    return(
        <SignUpScreenStyled>
            <Title> Sign Up </Title>
            <ProfileForm fullViewport />
        </SignUpScreenStyled>
    )
}
