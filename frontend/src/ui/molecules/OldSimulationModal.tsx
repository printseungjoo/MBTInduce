import styled from '@emotion/styled'
import { useState, useEffect } from 'react'

import GoBackButton from '../atoms/GoBackButton'
import OldSimulationButton from '../atoms/OldSimulationButton'

interface OldSimulationModalProps {
    onConfirm: () => void;
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
    background: rgba(0, 0, 0, 0.4);
    z-index: 3;
`;

const CenterBox = styled.div`
    width: 50vw;
    background-color: ${({ theme }) => theme.colors.lightWhite};
    border-radius: 1rem;
    padding: 2vh 1vw;
    display: flex;
    flex-direction: column;
    gap: 1.5vh;
`;

export default function OldSimulationModal({ onConfirm }: OldSimulationModalProps) {
    const [remove, setRemove] = useState<boolean>(false);
    const [history, setHistory] = useState<History[]>([]);

    const removeModal = () => {
        setRemove(true);
        onConfirm();
    }

    useEffect(() => {
        getHistory();
    }, []);

    const getHistory = async () => {
        try {
            const [scenarioRes, targetRes] = await Promise.all([
                fetch('http://localhost:4000/api/simulationTemplate', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json' 
                    },
                    credentials: 'include',
                }),
                fetch('http://localhost:4000/api/userProfiles', {
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
                    {history.map((h) => (
                        <OldSimulationButton targetName = { h.name } targetMbti = { h.mbti } scenarioContent = { h.scenario } />
                    ))}
                    <GoBackButton />
                </CenterBox>
            </OldSimulationModalStyled>}
        </>
    )
}