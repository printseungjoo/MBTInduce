export type Profile = {
    id: string;
    email: string;
    nickname: string | null;
    mbti: string | null;
    isAdmin?: boolean;
}
