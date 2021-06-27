import { User } from './../models/user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<User>(1);
  public currentUser$ = this.currentUserSource.asObservable();
  constructor(private http: HttpClient) { }
  login(model: User) {
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(map((res: User) => {
      const user = res;
      if(user)
      {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSource.next(user);
      }
    }));
  }
  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(map((res: User) => {
      const user = res;
      if(user)
      {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSource.next(user);
      }
      return user;
    }));
  }
  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
  setCurrentUser(model: User) {
    this.currentUserSource.next(model);
  }
}
