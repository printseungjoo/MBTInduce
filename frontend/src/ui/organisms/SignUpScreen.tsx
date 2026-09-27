import styled from '@emotion/styled'

import ProfileForm from '../molecules/ProfileForm'

const SignUpScreenStyled = styled.div`
    width: 100%;
    max-width: 100%;
    height: 100vh;
    max-height: 100vh;
    overflow: hidden;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3vh 3vw 2vh;
`;

const Title = styled.p`
    color: ${({ theme }) => theme.colors.lightWhite};
    font-weight: bold;
    width: 100%;
    margin: 0 0 2vh;
    text-align: center;
    font-size: 2rem;
    flex-shrink: 0;

    @media screen and (min-width: 768px) {
        font-size: 2.6rem;
    }
`;

const FormWrap = styled.div`
    flex: 1;
    min-height: 0;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
`;

export default function SignUpScreen() {
    return(
        <SignUpScreenStyled>
            <Title> Sign Up </Title>
            <FormWrap>
                <ProfileForm fullViewport />
            </FormWrap>
        </SignUpScreenStyled>
    )
}
