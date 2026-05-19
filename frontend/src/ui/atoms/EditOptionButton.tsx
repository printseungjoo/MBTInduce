import styled from '@emotion/styled'

import EditSimulation from '../molecules/EditSimulation'

type EditTarget = 'userName' | 'userMbti' | 'simulationContent';

interface EditOptionButton {
    content: string;
    target: EditTarget;
    id: string;
    onSelect: (target: EditTarget, content: string, id: string) => void;
}

const EditOptionButtonStyled = styled.button`
    background-color: ${({ theme }) => theme.colors.paleLavender};
    color: ${({ theme }) => theme.colors.lightWhite};
`;

export default function EditOptionButton({ content, target, id, onSelect }: EditOptionButton) {
    const goToEditSimulation = () => {
        onSelect(target, content, id);
        <EditSimulation content = { content } target = { target } id = { id }/>
    }

    return(
        <>
            <EditOptionButtonStyled onClick = { goToEditSimulation }>
                { content }
            </EditOptionButtonStyled>
        </>
    )
}