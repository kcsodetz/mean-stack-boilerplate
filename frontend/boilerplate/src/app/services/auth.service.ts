import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthData } from '../models/auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';


const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'response' as 'response'
};

@Injectable({ providedIn: 'root' })

export class AuthService {
    private token: string;
    private tokenTimer: any;
    private isAuthenticated = false;
    response_login = 'NULL';
    private authStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router) { }


    /**
     * Register a new user
     * @param email New user's email
     * @param username New user's username
     * @param password New user's password
     */
    public registerUser(email: string, username: string, password: string) {
        const auth: AuthData = { email: email, username: username, password: password };
        return this.http.post<Object>('http://localhost:5000/user/register', auth).toPromise();
    }

    /**
     * Reset password if forgotten by user email
     * @param email User's email
     */
    public forgotPassword(email: string) {
        const auth: AuthData = { username: '', password: '', email: email };
        return this.http.post<Object>('http://localhost:5000/user/forgot-password', auth).toPromise();
    }

    /**
     * Change user's password
     * @param newPassword User's new password
     */
    public changePassword(newPassword: string) {
        const auth: AuthData = { username: '', password: newPassword, email: '' };
        return this.http.post<Object>('http://localhost:5000/user/change-password', auth).toPromise();
    }

    /**
     * Change user's email
     * @param newEmail User's new email address
     */
    public changeEmail(newEmail: string) {
        const auth: AuthData = { username: '', password: '', email: newEmail };
        return this.http.post<Object>('http://localhost:5000/user/change-email', auth).toPromise();
    }

    /**
     * Async function to log in a user
     * @param username User's username
     * @param password User's password
     */
    public async login(username: string, password: string) {
        const auth: AuthData = { username: username, password: password, email: '' };
        await this.http.post('http://localhost:5000/user/login', auth, httpOptions).pipe(
            map(response => {
                const token = response.headers.get('token');
                this.token = token;
                if (token) {
                    const expiresInDuration = 7200;
                    this.setAuthTimer(expiresInDuration);
                    this.isAuthenticated = true;
                    this.authStatusListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                    this.response_login = 'complete';
                    console.log(expirationDate);
                    this.addAuthToLocalStorage(token, expirationDate);
                    window.location.replace('/home');
                }
            }
            )).toPromise().catch((error) => {
                if (error.error.message === 'Account has not been verified, please verify your account') {
                    this.response_login = 'verify';
                } else if (error.error.message === 'Error: Password is incorrect') {
                    this.response_login = 'badPass';
                } else if (error.error.message === 'Error: User does not exist, register before logging in') {
                    this.response_login = 'DNE';
                } else {
                    this.response_login = 'failed';
                }
            });
        return this.response_login;
    }

    /**
     * Log out current user
     */
    public logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearLocalStorage();
    }

    /**
     * Get user's current auth token from local storage
     */
    public getAuthToken() {
        if (localStorage['token']) {
            return localStorage['token'];
        }
        return false;
    }

    /**
     * Get auth status as a boolean
     */
    public getAuthenticationStatus() {
        return this.isAuthenticated;
    }

    /**
     * Add authentication data to browser's local storage
     * @param token User's authentication token
     * @param expirationDate User's experation time
     */
    private addAuthToLocalStorage(token: string, expirationDate: Date) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiresIn', expirationDate.toISOString());
    }

    /**
     * Clears all local storage from browser
     */
    private clearLocalStorage() {
        localStorage.clear();
    }

    /**
     * Set token duration
     * @param duration Token validity duration
     */
    private setAuthTimer(duration: number) {
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    /**
     * Get authentication data from browser's local storage, including auth token and expiration time
     */
    public getAuthData() {
        const token = localStorage['token'];
        const expirationDate = localStorage['expiresIn'];
        if (!token || !expirationDate) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate)
        };
    }

    /**
     * Automatically authenticates current user from auth info
     */
    public autoAuthUser() {
        const authInformation = this.getAuthData();
        if (!authInformation) {
            return;
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if (expiresIn > 0) {
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.setAuthTimer(expiresIn / 10);
            this.authStatusListener.next(true);
            return true;
        }
    }
}
