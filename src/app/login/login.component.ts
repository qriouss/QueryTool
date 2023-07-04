import { LoginService } from './login.service';
import { Router } from '@angular/router';

import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SqlQueryEditorService } from '../sql-query-editor/sql-query-editor.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  title = 'Login'
  userData: any = {};

  first_from_modal!: string;
  last_from_modal!: string;
  useremail_from_modal!: string;
  code_from_modal!: string;
  newcode_from_modal!: string;
  confirmcode_from_modal!: string;
  flag!: boolean;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private sqlQueryEditorService: SqlQueryEditorService
  ) { }

  ngOnInit(): void {
    sessionStorage.setItem('loggedIn', 'false');
  }


  openSnackBar() {
  }



  async loginUser(data: NgForm) {

    this.sqlQueryEditorService.setLoggedInUserName(data["email"]);
    this.router.navigate(['/home']);
    return;

    let resData: any;
    this.userData = data

    try {
      resData = await this.loginService.getLogin(
        this.userData.email,
        window.btoa(this.userData.password)
        // this.userData.password

      );
      console.log(resData.data);
      if (resData.status === 200) {
        localStorage.setItem("userName", resData.data.firstName);
        localStorage.setItem("userDetails", JSON.stringify(resData.data));

        //  this.utils.setUserDetails(JSON.parse(localStorage.getItem("empData")));


        console.log("welcome to dashboard")
        this.router.navigate(['/home/', 'dashboard'])

        if (resData.data.role.toLowerCase() == "admin") {
          this.flag = true;
          let flagstring = String(this.flag)
          localStorage.setItem("session", flagstring)
          return;
        }

        this.flag = false;
        let flagstring = String(this.flag)
        localStorage.setItem("session", flagstring)
      }

      if (resData.status === 400) {
        this.openSnackBar()
        this.router.navigate(['/', 'login'])
      }
      if (resData.status === 201) {
        this.openSnackBar()
        this.router.navigate(['/', 'login'])
      }

    }
    catch (error) {
      this.openSnackBar()
      return error;
    }



    //   if(this.userData.email=="admin@lntinfotech.com" && this.userData.password=="admin"){
    //     console.log("welcome to dashboard")
    //     this.router.navigate(['/home/','dashboard'])

    //   }
    //   else{
    //     alert("ID or password incorrect!")
    //   }

    // }


  }


  //Ltimindtree@123

  openForgotPassword() {
  }

}
