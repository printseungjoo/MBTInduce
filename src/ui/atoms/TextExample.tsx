import styled from '@emotion/styled'

const TextInputWrapper = styled.button`
    display: flex;
    align-items: center;
    width: 98%;
    height: 5vh;
    padding: 0 1.2vw 0 1.2vw;
    box-sizing: border-box;
    background-color: ${({ theme }) => theme.colors.dustyPurple};
    border: 0.2px solid ${({ theme }) => theme.colors.lightWhite};
    color: ${({ theme }) => theme.colors.lightWhite};
    position: relative;
    border-radius: 0;
`;

interface TextExampleProps {
    content: string;
    clicked: (textExample: string) => void;
}

export function TextExample({ content, clicked }: TextExampleProps) {
    return(
        <TextInputWrapper onClick = {() => clicked(content)}>
            { content }
        </TextInputWrapper>
    )
}