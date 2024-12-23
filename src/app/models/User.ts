export interface UserLogin{
    username: string;
    password: string;
}


export interface AuthResponse {
    access_token: string
    expires_in: string

}


export interface UserAndROLE{
    username: string;
    roles:string[];
}

