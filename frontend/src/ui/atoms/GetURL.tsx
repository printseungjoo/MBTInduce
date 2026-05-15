type clickedNameGeneric = 'Main Chat' | 'Simulation' | 'Calendar' | 'Log In' | 'History'

export const getURL = (): clickedNameGeneric => {
    const path = window.location.pathname.replace('/', '');
    const map: Record<string, clickedNameGeneric> = {
        'MainChat': 'Main Chat',
        'Simulation': 'Simulation',
        'Calendar': 'Calendar',
        'LogIn': 'Log In',
        'History': 'History'
    };
    return map[path] ?? 'Main Chat';
}