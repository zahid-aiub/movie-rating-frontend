import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MessageService} from "primeng/api";
import {FilmService} from "../core/services/film/film.service";

@Component({
    selector: 'app-suggestion',
    templateUrl: './suggestion.component.html',
    styleUrls: ['./suggestion.component.css']
})
export class SuggestionComponent implements OnInit {

    users: any;
    selectedUser: any;
    films: any;

    constructor(
        private httpClient: HttpClient,
        private messageService: MessageService,
        private readonly filmService: FilmService
    ) {
    }

    ngOnInit(): void {
        this.getAllUsers();
    }

    getAllUsers() {
        this.filmService.getAllUsers().subscribe((data) => {
            console.log(data);
            this.users = data.data;
        });
    }

    suggestedFilms(id: any) {
        console.log(id);
        this.filmService.suggestedFilms(id).subscribe((data) => {
            console.log(data);
            this.films = data.data;
        });
    }

}
