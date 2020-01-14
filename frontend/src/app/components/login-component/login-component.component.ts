import { Component, OnInit } from '@angular/core';
import { AppServiceService } from 'src/app/service/app-service.service';
@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css']
})
export class LoginComponentComponent implements OnInit {
  username: String;
  password: String;
  resposne: String;


  constructor(private appService: AppServiceService) { }

  ngOnInit() {
    this.username = "" ;
    this.password = "";
  }

  login()
  {
    console.log("Username:  " + this.username + " Password: "+ this.password );

    this.appService.login(this.username, this.password).subscribe(
      (resposne: String) => {
        this.resposne = resposne;

        console.log(this.resposne);
      
      },
      e => {
        console.log("Error: " + e.error);

    
      }
    );
  }

}
