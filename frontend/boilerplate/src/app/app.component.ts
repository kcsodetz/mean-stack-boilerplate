import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { Account } from './models/account.model';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'boilerplate';
  username = 'User';
  userAuthed: Boolean;
  account: Account;
  private loggedIn = new BehaviorSubject<boolean>(false); // {1}
  admObj: Object;

  constructor(public authService: AuthService, public userService: UserService) { }

  get auth() { return (!localStorage.getItem('token')); }

  logout() {
    this.userAuthed = false;
    this.authService.logout();
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnInit() {
    if (this.authService.autoAuthUser()) {
      this.userAuthed = true;
      this.userService.getAccountInfo().then((res) => {
        this.account = new Account(res);
        this.username = this.account.username;
        localStorage.setItem('Username', this.username);
        localStorage.setItem('Email', this.account.email);
      });
    }
  }
}
