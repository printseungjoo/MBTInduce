type clickedNameGeneric = 'Start Page' | 'Main Chat' | 'Simulation' | 'Calendar' | 'History' | 'My Page'

export const getURL = (): clickedNameGeneric => {
    const path = window.location.pathname.replace('/', '');
    const map: Record<string, clickedNameGeneric> = {
        'Start': 'Start Page',
        'MainChat': 'Main Chat',
        'Simulation': 'Simulation',
        'Calendar': 'Calendar',
        'History': 'History',
        'Mypage': 'My Page'
    };
    return map[path] ?? 'Main Chat';
}