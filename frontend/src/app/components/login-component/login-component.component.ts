import { Component, OnInit } from "@angular/core";
import { AppServiceService } from "src/app/service/app-service.service";
import { LoginForm } from "src/app/models/loginForm.model";
import { TokenStorageService } from "src/app/service/token-storage.service";
import { Tournament } from "src/app/models/Tournament";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-login-component",
  templateUrl: "./login-component.component.html",
  styleUrls: ["./login-component.component.css"]
})
export class LoginComponentComponent implements OnInit {
  username: String;
  password: String;
  resposne: String;
  loginForm: LoginForm;
  isLogged: boolean;
  correctLogin: string;
  incorrectLogin: string;

  constructor(
    private appService: AppServiceService,
    private tokenStorage: TokenStorageService,
    private _snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.username = "";
    this.password = "";
    this.loginForm = new LoginForm();
    if (this.tokenStorage.getToken()) {
      this.isLogged = true;
      console.log("Is logger: " + this.isLogged);
      console.log("Username: " + this.tokenStorage.getUsername());
    }
  
  }

  login() {
    console.log(
      "Username:  " +
        this.loginForm.userName +
        " Password: " +
        this.loginForm.password
    );

    this.appService.login(this.loginForm).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUsername(data.username);
        this.tokenStorage.saveAuthorities(data.authorities);
        this.isLogged = true;
        this.openSnackBarForCorrectLogin("OK");

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      e => {
        console.log("Error: " + e.error);
        this.openSnackBarForIncorrect("OK");
      }
    );
  }

  logout() {
    this.tokenStorage.signOut();
    window.location.reload();
  }

  openSnackBarForIncorrect(action: string) {
    this.translate.get("LOGIN.INCORRECTLOGIN").subscribe((res: string) => {
      this.incorrectLogin = res;
    });
    this._snackBar.open(this.incorrectLogin, action, {
      duration: 2000
    });
  }


  openSnackBarForCorrectLogin(action: string) {
   
    this.translate.get("LOGIN.CORRECTLOGIN").subscribe((res: string) => {
      this.correctLogin = res;
    });
    this._snackBar.open(this.correctLogin, action, {
      duration: 2000
    });
  }
}
