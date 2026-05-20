import styled from '@emotion/styled'
import { useState, useEffect } from 'react'

import HistoryDiv from '../molecules/HistoryDiv'
import HistoryOptionButton from '../atoms/HistoryOptionButton'
import EditMainChat from '../molecules/EditMainChat'
import InitialEditSimulation from '../molecules/InitialEditSimulation'
import EditSimulation from '../molecules/EditSimulation'
import InitialEditSchedule from '../molecules/InitialEditSchedule'
import EditSchedule from '../molecules/EditSchedule'

type EditTarget = 'userName' | 'userMbti' | 'simulationContent';
type EditScheduleTarget = 'title' | 'start' | 'end';

interface SimulationTemplate {
    id: string;
    content: string;
    createdAt?: string;
}

interface UserProfile {
    id: string;
    name: string;
    meOrNot: boolean;
    mbti: string;
    createdAt?: string;
}

interface BigCalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
}

interface CalendarEventResponse {
    id: string;
    title: string;
    description: string | null;
    startAt: string;
    endAt: string;
    allDay: boolean;
    mbti: string | null;
    planningNote: string | null;
    createdAt: string;
    updatedAt: string;
}

interface ChatSession {
    id: string;
    userId: string;
    title: string | null;
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;
    _count: {
        messages: number;
    };
}

const Option = styled.div`
    width: 100%;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    border-bottom: 1px solid ${({ theme }) => theme.colors.royalPurple};
    margin-top: 1vh;
    padding-left: 2vw;
    margin-bottom: 1vh;
`;

