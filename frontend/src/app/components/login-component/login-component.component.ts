import { Component, OnInit } from '@angular/core';
import { AppServiceService } from 'src/app/service/app-service.service';
import { LoginForm } from 'src/app/models/loginForm.model';
import { TokenStorageService } from 'src/app/service/token-storage.service';
@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css']
})
export class LoginComponentComponent implements OnInit {
  username: String;
  password: String;
  resposne: String;
  loginForm: LoginForm;
  isLogged: boolean;



  constructor(private appService: AppServiceService, private tokenStorage: TokenStorageService) { }

  ngOnInit() {
    this.username = "" ;
    this.password = "";
    this.loginForm = new LoginForm;
    if(this.tokenStorage.getToken()) {
      this.isLogged = true;
    }
  }
  

  login()
  {
    console.log("Username:  " + this.loginForm.userName + " Password: "+ this.loginForm.password );

    this.appService.login(this.loginForm).subscribe(
      (data) => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUsername(data.username);
        this.tokenStorage.saveAuthorities(data.authorities);
        this.isLogged = true;
      
      },
      e => {
        console.log("Error: " + e.error);
        
      }
    );
  }
}

