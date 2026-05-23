import styled from '@emotion/styled'
import { useState, useEffect } from 'react'
import type { KeyboardEvent } from 'react'

import TextExample from '../atoms/TextExample'

type TemplateType = {
    title: string;
    content: string;
    category: string;
    isActive: boolean;
    createdById: string;
}

interface TextInputBoxProps {
    onSubmit: (value: string) => void;
    disabled?: boolean;
}

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

export default function SimulationextInputBox({ onSubmit, disabled = false }: TextInputBoxProps) {
    const [text, setText] = useState<string>('');
    const [example, setExample] = useState<string>('');
    const [exampleShown, setExampleShown] = useState<boolean>(false);
    const [templates, setTemplates] = useState<TemplateType[]>([]);

    async function getTemplates() {
        const response = await fetch('http://localhost:4000/api/admin/simulation-question-templates', {
            method: 'GET',
            credentials: 'include'
        });
        if(!response.ok) {
            throw new Error('Failed to get simulation question templates');
        }
        const data = await response.json();
        setTemplates(data.data);
    }

    const textExampleClicked = (textExample: string) => {
        setExample(textExample);
    }

    useEffect(() => {
        getTemplates();
    }, [])

    useEffect(() => {
        setText(text + ' ' + example);
        setExample('');
    }, [example]);

    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
        const trimmedValue = text.trim();
        if (!trimmedValue) return;
        onSubmit(trimmedValue);
        setText('');
        }
    }

    return (
        <TextInputDiv>
            {exampleShown && <ExamplesDiv>
                {templates.map((t) => {
                    return <TextExample content = { t.content } clicked = { textExampleClicked } />
                })}
            </ExamplesDiv>}
            <TextInputBoxDiv>
                <TextExampleButton onClick = {() => setExampleShown(!exampleShown)}>
                    📜
                </TextExampleButton>
                <TextInputBoxStyled placeholder = 'Type your message' value = { text } onChange = {(e) => setText(e.target.value)} disabled = { disabled } onKeyDown = { handleKeyDown } />
            </TextInputBoxDiv>
        </TextInputDiv>
    );
}