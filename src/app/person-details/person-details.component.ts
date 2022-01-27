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
    selector: 'app-person-details',
    templateUrl: './person-details.component.html',
    styleUrls: ['./person-details.component.css']
})
export class PersonDetailsComponent implements OnInit {

    @ViewChild('subFilmDetailsModal') myModal: any;
    private modalRef: any;

    person: any;
    personId: any;
    films: any;
    subFilms: any;
    subFilm: any = {
        title: '',
        description: '',
        releaseDate: '',
        rating: ''
    };
    subFilmPersons: any;
    subFilmGenres: any;

    constructor(
        private router: Router,
        private httpClient: HttpClient,
        private filmService: FilmService,
        private modalService: ModalManager,
        private activatedRoute: ActivatedRoute,
        private messageService: MessageService,
        private readonly personService: PersonService,
    ) {
    }

    ngOnInit(): void {
        this.personId = this.activatedRoute.snapshot.params['id'];
        this.populateData(this.personId);
    }

    private populateData(personId: any) {
        this.personService.getPersonDetails(personId).subscribe((data) => {
            console.log(data);
            this.person = data;
        });

        this.filmService.getAllFilmsByPersonId(personId).subscribe((data) => {
            console.log(data.data);
            this.films = data.data.filter((film: any)=> film.description == 'false');
            this.subFilms = data.data.filter((film: any)=> film.description == 'true');
        });
    }

    openModal(id: any) {
        this.populateSubFilmData(id);
        this.modalRef = this.modalService.open(this.myModal, {
            size: "lg",
            modalClass: 'subFilmDetailsModal',
            hideCloseButton: true,
            centered: false,
            backdrop: true,
            animation: true,
            keyboard: false,
            closeOnOutsideClick: true,
            backdropClass: "modal-backdrop"
        })
    }

    populateSubFilmData(id: any) {
        this.subFilm = this.subFilms.filter((data: any) => data.id == id)[0];
        console.log(this.subFilm);

        this.filmService.getFilmPersonList(id, true).subscribe((data) => {
            console.log(data);
            this.subFilmPersons = data;
        });

        this.filmService.getFilmGenreList(id, true).subscribe((data) => {
            console.log(data);
            this.subFilmGenres = data;
        });

        this.filmService.getFilmRating(id, true).subscribe((data) => {
            this.subFilm['rating'] = data;
        });
    }

    closeModal() {
        this.modalService.close(this.modalRef);
    }

}
