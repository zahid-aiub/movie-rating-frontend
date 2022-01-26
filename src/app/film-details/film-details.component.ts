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
    film: any = {
        title: 'Spider-Man: No Way Home',
        description: 'The moving images of a film are created by photographing actual scenes with a motion-picture camera, ' +
            'by photographing drawings or miniature models using traditional animation techniques,' +
            ' by means of CGI and computer animation, or by a combination of some or all of these techniques, and other visual effects.',
        releaseDate: '12-02-1972',
        rating: '4.8'

    };

    subFilm: any = {
        title: 'Spider-Man: No Way Home',
        description: 'The moving images of a film are created by photographing actual scenes with a motion-picture camera, ' +
            'by photographing drawings or miniature models using traditional animation techniques,' +
            ' by means of CGI and computer animation, or by a combination of some or all of these techniques, and other visual effects.',
        releaseDate: '12-02-1972',
        rating: '4.8'

    };

    /*subFilms: any = [
        {
            id: 1,
            title: 'Spider-Man: No Way Home - 01',
            description: 'The moving images of a film are created by photographing actual scenes with a motion-picture camera',
            releaseDate: '25-10-1980',

        },
        {
            id: 2,
            title: 'Spider-Man: No Way Home - 02',
            description: 'The moving images of a film are created by photographing actual scenes with a motion-picture camera',
            releaseDate: '25-04-1982',

        },
        {
            id: 3,
            title: 'Spider-Man: No Way Home - 03',
            description: 'The moving images of a film are created by photographing actual scenes with a motion-picture camera',
            releaseDate: '25-08-1983',

        },
        {
            id: 4,
            title: 'Spider-Man: No Way Home - 04',
            description: 'The moving images of a film are created by photographing actual scenes with a motion-picture camera',
            releaseDate: '25-04-1985',

        },
        {
            id: 5,
            title: 'Spider-Man: No Way Home - 05',
            description: 'The moving images of a film are created by photographing actual scenes with a motion-picture camera',
            releaseDate: '15-12-1985',

        },
        {
            id: 6,
            title: 'Spider-Man: No Way Home - 06',
            description: 'The moving images of a film are created by photographing actual scenes with a motion-picture camera',
            releaseDate: '15-03-1986',

        }
    ];*/

    subFilms: any;

    filmPersons: any;

    filmGenres: any;

    isSubFilm: boolean = false;

    subFilmPersons: any;
    subFilmGenres: any;

    constructor(
        private router: Router,
        private httpClient: HttpClient,
        private formBuilder: FormBuilder,
        private modalService: ModalManager,
        private readonly datePipe: DatePipe,
        private primengConfig: PrimeNGConfig,
        private messageService: MessageService,
        private activatedRoute: ActivatedRoute,
        private readonly filmService: FilmService,
        private readonly genreService: GenreService,
        private readonly personService: PersonService,
        private confirmationService: ConfirmationService,
        private errorHandlerService: ErrorHandlerService,
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
