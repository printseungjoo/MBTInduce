type clickedNameGeneric = 'Main Chat' | 'Simulation' | 'Calendar' | 'Log In' | 'History'

export const getURL = (): clickedNameGeneric => {
    const path = window.location.pathname.replace('/', '').replace('.html', '');
    const map: Record<string, clickedNameGeneric> = {
        'MainChat': 'Main Chat',
        'Simulation': 'Simulation',
        'Calendar': 'Calendar',
        'LogIn': 'Log In',
    };
    return map[path] ?? 'Main Chat';
}