export type SimulationTemplate = {
    id: string;
    content: string;
    createdAt?: string;
}

export type SimulationProfile = {
    id: string;
    name: string;
    meOrNot: boolean;
    mbti: string;
    createdAt?: string;
    simulationTemplateId?: string | null;
}
