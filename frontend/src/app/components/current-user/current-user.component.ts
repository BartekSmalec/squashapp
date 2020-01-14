import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { AppServiceService } from 'src/app/service/app-service.service';
import { Tournament } from 'src/app/models/Tournament';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-current-user',
  templateUrl: './current-user.component.html',
  styleUrls: ['./current-user.component.css']
})
export class CurrentUserComponent implements OnInit {
  tournaments: Tournament;
  user: Observable<String>;


  constructor(private userService: AppServiceService) { }

  ngOnInit() {

    console.log("TOURNAMENT TEST")
  
    this.getTournaments();
  }

  getTournaments(): void {

    console.log("TOURNAMENT TEST 2")
    this.userService.getTournamentTest().subscribe(t => this.tournaments = t);
  }

}
