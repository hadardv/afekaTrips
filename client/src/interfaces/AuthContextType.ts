import { User } from "./User";

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string, studentName: string, username: string) => void;
    logout: () => void;
}