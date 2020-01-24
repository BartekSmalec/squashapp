import { Component, OnInit } from "@angular/core";
import { User } from "src/app/models/User";
import { AppServiceService } from "src/app/service/app-service.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  user: User;
  userResponse: User;
  correctRegister: boolean;
  incorrectRegister: boolean;
  repeatedPassword: string;

  constructor(
    private apiService: AppServiceService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.user = new User();
    this.userResponse = new User();
    this.correctRegister = false;
    this.incorrectRegister = false;
    this.repeatedPassword = "";
  }

  register() {
    console.log(JSON.stringify(this.user));

    if (this.validateRegisterForm()) {
      this.apiService.registerUser(this.user).subscribe(
        (userResponse: User) => {
          this.userResponse = new User().deserialize(userResponse);

          console.log(this.userResponse);
          this.correctRegister = true;

          this.openSnackBarForValidation("REGISTER.CORRECT", "OK");

          const link = ["/login"];
          console.log("Link: " + JSON.stringify(link));

          setTimeout(() => {
            this.router.navigate(link);
          }, 2000);
        },
        e => {
          console.log("Error: " + e.status);

          this.incorrectRegister = true;

          if (e.status === 406) {
            this.openSnackBarForValidation("REGISTER.USEREXIST", "OK");
          } else {
            this.openSnackBarForValidation("REGISTER.INCORRECT", "OK");
          }
        }
      );
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000
    });
  }

  validateRegisterForm(): boolean {
    if (this.user.userName == undefined || this.user.userName == "") {
      this.openSnackBarForValidation("REGISTER.UCANTBENULL", "OK");

      return false;
    } else if (this.user.password == undefined || this.user.password == "") {
      this.openSnackBarForValidation("REGISTER.PCANTBETNULL", "OK");

      return false;
    } else if (
      this.repeatedPassword == undefined ||
      this.repeatedPassword == ""
    ) {
      this.openSnackBarForValidation("REGISTER.RPCANTBENULL", "OK");

      return false;
    } else if (!(this.user.password === this.repeatedPassword)) {
      this.openSnackBarForValidation("REGISTER.PASSNOTEQUAL", "OK");
    } else if (this.user.name == undefined || this.user.name == "") {
      this.openSnackBarForValidation("REGISTER.NCATNBENULL", "OK");

      return false;
    } else if (this.user.surname == undefined || this.user.surname == "") {
      this.openSnackBarForValidation("REGISTER.SCANTBENULL", "OK");

      return false;
    } else if (this.user.age == undefined || this.user.age == "") {
      this.openSnackBarForValidation("REGISTER.AGECANTBENULL", "OK");

      return false;
    } else if (!this.isNumber(this.user.age)) {
      this.openSnackBarForValidation("REGISTER.AGENUMERIC", "OK");

      return false;
    } else {
      return true;
    }
  }

  openSnackBarForValidation(annoucment: string, action: string) {
    this.translate.get(annoucment).subscribe((res: string) => {
      console.log("RES: " + res);
      this._snackBar.open(res, action, {
        duration: 2000
      });
    });
  }

  isNumber(value: string | number): boolean {
    return value != null && value !== "" && !isNaN(Number(value.toString()));
  }
}
