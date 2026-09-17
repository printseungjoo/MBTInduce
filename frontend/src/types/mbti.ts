export type MbtiRange = {
    eValue: number;
    sValue: number;
    fValue: number;
    pValue: number;
}

export type EnergyLetter = 'E' | 'I'
export type InformationLetter = 'S' | 'N'
export type DecisionLetter = 'F' | 'T'
export type LifestyleLetter = 'P' | 'J'

export function parseMbtiLetters(mbti: string | null): {
    ei: EnergyLetter | null; sn: InformationLetter | null;
    ft: DecisionLetter | null; pj: LifestyleLetter | null;
} {
    const code = mbti?.trim().toUpperCase() ?? '';
    const energy = code[0];
    const information = code[1];
    const decision = code[2];
    const lifestyle = code[3];
    return {
        ei: energy === 'E' || energy === 'I' ? energy : null,
        sn: information === 'S' || information === 'N' ? information : null,
        ft: decision === 'F' || decision === 'T' ? decision : null,
        pj: lifestyle === 'P' || lifestyle === 'J' ? lifestyle : null
    };
}
