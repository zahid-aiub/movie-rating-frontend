import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {FilmService} from "../core/services/film/film.service";
import {ModalManager} from "ngb-modal";
import {MessageService} from "primeng/api";
import {PersonService} from "../core/services/person/person.service";
import {GenreService} from "../core/services/genre/genre.service";

@Component({
    selector: 'app-genre-details',
    templateUrl: './genre-details.component.html',
    styleUrls: ['./genre-details.component.css']
})
export class GenreDetailsComponent implements OnInit {

    @ViewChild('genreDetailsModal') myModal: any;
    private modalRef: any;

    genre: any;
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
    genreId: any;

    constructor(
        private router: Router,
        private httpClient: HttpClient,
        private filmService: FilmService,
        private modalService: ModalManager,
        private activatedRoute: ActivatedRoute,
        private messageService: MessageService,
        private readonly genreService: GenreService,
    ) {
    }

    ngOnInit(): void {
        this.genreId = this.activatedRoute.snapshot.params['id'];
        this.populateData(this.genreId);
    }

    private populateData(genreId: any) {
        this.genreService.getGenreById(genreId).subscribe((data) => {
            console.log(data);
            this.genre = data;
        });

        this.filmService.getAllFilmsByGenreId(genreId).subscribe((data) => {
            let resData: any = [];

            data.forEach((item: any) => {
                const res: any = {};
                res.id = item[0];
                res.isSubFilm = item[1];
                res.releaseDate = item[2];
                res.title = item[3];
                res.rating = item[4];
                resData.push(res);
            });
            this.films = resData;

            this.films = resData.filter((film: any) => film.isSubFilm == 'false');
            this.subFilms = resData.filter((film: any) => film.isSubFilm == 'true');
        });
    }


    openModal(id: any) {
        this.populateSubFilmData(id);
        this.modalRef = this.modalService.open(this.myModal, {
            size: "lg",
            modalClass: 'genreDetailsModal',
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
    }

    closeModal() {
        this.modalService.close(this.modalRef);
    }

    calculateRating(id: any) {
        return this.subFilms.filter((item: any) => item.id == id)[0].rating;
    }

}
