import styled from '@emotion/styled'
import { useState, useEffect } from 'react'

import GoBackButton from '../atoms/GoBackButton'
import OldSimulationButton from '../atoms/OldSimulationButton'

interface OldSimulationModalProps {
    onConfirm: () => void;
    onSelectHistory: (history: History) => void;
}

interface ScenarioRequest {
    content: string;
}

interface TargetInfoRequest {
    name: string;
    meOrNot: boolean;
    mbti: string;
    content: string;
}

interface History {
    scenario: string;
    name: string;
    mbti: string;
}

const OldSimulationModalStyled = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3;
`;

const CenterBox = styled.div`
    width: min(90vw, 36rem);
    max-height: 85vh;
    overflow-y: auto;
    background-color: ${({ theme }) => theme.colors.lightWhite};
    border-radius: 1rem;
    padding: 2vh 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5vh;
    box-sizing: border-box;

    @media screen and (min-width: 768px) {
        width: 50vw;
        padding: 2vh 1vw;
    }
`;

export default function OldSimulationModal({ onConfirm, onSelectHistory }: OldSimulationModalProps) {
    const [remove, setRemove] = useState<boolean>(false);
    const [history, setHistory] = useState<History[]>([]);

    const removeModal = () => {
        setRemove(true);
        onConfirm();
    }

    const clickHistory = (selectedHistory: History) => {
        onSelectHistory(selectedHistory);
        removeModal();
    }

    useEffect(() => {
        getHistory();
    }, []);

    const getHistory = async () => {
        try {
            const [scenarioRes, targetRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/simulation/simulationTemplate`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json' 
                    },
                    credentials: 'include',
                }),
                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/simulation/userProfiles`, {
                    method: 'GET',
                    headers: { 
                        'Content-Type': 'application/json' 
                    },
                    credentials: 'include',
                })
            ]);
            if (!scenarioRes.ok || !targetRes.ok) {
                throw new Error('Failed to fetch data');
            }
            const scenarioData = await scenarioRes.json();
            const targetData = await targetRes.json();
            const scenarios: ScenarioRequest[] = scenarioData.simulationTemplate || [];
            const targets: TargetInfoRequest[] = targetData.userProfiles || [];
            const minLength = Math.min(scenarios.length, targets.length);
            const merged: History[] = [];
            for (let i = 0; i < minLength; i++) {
                const s = scenarios[i];
                const t = targets[i];
                if (!s?.content || !t?.name || !t?.mbti) continue;
                merged.push({
                    scenario: s.content,
                    name: t.name,
                    mbti: t.mbti
                });
            }
            setHistory(merged);
        } catch (error) {
            console.error('Error getting history:', error);
        }
    };

    return (
        <>
            {!remove && <OldSimulationModalStyled>
                <CenterBox>
                    {history.map((h, index) => (
                        <div key = { index } onClick = {() => clickHistory(h)}>
                            <OldSimulationButton targetName = { h.name } targetMbti = { h.mbti } scenarioContent = { h.scenario } />
                        </div>
                    ))}
                    <GoBackButton />
                </CenterBox>
            </OldSimulationModalStyled>}
        </>
    )
}