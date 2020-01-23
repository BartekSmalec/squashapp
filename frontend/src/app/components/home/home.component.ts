import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { TokenStorageService } from "src/app/service/token-storage.service";
import { Tournament } from "src/app/models/Tournament";
import { AppServiceService } from "src/app/service/app-service.service";
import { Router } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  isLogged: boolean;
  tournament: Tournament;

  constructor(
    private tokenStorage: TokenStorageService,
    private apiService: AppServiceService,
    private router: Router,
    public translate: TranslateService
  ) {
    translate.addLangs(['en', 'pl']);
    translate.setDefaultLang('en');
    

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|pl/) ? browserLang : 'en');

    this.translate.get('HOME.TITLE').subscribe((res: string) => {
      console.log(res);
  });
  }

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.isLogged = true;
      console.log("Is logger: " + this.isLogged);
      console.log("Username: " + this.tokenStorage.getUsername());
      
     
    }
  }

  logout() {
    this.tokenStorage.signOut();
    
    const link = ["/login"];
    console.log("Link: " + JSON.stringify(link));
    this.router.navigate(link);
    
    window.location.reload();
  }

  get() {
    this.apiService.getTournamentTest().subscribe(
      data => {
        this.tournament = new Tournament().deserialize(data);
        console.log(JSON.stringify(this.tournament));
        //window.location.reload();
      },
      e => {
        console.log("Error: " + e.error);
      }
    );
  }

  routeToHome() {
    const link = ["/"];
    console.log("Link: " + JSON.stringify(link));
    this.router.navigate(link);
  }
}
