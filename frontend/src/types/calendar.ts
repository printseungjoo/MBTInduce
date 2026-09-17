export type CalendarEvent = {
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

export type CalendarDisplayEvent = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
}

export type SelectedRange = {
    startDate: Date | null;
    endDate: Date | null;
}
