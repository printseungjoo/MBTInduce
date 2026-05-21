type clickedNameGeneric = 'Start Page' | 'Main Chat' | 'Simulation' | 'Calendar' | 'History'

export const getURL = (): clickedNameGeneric => {
    const path = window.location.pathname.replace('/', '');
    const map: Record<string, clickedNameGeneric> = {
        'Start': 'Start Page',
        'MainChat': 'Main Chat',
        'Simulation': 'Simulation',
        'Calendar': 'Calendar',
        'History': 'History'
    };
    return map[path] ?? 'Main Chat';
}