import { Component, OnInit } from "@angular/core";
import { User } from "src/app/models/User";
import { AppServiceService } from "src/app/service/app-service.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { UserService } from 'src/app/service/user.service';
import { TokenStorageService } from 'src/app/service/token-storage.service';

@Component({
  selector: "app-edit-user",
  templateUrl: "./editUser.component.html",
  styleUrls: ["./editUser.component.css"]
})
export class EditUserComponent implements OnInit {
  user: User;
  userResponse: User;
  correctRegister: boolean;
  incorrectRegister: boolean;
  repeatedPassword: string;
  userName: string;
  isAdmin: boolean;

  constructor(
    private apiService: AppServiceService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private userService: UserService,
    private tokenStorageService: TokenStorageService
  ) { }

  ngOnInit() {
    this.user = new User();
    this.userResponse = new User();
    this.correctRegister = false;
    this.incorrectRegister = false;
    this.repeatedPassword = "";


    this.route.params.forEach((params: Params) => {
      if (params["userName"] !== undefined) {
        this.userName = params["userName"];
        console.log("Edit userName: " + this.userName);
      } else {
      }
      this.getUserByUserName();
      this.user.password = "";
    });

    if (this.tokenStorageService.getAuthorities().includes("ROLE_ADMIN")) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }

    console.log(
      "Is admin? " +
      this.tokenStorageService.getAuthorities() +
      " " +
      this.isAdmin
    );
  }




  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000
    });
  }

  register() {
    console.log(JSON.stringify(this.user));

    if (this.validateRegisterForm()) {
      this.apiService.updateUser(this.user).subscribe(
        (userResponse: User) => {
          this.userResponse = new User().deserialize(userResponse);

          console.log(this.userResponse);
          this.correctRegister = true;

          this.openSnackBarForValidation("REGISTER.ECORRECT", "OK");

          const link = ["/users"];
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
            this.openSnackBarForValidation("REGISTER.EINCORRECT", "OK");
          }
        }
      );
    }
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

  getUserByUserName() {
    this.userService.getUserByUserName(this.userName).subscribe(
      data => {
        console.log("Corrent: " + JSON.stringify(data));
        this.user = data;
        this.user.password = ""
      },
      e => {
        console.log("Error: " + e.error);
      }
    );
  }

  isNumber(value: string | number): boolean {
    return value != null && value !== "" && !isNaN(Number(value.toString()));
  }

 
}
