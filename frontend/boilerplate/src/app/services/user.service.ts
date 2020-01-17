import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Account } from '../models/account.model';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    observe: 'response' as 'response'
};

@Injectable({ providedIn: 'root' })

export class UserService {
    renderComponent: String = '';

    constructor(private http: HttpClient) {
    }

    getAccountInfo() {
        return this.http.get<Object>('http://localhost:5000/user/account').toPromise();
    }

    getAllUsers() {
        return this.http.get<Object>('http://localhost:5000/user/get-all-users').toPromise();
    }

    getUserProfile(name: string) {
        const user = {
            headers: new HttpHeaders({
                'username': name
            })
        };
        return this.http.get<Object>('http://localhost:5000/user/find-user', user).toPromise();
    }
}
