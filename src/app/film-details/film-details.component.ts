import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {FormBuilder} from "@angular/forms";
import {ModalManager} from "ngb-modal";
import {DatePipe} from "@angular/common";
import {ConfirmationService, MessageService, PrimeNGConfig} from "primeng/api";
import {FilmService} from "../core/services/film/film.service";
import {GenreService} from "../core/services/genre/genre.service";
import {PersonService} from "../core/services/person/person.service";
import {ErrorHandlerService} from "../core/services/error-handler.service";

@Component({
    selector: 'app-film-details',
    templateUrl: './film-details.component.html',
    styleUrls: ['./film-details.component.css']
})
export class FilmDetailsComponent implements OnInit {

    @ViewChild('detailsModal') myModal: any;
    private modalRef: any;

    filmId: any;
    film: any;

    subFilm: any = {
        title: '',
        description: '',
        releaseDate: '',
        rating: ''
    };

    subFilms: any;

    filmPersons: any;

    filmGenres: any;

    isSubFilm: boolean = false;

    subFilmPersons: any;
    subFilmGenres: any;

    constructor(
        private router: Router,
        private httpClient: HttpClient,
        private modalService: ModalManager,
        private primengConfig: PrimeNGConfig,
        private activatedRoute: ActivatedRoute,
        private readonly filmService: FilmService
    ) {
    }

    ngOnInit(): void {
        this.primengConfig.ripple = true;
        this.filmId = this.activatedRoute.snapshot.params['id'];
        this.populateData(this.filmId);
    }

    private populateData(filmId: any) {
        this.filmService.getFilmsDetails(filmId).subscribe((data) => {
            this.film = data;
        });

        this.filmService.getAllSubFilms(filmId).subscribe((data) => {
            console.log(data);
            this.subFilms = data.data;
        });

        this.filmService.getFilmRating(filmId, this.isSubFilm).subscribe((data) => {
            console.log(data);
            this.film['rating'] = data;
        });

        this.filmService.getFilmPersonList(filmId, this.isSubFilm).subscribe((data) => {
            console.log(data);
            this.filmPersons = data;
        });

        this.filmService.getFilmGenreList(filmId, this.isSubFilm).subscribe((data) => {
            console.log(data);
            this.filmGenres = data;
        });

    }

    openModal(id: any) {
        this.populateSubFilmData(id);
        this.modalRef = this.modalService.open(this.myModal, {
            size: "lg",
            modalClass: 'detailsModal',
            hideCloseButton: true,
            centered: false,
            backdrop: true,
            animation: true,
            keyboard: false,
            closeOnOutsideClick: true,
            backdropClass: "modal-backdrop"
        })
    }

    closeModal() {
        this.modalService.close(this.modalRef);
    }

    private populateSubFilmData(id: any) {
        this.subFilm = this.subFilms.filter((data: any) => data.id == id)[0];
        console.log(this.subFilm);

        this.filmService.getFilmPersonList(this.subFilm.id, true).subscribe((data) => {
            console.log(data);
            this.subFilmPersons = data;
        });

        this.filmService.getFilmGenreList(this.subFilm.id, true).subscribe((data) => {
            console.log(data);
            this.subFilmGenres = data;
        });

        this.filmService.getFilmRating(this.subFilm.id, true).subscribe((data) => {
            this.subFilm['rating'] = data;
        });
    }
}
