import styled from '@emotion/styled'
import { useState, useEffect } from 'react';

import TextExample from '../atoms/TextExample'

const TextInputDiv = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 3vh;
`;

const ExamplesDiv = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const TextInputBoxDiv = styled.div`
    display: flex;
    align-items: center;
    width: 98%;
    height: 5vh;
    margin: 0 1.5vw 0 auto;
    box-sizing: border-box;
    border-radius: 10px;
    background-color: ${({ theme }) => theme.colors.coolGray};
    padding: 0 0.8vw;
`;

const TextExampleButton = styled.button`
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 1.2rem;
    margin-right: 0.5vw;
    width: auto;
    padding: 0;
`;

const TextInputBoxStyled = styled.input`
    flex: 1;
    height: 100%;
    box-sizing: border-box;
    border: none;
    outline: none;
    background: transparent;
    font-size: 1rem;
`;

export default function TextInputBox() {
    const [text, setText] = useState<string>('');
    const [example, setExample] = useState<string>('');
    const [exampleShown, setExampleShown] = useState<boolean>(false);

    const textExampleClicked = (textExample: string) => {
        setExample(textExample);
    }

    useEffect(() => {
        setText(text + ' ' + example);
        setExample('');
    }, [example]);

    return (
        <TextInputDiv>
            {exampleShown && <ExamplesDiv>
                <TextExample content = 'Can you give me honest advice about this situation?' clicked = { textExampleClicked } />
                <TextExample content = 'Can you comfort me about this situation?' clicked = { textExampleClicked } />
                <TextExample content = 'Should I choose option A or option B?' clicked = { textExampleClicked } />
                <TextExample content = 'What are the pros and cons of this decision?' clicked = { textExampleClicked } />
                <TextExample content = 'What would be the logical way to decide this?' clicked = { textExampleClicked } />
                <TextExample content = 'How can I improve myself?' clicked = { textExampleClicked } />
            </ExamplesDiv>}
            <TextInputBoxDiv>
                <TextExampleButton onClick = {() => setExampleShown(!exampleShown)}>
                    📜
                </TextExampleButton>
                <TextInputBoxStyled placeholder = 'Type your message' value = { text } onChange = {(e) => setText(e.target.value)} />
            </TextInputBoxDiv>
        </TextInputDiv>
    );
}