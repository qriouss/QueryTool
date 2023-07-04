import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) { }

  async getLogin(useremail: string, userpassword: string) {
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem("loggedIn");
  }

  async forgotData(useremail: string, password: string) {
  }


}



