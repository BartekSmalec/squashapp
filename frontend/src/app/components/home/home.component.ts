import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { TokenStorageService } from "src/app/service/token-storage.service";
import { Tournament } from 'src/app/models/Tournament';
import { AppServiceService } from 'src/app/service/app-service.service';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  isLogged: boolean;
  tournament: Tournament;


  constructor(private tokenStorage: TokenStorageService, private apiService: AppServiceService) {}

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.isLogged = true;
      console.log("Is logger: " + this.isLogged);
      console.log("Username: " + this.tokenStorage.getUsername());
    }
    //this.tournament = new Tournament;
  }

  logout() {
    this.tokenStorage.signOut();
    window.location.reload();
  }

  get()
  {
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
}
