import styled from '@emotion/styled'

import CenterPurpleP from './CenterPurpleP'

interface OldMainChatButtonProps {
    chatContent: string | null;
}

const OldMainChatButtonStyled = styled.button`
    background-color: ${({ theme }) => theme.colors.transparent};
    width: 100%;
    border: 1px solid ${({theme}) => theme.colors.warmTaupe};
    box-sizing: border-box;
    padding: 1.4vh 1.2vw;
    display: flex;
    flex-direction: column;
    gap: 1vh;
`;

const BoldText = styled.p`
    font-weight: bold;
    color: ${({ theme }) => theme.colors.deepPlum};
    text-align: left;
`;

const CenterPurplePPlus = styled(CenterPurpleP)`
    text-align: left;
`;

export default function OldMainChatButton({ chatContent }: OldMainChatButtonProps) {
    return(
        <OldMainChatButtonStyled>
            <BoldText>
                Chat
            </BoldText>
            <CenterPurplePPlus content = { chatContent }/>
        </OldMainChatButtonStyled>
    )
}