import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { apiFetch } from '../../api/client'
import type { SimulationProfile, SimulationTemplate } from '../../types/simulation'
import GoBackButton from '../atoms/GoBackButton'
import OldSimulationButton from '../atoms/OldSimulationButton'
import ListSkeleton from './ListSkeleton'
import StatusMessage from './StatusMessage'
import Modal from './Modal'

interface OldSimulationModalProps {
    onConfirm: () => void;
    onSelectHistory: (history: History) => void;
}

interface History {
    scenario: string;
    name: string;
    mbti: string;
}

export default function OldSimulationModal({ onConfirm, onSelectHistory }: OldSimulationModalProps) {
    const navigate = useNavigate();
    const [remove, setRemove] = useState<boolean>(false);
    const [history, setHistory] = useState<History[]>([]);
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

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
        setStatus('loading');
        try {
            const [scenarioData, targetData] = await Promise.all([
                apiFetch<{ simulationTemplate?: SimulationTemplate[] }>('/api/simulation/simulationTemplate'),
                apiFetch<{ userProfiles?: SimulationProfile[] }>('/api/simulation/userProfiles')
            ]);
            const scenarios: SimulationTemplate[] = scenarioData.simulationTemplate || [];
            const targets: SimulationProfile[] = targetData.userProfiles || [];
            const profileByTemplateId = new Map(
                targets
                    .filter((target) => target.simulationTemplateId)
                    .map((target) => [target.simulationTemplateId as string, target])
            );
            const merged: History[] = [];
            for (const scenario of scenarios) {
                const target = profileByTemplateId.get(scenario.id);
                if (!scenario.content || !target?.name || !target?.mbti) continue;
                merged.push({
                    scenario: scenario.content,
                    name: target.name,
                    mbti: target.mbti
                });
            }
            setHistory(merged);
            setStatus('ready');
        } catch (error) {
            console.error('Error getting history:', error);
            setStatus('error');
        }
    };

    return (
        <>
            {!remove && (
                <Modal desktopWidth = '50vw' onClose = {() => navigate('/Start')}>
                { status === 'loading' && <ListSkeleton count = { 2 } /> }
                { status === 'error' && (
                    <StatusMessage message = 'Could not load simulations.' onRetry = { getHistory } />
                )}
                { status === 'ready' && history.length === 0 && (
                    <StatusMessage message = 'There is no simulation history left' />
                )}
                { status === 'ready' && history.map((h) => (
                    <div key = { `${h.name}-${h.mbti}-${h.scenario}` } onClick = {() => clickHistory(h)}>
                        <OldSimulationButton targetName = { h.name } targetMbti = { h.mbti } scenarioContent = { h.scenario } />
                    </div>
                ))}
                    <GoBackButton />
                </Modal>
            )}
        </>
    )
}