export default function HistoryScreen() {
    const [optionSelected, setOptionSelected] = useState('Chat History');
    const [simulationTemplates, setSimulationTemplates] = useState<SimulationTemplate[]>([]);
    const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
    const [events, setEvents] = useState<BigCalendarEvent[]>([]);
    const [chatSessions, setChatSessions] = useState<ChatSession[] | null>(null);
    const [isMainEditOpen, setIsMainEditOpen] = useState<boolean>(false);
    const [editingChatId, setEditingChatId] = useState<string | null>(null);
    const [isSimulationEditOpen, setIsSimulationEditOpen] = useState<boolean>(false);
    const [editingSimulationId, setEditingSimulationId] = useState<{userName: string; userMbti: string; simulationContent: string; simulationId: string} | null>(null);
    const [selectedEditTarget, setSelectedEditTarget] = useState<EditTarget | null>(null);
    const [selectedEditContent, setSelectedEditContent] = useState<string>('');
    const [selectedSimulationId, setSelectedSimulationId] = useState<string>('');
    const [isScheduleEditOpen, setIsScheduleEditOpen] = useState<boolean>(false);
    const [editingScheduleId, setEditingScheduleId] = useState<{scheduleId: string; scheduleTitle: string; scheduleStart: Date; scheduleEnd: Date} | null>(null);
    const [selectedScheduleTarget, setSelectedScheduleTarget] = useState<EditScheduleTarget | null>(null);
    const [selectedScheduleContent, setSelectedScheduleContent] = useState<string | Date>('');
    const [selectedScheduleId, setSelectedScheduleId] = useState<string>('');

    function formatDisplayDate(date: Date) {
        return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
    }
    function formatDisplayTime(date: Date) {
        return date.toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
        });
    }

    async function getSimulationData() {
        try {
            const templateResponse = await fetch('http://localhost:4000/api/simulation/simulationTemplate', {
                method: 'GET',
                credentials: 'include',
            });
            const profileResponse = await fetch('http://localhost:4000/api/simulation/userProfiles', {
                method: 'GET',
                credentials: 'include',
            });
            if (!templateResponse.ok || !profileResponse.ok) {
                throw new Error('Failed to fetch simulation data');
            }
            const templateData = await templateResponse.json();
            const profileData = await profileResponse.json();
            setSimulationTemplates(templateData.simulationTemplate);
            setUserProfiles(profileData.userProfiles);
        } catch (error) {
            console.error(error);
        }
    }

    async function loadCalendarEvents() {
        try {
            const response = await fetch('http://localhost:4000/api/calendarEvent', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to get calendar events');
            }
            const result = await response.json();
            const calendarEvents: CalendarEventResponse[] = result.data.events;
            const convertedEvents = calendarEvents.map((event) => ({
                id: event.id,
                title: event.title,
                start: new Date(event.startAt),
                end: new Date(event.endAt),
                allDay: event.allDay,
            }));
            setEvents(convertedEvents);
        } catch (error) {
            console.error(error);
        }
    }

    async function getChatSessions() {
        try {
            const response = await fetch('http://localhost:4000/api/chatMessage/sessions', {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to get chat sessions');
            }
            const data = await response.json();
            setChatSessions(data.sessions);
        } catch (error) {
            console.error(error);
        }
    }

    async function deleteChatSession(selectedChatId: string) {
        try {
            const response = await fetch(`http://localhost:4000/api/chatMessage/sessions/${selectedChatId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await response.json();
            if (!response.ok) {
                alert(data.message || 'Failed to delete chat session.');
                return;
            }
            alert('Chat session deleted successfully.');
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert('Server connection failed.');
        }
    }

    async function deleteSimulationSession(selectedSimulationId: string, selectedUserId: string) {
        try {
            const response = await fetch(`http://localhost:4000/api/simulation/simulationTemplate/${selectedSimulationId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await response.json();
            if (!response.ok) {
                alert(data.message || 'Failed to delete simulation.');
                return;
            }
            const profileResponse = await fetch(`http://localhost:4000/api/simulation/userProfiles/${selectedUserId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const profileData = await profileResponse.json();
            if (!profileResponse.ok) {
                alert(profileData.message || 'Failed to delete schedule.');
                return;
            }
            alert('Schedule deleted successfully.');
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert('Server connection failed.');
        }
    }

    async function deleteSchedule(selectedEventId: string) {
        try {
            const response = await fetch(`http://localhost:4000/api/calendarEvent/${selectedEventId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await response.json();
            if (!response.ok) {
                alert(data.message || 'Failed to delete schedule.');
                return;
            }
            alert('Schedule deleted successfully.');
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert('Server connection failed.');
        }
    }

    useEffect(() => {
        getChatSessions();
        getSimulationData();
        loadCalendarEvents();
    }, [])

    const goToEditMainChat = (chatId: string) => {
        setEditingChatId(chatId);
        setIsMainEditOpen(true);
    }

    const goToEditSimulation = (userName: string, userMbti: string, simulationContent: string, simulationId: string) => {
        setEditingSimulationId({userName, userMbti, simulationContent, simulationId});
        setIsSimulationEditOpen(true);
    }

    const goToEditSchedule = (scheduleId: string, scheduleTitle: string, scheduleStart: Date, scheduleEnd: Date) => {
        setEditingScheduleId({scheduleId, scheduleTitle, scheduleStart, scheduleEnd});
        setIsScheduleEditOpen(true);
    }

    const handleSelectEditTarget = (target: EditTarget, content: string, id: string) => {
        setSelectedEditTarget(target);
        setSelectedEditContent(content);
        setSelectedSimulationId(id);
    }

    const handleSelectScheduleEditTarget = (target: EditScheduleTarget, content: string | Date, id: string) => {
        setSelectedScheduleTarget(target);
        setSelectedScheduleContent(content);
        setSelectedScheduleId(id);
    }

    return(
        <>
            <Option>
                <HistoryOptionButton name = 'Chat History' clicked = {() => setOptionSelected('Chat History')} selected = {optionSelected === 'Chat History'} />
                <HistoryOptionButton name = 'Simulation History' clicked = {() => setOptionSelected('Simulation History')} selected = {optionSelected === 'Simulation History'} />
                <HistoryOptionButton name = 'Schedule' clicked = {() => setOptionSelected('Schedule')} selected = {optionSelected === 'Schedule'} />
            </Option>
            {optionSelected === 'Chat History' && chatSessions?.map((c) => {
                return(
                    <HistoryDiv key = { c.id } title = { 'Chat' } description = { c.title || '' } date = { '' } etc = { '' } onClick = {() => { deleteChatSession(c.id) }} onEditClick = {() => { goToEditMainChat(c.id) }}/>
                )
            })}
            {isMainEditOpen && editingChatId && (<EditMainChat changedChatId = { editingChatId }/>)}
            {optionSelected === 'Simulation History' && simulationTemplates.map((s, index) => {
                const user = userProfiles[index];
                return(
                    <HistoryDiv key = { s.id } title = { user?.name || '' } description = { s.content } date = { s.createdAt || '' } etc = { user?.mbti || '' } onClick = {() => { deleteSimulationSession(s.id, user.id) }} onEditClick = {() => { goToEditSimulation(user.name, user.mbti, s.content, user.id) }}/>)
            })}
            {isSimulationEditOpen && editingSimulationId && (<InitialEditSimulation userName = { editingSimulationId.userName } userMbti = { editingSimulationId.userMbti } simulationContent = { editingSimulationId.simulationContent } simulationId = { editingSimulationId.simulationId } onSelectEditTarget = { handleSelectEditTarget } />)}
            {isSimulationEditOpen && selectedEditTarget && (<EditSimulation content = { selectedEditContent } target = { selectedEditTarget } id = { selectedSimulationId }/>)}
            {optionSelected === 'Schedule' && events.map((e) => {
                return(
                    <HistoryDiv key = { e.id } title = { e.title } description = { formatDisplayDate(e.start) + ' ' + formatDisplayTime(e.start) + ' - ' + formatDisplayDate(e.end) + ' ' + formatDisplayTime(e.end)} date = { '' } etc = { '' } onClick = {() => { deleteSchedule(e.id) }} onEditClick = {() => { goToEditSchedule(e.id, e.title, e.start, e.end) }}/>
                )
            })}
            {isScheduleEditOpen && editingScheduleId && (<InitialEditSchedule id = { editingScheduleId.scheduleId } title = { editingScheduleId.scheduleTitle } start = { editingScheduleId.scheduleStart } end = { editingScheduleId.scheduleEnd } onSelectEditTarget = { handleSelectScheduleEditTarget } />)}
            {isScheduleEditOpen && selectedScheduleTarget && (<EditSchedule id = { selectedScheduleId } target = { selectedScheduleTarget } content = { String(selectedScheduleContent) }/>)}
        </>
    )
}