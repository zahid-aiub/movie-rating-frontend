import {Component, OnInit} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {MessageService} from "primeng/api";
import {FilmService} from "../core/services/film/film.service";


const API_URL = environment.apiUrl;

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {


    films: any;
    users: any;
    selectedUser: any;
    selectedFilm: any = {
        id: '',
        title: '',
        description: '',
        releaseDate: '',
        z_rating: ''

    };
    rating: any;
    subFilms: any;

    constructor(
        private httpClient: HttpClient,
        private messageService: MessageService,
        private readonly filmService: FilmService
    ) {
    }

    ngOnInit(): void {
        this.getAllUsers();
        this.getAllFilms();
    }

    getAllUsers() {
        this.filmService.getAllUsers().subscribe((data) => {
            console.log(data);
            this.users = data.data;
        });
    }

    getAllFilms() {
        this.filmService.getAllFilms().subscribe((data) => {
            console.log(data);
            this.films = data.data;
        });
    }

    getAllSubFilmsByFilmId(id: any) {
        this.filmService.getAllSubFilms(id).subscribe((data) => {
            console.log(data);
            this.subFilms = data.data;
        });
    }

    calculateRating(id: any) {
        return this.subFilms.filter((item: any) => item.id == id)[0].z_rating;
    }

    handleSubFilmClick(event: any) {
        console.log(this.selectedFilm);
        this.rating = this.selectedFilm.z_rating;
        this.getAllSubFilmsByFilmId(event.value.id);
    }

    rateToFilm(id: any) {
        if (id && this.selectedUser.id) {
            console.log("---------------")
            const data: any = {};
            data.customerId = this.selectedUser.id;
            data.filmId = id;
            data.isSubFilm = 0;
            data.value = this.rating;

            this.httpClient.post<any>(API_URL + 'ratings', data).subscribe(data => {
                this.messageService.add({
                    key: 'toast-key', severity: 'success', summary: 'Successful',
                    detail: 'Rated successfully!'
                });
            });
        } else {
            this.messageService.add({
                key: 'toast-key', severity: 'error', summary: 'Validation Failed',
                detail: 'Film Not selected'
            });
        }
    }

    rateToSubFilmFilm(id: any) {
        if (id && this.selectedUser.id) {
            const subFilm = this.subFilms.filter((item: any) => item.id == id)[0];
            const data: any = {};
            data.customerId = this.selectedUser.id;
            data.filmId = id;
            data.isSubFilm = 1;
            data.value = subFilm.z_rating;

            this.httpClient.post<any>(API_URL + 'ratings', data).subscribe(data => {
                this.messageService.add({
                    key: 'toast-key', severity: 'success', summary: 'Successful',
                    detail: 'Rated successfully!'
                });
            });
        } else {
            this.messageService.add({
                key: 'toast-key', severity: 'error', summary: 'Validation Failed',
                detail: 'Film Not selected'
            });
        }
    }

}
